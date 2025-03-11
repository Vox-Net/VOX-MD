const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("🎵 *What song do you want to download?*");

    try {
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=https://youtube.com/watch?v=${encodeURIComponent(text)}&quality=128kbps`;

        let res = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; MyBot/1.0; +https://mybot.com)"
            }
        });

        let rawText = await res.text(); // Get raw text response
        console.log("Raw API Response:", rawText); // Log API response

        let data;
        try {
            data = JSON.parse(rawText); // Try to parse JSON
        } catch (jsonError) {
            throw new Error("Invalid JSON response from API.");
        }

        if (!data || data.status !== 200 || !data.result || !data.result.media) {
            throw new Error("Failed to fetch the song.");
        }

        const { title, media, metadata, author, url } = data.result;
        const caption = `🎵 *Title:* ${title}\n⏳ *Duration:* ${metadata.duration}\n👤 *Artist:* ${author.name}\n📅 *Uploaded:* ${metadata.uploadDate}\n📈 *Views:* ${metadata.views}\n🔗 *YouTube Link:* ${url}\n🎶 *Format:* MP3 (128kbps)`;

        await client.sendMessage(m.chat, { image: { url: metadata.thumbnail }, caption }, { quoted: m });
        await client.sendMessage(m.chat, { document: { url: media }, mimetype: "audio/mpeg", fileName: `${title}.mp3` }, { quoted: m });

    } catch (error) {
        console.error("Error fetching the song:", error.message);
        m.reply(`❌ *Download failed:* ${error.message}`);
    }
};
