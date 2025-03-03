module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("🎵 *What song do you want to download?*");

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("❌ *No songs found!*");
        }

        const urlYt = videos[0].url;

        try {
            let data = await fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`);

            if (!data || data.status !== 200) {
                throw new Error("Failed to fetch the song.");
            }

            const { metadata, media } = data.result;

            await m.reply(`✅ *Downloading:* *${metadata.title}*\n⏳ Please wait...`);

            await client.sendMessage(
                m.chat,
                {
                    document: { url: media },
                    mimetype: "audio/mpeg",
                    fileName: `${metadata.title}.mp3`,
                },
                { quoted: m }
            );
        } catch (error) {
            console.error("API request failed:", error.message);
            m.reply("❌ *Download failed: Unable to retrieve audio.*");
        }
    } catch (error) {
        m.reply("❌ *Download failed:*\n" + error.message);
    }
};
