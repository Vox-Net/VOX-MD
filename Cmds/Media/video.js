const axios = require("axios");
const ytSearch = require("yt-search");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ What video do you want to download?");

    await m.reply("🔄 *VOX MD Bot is fetching your video... Please wait...*");

    try {
        let search = await ytSearch(text);
        let video = search.videos[0];

        if (!video) return m.reply("❌ No results found. Please refine your search.");

        let title = video.title;
        let link = video.url;
        
        let apis = [
            `https://fastrestapis.fasturl.cloud/downup/ytdown-v2?name=${encodeURIComponent(title)}&format=mp4&quality=720`,
            `https://fastrestapis.fasturl.cloud/downup/ytdown-v1?url=${encodeURIComponent(link)}&format=mp4&quality=720&server=auto`
        ];

        async function fetchWithRetry(apiList, retries = 3, delay = 5000) {
            for (let api of apiList) {
                for (let i = 0; i < retries; i++) {
                    try {
                        const response = await axios.get(api, { timeout: 30000, headers: { "accept": "application/json" } });
                        if (response.data && response.data.status === 200) {
                            return response.data.result;
                        }
                        throw new Error(response.data.error || "Invalid API response");
                    } catch (error) {
                        console.error(`Attempt ${i + 1} failed for ${api}: ${error.message}`);
                        if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
                    }
                }
            }
            throw new Error("Failed to fetch video data after multiple attempts.");
        }

        let data = await fetchWithRetry(apis);

        let videoData = {
            title: data.title,
            artist: data.author.name,
            thumbnail: data.metadata.thumbnail,
            videoUrl: data.url,
            downloadUrl: data.media
        };

        // Send metadata & thumbnail
        await client.sendMessage(
            m.chat,
            {
                image: { url: videoData.thumbnail },
                caption: `KANAMBO THE VOX MD BOT
╭═════════════════⊷
║ 🎬 *Title:* ${videoData.title}
║ 🎤 *Artist:* ${videoData.artist}
╰═════════════════⊷
*Powered by VOX MD BOT*`
            },
            { quoted: m }
        );

        // Send as a regular video
        await client.sendMessage(
            m.chat,
            {
                video: { url: videoData.downloadUrl },
                mimetype: "video/mp4",
                caption: `🎬 *${videoData.title}*`,
            },
            { quoted: m }
        );

        // Send as a document file (for easy downloading)
        await client.sendMessage(
            m.chat,
            {
                document: { url: videoData.downloadUrl },
                mimetype: "video/mp4",
                fileName: `${videoData.title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp4`,
            },
            { quoted: m }
        );

        // Send success message
        await m.reply("✅ *Successfully sent! 🎬*");

    } catch (error) {
        console.error("Error:", error.message);
        return m.reply("❌ Download failed\n" + error.message);
    }
};