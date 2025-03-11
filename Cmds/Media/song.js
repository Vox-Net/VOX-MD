const fetch = require('node-fetch');
const yts = require('yt-search');

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) return m.reply("🎵 *What song do you want to download?*");

        // Search for the song
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("❌ *No songs found!*");
        }

        const video = videos[0];
        const urlYt = video.url;
        const songTitle = video.title.replace(/[^\w\s]/gi, ""); // Remove special characters

        // Inform the user that the download is in progress
        await m.reply("⏳ *Please wait...*");

        // Fetch the song download link
        let url = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`;
        let res = await fetch(url);
        let json = await res.json();

        if (!json || json.status !== 200 || !json.result?.media) {
            return m.reply("❌ *Download failed: Unable to retrieve audio.*");
        }

        const { media } = json.result;

        let caption = `🎵 *Title:* ${video.title}\n`
            + `⏳ *Duration:* ${video.timestamp}\n`
            + `👤 *Artist:* ${video.author.name}\n`
            + `📅 *Published:* ${video.ago}\n`
            + `📈 *Views:* ${video.views}\n`
            + `🔗 *YouTube:* ${video.url}\n`
            + `🎶 *Format:* MP3 (128kbps)`;

        // Send thumbnail and metadata
        await client.sendMessage(
            m.chat,
            { image: { url: video.image }, caption },
            { quoted: m }
        );

        // Send the MP3 file
        await client.sendMessage(
            m.chat,
            {
                document: { url: media },
                mimetype: "audio/mpeg",
                fileName: `${songTitle}.mp3`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Error fetching song:", error);
        m.reply("❌ *Error fetching the song.*");
    }
};
