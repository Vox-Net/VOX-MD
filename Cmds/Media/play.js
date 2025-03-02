module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("🎵 *Please provide a YouTube link!*");

        let data = await fetchJson(`https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(text)}`);

        if (!data || !data.url) {
            return m.reply("❌ *Failed to retrieve audio!* Please check the link.");
        }

        const { title, author, lengthSeconds, thumbnail, url, quality, filename } = data;

        let message = `🎶 *Audio Download Ready!*\n\n`;
        message += `📌 *Title:* ${title}\n`;
        message += `🎤 *Channel:* ${author}\n`;
        message += `⏳ *Duration:* ${lengthSeconds} seconds\n`;
        message += `🔉 *Quality:* ${quality}\n\n`;
        message += `📥 *Downloading...*`;

        await m.reply(message);

        await client.sendMessage(
            m.chat,
            {
                document: { url },
                mimetype: "audio/mpeg",
                fileName: `${filename}.mp3`,
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("API Error:", error.message);
        m.reply("❌ *Download failed.* Please try again later.");
    }
};
