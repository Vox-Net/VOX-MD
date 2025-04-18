const {
  BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto,
  generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser,
  getContentType, jidNormalizedUser
} = require("baileys");

const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const speed = require("performance-now");

const {
  smsg, formatp, tanggal, formatDate, getTime, sleep, clockString,
  fetchJson, getBuffer, jsonformat, generateProfilePicture, parseMention, getRandom, fetchBuffer
} = require('./lib/botFunctions.js');

const { exec, spawn, execSync } = require("child_process");
const { TelegraPh, UploadFileUgu } = require("./lib/toUrl");
const uploadtoimgur = require('./lib/Imgur');
const { readFileSync } = require('fs');

const ytmp3 = require('./lib/ytmp3');
const { commands, aliases, totalCommands } = require('./VoxMdhandler');

const blocked_users = require('./Functions/blocked_users');
const status_saver = require('./Functions/status_saver');
const eval2 = require('./Functions/eval2');
const eval = require('./Functions/eval');
const antiviewonce = require('./Functions/antiviewonce');
const gcPresence = require('./Functions/gcPresence');
const antilink = require('./Functions/antilink');
const antitaggc = require('./Functions/antitag');
const masterEval = require('./Functions/masterEval');
const antidel = require('./Functions/antidelete');

const {
  presence, autoread, botname, mode, prefix, mycode, author, packname,
  dev, gcpresence, antionce, antitag, antidelete
} = require('./settings');

module.exports = voxmd = async (client, m, chatUpdate, store) => {
  try {
    if (!m || !m.message) return; // Prevent bot from crashing if message is undefined

    let body =  
      m.mtype === "conversation" ? m.message.conversation :
      m.mtype === "imageMessage" ? m.message.imageMessage.caption :
      m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
      "";

    let Tag = (m.mtype == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo) 
      ? m.message.extendedTextMessage.contextInfo.mentionedJid 
      : [];

    let msgDreaded = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
    let budy = typeof m.text == "string" ? m.text : "";

    const timestamp = speed();
    const dreadedspeed = speed() - timestamp;

    const pict = await fs.readFileSync('./Voxmdgall/VOX-MD-BOT-LOGO.jpg');

    const cmd = body.startsWith(prefix);
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";

    const botNumber = jidNormalizedUser(client.user.id);
    const itsMe = m.sender === botNumber;
    let text = args.join(" ");
    const arg = budy.trim().substring(budy.indexOf(" ") + 1);
    const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

    const getGroupAdmins = (participants) => {
      return participants.filter(p => p.admin === "superadmin" || p.admin === "admin").map(p => p.id);
    };

    const fortu = (m.quoted || m);
    const quoted = (fortu.mtype == 'buttonsMessage') ? fortu[Object.keys(fortu)[1]] :
      (fortu.mtype == 'templateMessage') ? fortu.hydratedTemplate[Object.keys(fortu.hydratedTemplate)[1]] :
      (fortu.mtype == 'product') ? fortu[Object.keys(fortu)[0]] :
      (m.quoted ? m.quoted : m);

    const color = (text, color) => chalk.keyword(color || "green")(text);

    const mime = (quoted.msg || quoted).mimetype || "";
    const qmsg = (quoted.msg || quoted);

    const DevDreaded = dev.split(",");
    const Owner = DevDreaded.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);

    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(() => { }) : "";
    const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : "";
    const participants = m.isGroup && groupMetadata ? groupMetadata.participants : "";
    const groupAdmin = m.isGroup ? getGroupAdmins(participants) : [];
    const isBotAdmin = m.isGroup ? groupAdmin.includes(botNumber) : false;
    const isAdmin = m.isGroup ? groupAdmin.includes(m.sender) : false;
    const IsGroup = m.chat?.endsWith("@g.us");

    const context = {
      client, m, text, Owner, chatUpdate, store, isBotAdmin, isAdmin, IsGroup, participants,
      pushname, body, budy, totalCommands, args, mime, qmsg, msgDreaded, botNumber, itsMe,
      packname, author, generateProfilePicture, groupMetadata, dreadedspeed, mycode,
      fetchJson, exec, getRandom, UploadFileUgu, TelegraPh, prefix, cmd, botname, mode, gcpresence, antitag, antidelete, antionce, fetchBuffer, store, uploadtoimgur, chatUpdate, ytmp3, getGroupAdmins, pict, Tag
    };

    if (cmd && mode === 'private' && !itsMe && !Owner && m.sender !== "254114148625@s.whatsapp.net") {
      return;
    }

    // Handling bot features
    await antidel(client, m, antidelete);
    await status_saver(client, m, Owner, prefix);
    await eval2(client, m, Owner, budy, fetchJson);
    await eval(client, m, Owner, budy, fetchJson, store);
    await antilink(client, m, isBotAdmin, isAdmin, Owner, body);
    await antiviewonce(client, m, antionce);
    await gcPresence(client, m, gcpresence);
    await antitaggc(client, m, isBotAdmin, itsMe, isAdmin, Owner, body, antitag);
    await masterEval(client, m, Owner, budy, fetchJson, store);

    const commandName = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase() : null;
    const resolvedCommandName = aliases[commandName] || commandName;

    if (commands[resolvedCommandName]) {
      try {
        await commands[resolvedCommandName](context);
      } catch (err) {
        console.error(`❌ Error executing ${resolvedCommandName}:`, err);
      }
    }

  } catch (err) {
    console.error(util.format(err));
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', function (err) {
  const e = String(err);
  if (["conflict", "not-authorized", "Socket connection timeout", "rate-overlimit", "Connection Closed", "Timed Out", "Value not found"].some(msg => e.includes(msg))) {
    return;
  }
  console.error('Caught exception:', err);
});
