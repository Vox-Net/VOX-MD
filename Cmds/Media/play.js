module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What song do you want to download?");

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No songs found!");
        }

        const urlYt = videos[0].url;

        try {
            let data = await fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`);

            const { title, url: audioUrl } = data.result;

            await m.reply(`_Downloading ${title}_`);

            await client.sendMessage(
                m.chat,
                {
                    document: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title}.mp3`,
                },
                { quoted: m }
            );
        } catch (error) {
            console.error("API request failed:", error.message);
            m.reply("Download failed: Unable to retrieve audio.");
        }
    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};