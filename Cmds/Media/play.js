const axios = require("axios");
const ytSearch = require("yt-search");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ What song do you want to download?");

    await m.reply("🔄 *VOX MD Bot is fetching your audio just a moment😚... Please wait...*");

    try {
        let search = await ytSearch(text);
        let video = search.videos[0];

        if (!video) return m.reply("❌ No results found. Please refine your search.");

        let link = video.url;
        let apis = [
            `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`,
`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${link}`,
`https://api.ryzendesu.vip/api/downloader/ytmp3?url=${link}`
        ];

        for (const api of apis) {
            try {
                let { data } = await axios.get(api);

                if (data.status === 200 || data.success) {
                    let audioUrl = data.result?.downloadUrl || data.url;
                    let songData = {
                        title: data.result?.title || video.title,
                        artist: data.result?.author || video.author.name,
                        thumbnail: data.result?.image || video.thumbnail,
                        videoUrl: link
                    };

                    // Send metadata & thumbnail
                    await client.sendMessage(
                        m.chat,
                        {
                            image: { url: songData.thumbnail },
                            caption: `KANAMBO THE VOX MD BOT
╭═════════════════⊷
║ 🎶 *Title:* ${songData.title}
║ 🎤 *Artist:* ${songData.artist}
╰═════════════════⊷
*Powered by VOX MD BOT*`
                        },
                        { quoted: m }
                    );

                    await m.reply("📤 *Sending your audio and file...*");

                    // Send as an audio file
                    await client.sendMessage(
                        m.chat,
                        {
                            audio: { url: audioUrl },
                            mimetype: "audio/mp4",
                        },
                        { quoted: m }
                    );

                 

                    // Send as a document file
                    await client.sendMessage(
                        m.chat,
                        {
                            document: { url: audioUrl },
                            mimetype: "audio/mp3",
                            fileName: `${songData.title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`,
                        },
                        { quoted: m }
                    );

                    // Send success message
                    await m.reply("✅ *successfully sent ! 🎶*");

                    return; // Stop execution if successful
                }
            } catch (e) {
                console.error(`API Error (${api}):`, e.message);
                continue; // Try next API if one fails
            }
        }

        // If all APIs fail
        return m.reply("⚠️ An error occurred. All APIs might be down or unable to process the request.");
    } catch (error) {
        return m.reply("❌ Download failed\n" + error.message);
    }
};