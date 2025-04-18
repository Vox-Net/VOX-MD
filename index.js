

const {
  default: makeWABot,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  downloadContentFromMessage,
  jidDecode,
  proto,
  getContentType,
} = require("baileys");

const pino = require("pino");
const fs = require("fs");
const path = require("path");
const express = require("express");
const { Boom } = require("@hapi/boom");
const chalk = require("chalk");
const { DateTime } = require("luxon");
const PhoneNumber = require("awesome-phonenumber");
const { exec } = require("child_process");

require("events").EventEmitter.defaultMaxListeners = 100;

// Custom libs
const { session } = require("./settings");
const authenticateSession = require("./kanambo");
const { smsg } = require("./smsg");
const {
  autoview,
  presence,
  autoread,
  botname,
  autobio,
  mode,
  prefix,
  dev,
  autolike
} = require("./settings");
const { commands, totalCommands } = require("./VoxMdhandler");
const groupEvents = require("./groupEvents");
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require("./lib/exif");
const { getBuffer, fetchJson, sleep } = require("./lib/botFunctions");

// Express App for Koyeb Always-On
const app = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("VOX-MD is alive!"));
app.listen(port, () => console.log(`✅ Server running on port ${port}`));

// In-memory store
const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" })
});

authenticateSession();

async function startBot() {
  const { saveCreds, state } = await useMultiFileAuthState("session");

  const client = makeWABot({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    browser: ["VOX-MD", "Chrome", "5.0"],
    auth: state,
  });

  store.bind(client.ev);
  setInterval(() => store.writeToFile("store.json"), 5000);

  if (autobio === "true") {
    setInterval(async () => {
      try {
        const date = new Date();
        await client.updateProfileStatus(
          `⚡ ${botname} active 24/7 ⚡ | ${date.toLocaleString("en-US", {
            timeZone: "Africa/Nairobi",
            weekday: "long"
          })}`
        );
      } catch (_) {}
    }, 80000);
  }

  client.ev.on("messages.upsert", async ({ messages }) => {
    const mek = messages[0];
    if (!mek?.message) return;

    mek.message = mek.message?.ephemeralMessage?.message || mek.message;
    const jid = mek.key.remoteJid;

    if (autoview === "true" && jid === "status@broadcast") {
      await client.readMessages([mek.key]);
    }

    if (autolike === "true" && jid === "status@broadcast") {
      try {
        const participant = mek.key.participant || mek.participant || mek.key.remoteJid;
        await client.sendMessage(jid, { react: { key: mek.key, text: "🥷" } });
      } catch (_) {}
    }

    if (autoread === "true" && jid.endsWith("@s.whatsapp.net")) {
      await client.readMessages([mek.key]);
    }

    if (presence && jid) {
      await client.sendPresenceUpdate(presence.toLowerCase(), jid);
    }

    const sender = mek.key.fromMe
      ? client.user.id
      : mek.key.participant || mek.key.remoteJid;

    const owner = "254114148625";
    if (
      mode === "private" &&
      !mek.key.fromMe &&
      ![`${owner}@s.whatsapp.net`, `${dev}@s.whatsapp.net`].includes(sender)
    ) return;

    const m = smsg(client, mek, store);
    require("./Voxdat")(client, m, { messages }, store);
  });

  client.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log(chalk.greenBright("✅ Connected. VOX-MD is active."));

      try {
        const inviteCode = "GtX7EEvjLSoI63kInzWwID";
        const groupInfo = await client.groupGetInviteInfo(inviteCode);
        if (groupInfo) await client.groupAcceptInvite(inviteCode);
      } catch (_) {}

      const time = DateTime.now()
        .setZone("Africa/Nairobi")
        .toFormat("hh:mm a");

      const greet = () => {
        const hour = DateTime.now().setZone("Africa/Nairobi").hour;
        if (hour < 12) return "🌄 Good Morning";
        if (hour < 18) return "☀️ Good Afternoon";
        if (hour < 22) return "🌆 Good Evening";
        return "🌙 Good Night";
      };

      const message = `╭═══💠 *VOX-MD BOT* 💠═══╮\n┃ _*BOT STATUS*_: Online✅\n┃ 🔓 *MODE:* ${mode.toUpperCase()}\n┃ 📝 *PREFIX:* ${prefix}\n┃ ⚙️ *COMMANDS:* ${totalCommands}\n╰═══〘 *KANAMBO* 〙═══╯\n\n✨ ${greet()}, using *VOX-MD*! 🚀`;

      await client.sendMessage("254114148625@s.whatsapp.net", { text: message });
    }

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log(
        chalk.red(`❌ Disconnected. Reason: ${DisconnectReason[reason] || reason}`)
      );
      startBot(); // auto-restart
    }
  });

  client.ev.on("creds.update", saveCreds);

  client.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    }
    return jid;
  };

  client.getName = async (jid, withoutContact = false) => {
    const id = client.decodeJid(jid);
    let v = store.contacts[id] || {};
    if (id.endsWith("@g.us")) {
      v = v.name || v.subject ? v : await client.groupMetadata(id) || {};
      return v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international");
    }
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.verifiedName ||
      PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international")
    );
  };

  client.downloadMediaMessage = async (message) => {
    const mime = (message.msg || message).mimetype || '';
    const type = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };

  client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    const buffer = await client.downloadMediaMessage(message);
    const filePath = attachExtension
      ? `${filename}.${(await FileType.fromBuffer(buffer)).ext}`
      : filename;
    fs.writeFileSync(filePath, buffer);
    return filePath;
  };
}

startBot();
