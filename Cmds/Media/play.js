const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const yts = require('youtube-yts');
const ffmpeg = require('fluent-ffmpeg');
const mime = require('mime-types');
const { promisify } = require('util');
const { pipeline } = require('stream');
const { ytmp4 } = require('api-qasim');

const streamPipeline = promisify(pipeline);
const customTmpDir = path.join(__dirname, 'custom_tmp');
if (!fs.existsSync(customTmpDir)) fs.mkdirSync(customTmpDir);

module.exports = async (context) => {
    const { client, m, text } = context;
    if (!text) return client.sendMessage(m.chat, { text: '✳️ Enter a song name to search!' }, { quoted: m });

    client.ultra = client.ultra || {};
    await client.sendMessage(m.chat, { react: { text: '🎶', key: m.key } });

    const result = await searchAndDownloadMusic(text);
    if (!result.allLinks.length) {
        return client.sendMessage(m.chat, { text: '❌ No results found.' }, { quoted: m });
    }

    const infoText = `✦ ──『 *ULTRA PLAYER* 』── ⚝ \n\n🎵 Reply with a number to select a song:\n\n`;
    const orderedLinks = result.allLinks.map((link, index) => `*${index + 1}.* ${link.title}`).join('\n\n');
    const fullText = `${infoText}\n${orderedLinks}`;

    const { key } = await client.sendMessage(m.chat, { text: fullText }, { quoted: m });

    client.ultra[m.sender] = {
        result,
        key,
        timeout: setTimeout(() => {
            client.sendMessage(m.chat, { delete: key });
            delete client.ultra[m.sender];
        }, 150 * 1000),
    };

    client.once('message', async (msg) => {
        if (!client.ultra[msg.sender]) return;
        const choice = parseInt(msg.text.trim());
        if (choice < 1 || choice > result.allLinks.length) {
            return client.sendMessage(msg.chat, { text: `⚠️ Choose a number between 1 and ${result.allLinks.length}.` }, { quoted: msg });
        }

        const selectedUrl = result.allLinks[choice - 1].url;
        try {
            const response = await ytmp4(selectedUrl);
            if (!response || !response.video) throw new Error('No video URL found.');

            const videoUrl = response.video;
            const mediaResponse = await fetchWithRetry(videoUrl);
            const mediaBuffer = Buffer.from(await mediaResponse.arrayBuffer());
            if (mediaBuffer.length === 0) throw new Error('Downloaded file is empty');

            const videoPath = path.join(customTmpDir, 'video.mp4');
            fs.writeFileSync(videoPath, mediaBuffer);

            const audioPath = path.join(customTmpDir, 'audio.mp3');
            await new Promise((resolve, reject) => {
                ffmpeg(videoPath)
                    .audioCodec('libmp3lame')
                    .audioBitrate(128)
                    .toFormat('mp3')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(audioPath);
            });

            if (!fs.existsSync(audioPath) || fs.statSync(audioPath).size === 0) throw new Error('Audio file is empty');

            const caption = `🎵 *Title:* ${response.title || 'Unknown'}\n👤 *Artist:* ${response.author || 'Unknown'}\n⏳ *Duration:* ${response.duration || 'Unknown'}\n👀 *Views:* ${response.views || '0'}\n📅 *Uploaded on:* ${response.upload || 'Unknown Date'}`;

            await client.sendMessage(msg.chat, { audio: fs.readFileSync(audioPath), mimetype: mime.lookup(audioPath) || 'audio/mpeg', caption }, { quoted: msg });

            fs.unlinkSync(videoPath);
            fs.unlinkSync(audioPath);
        } catch (error) {
            console.error('Error fetching video:', error.message);
            await client.sendMessage(msg.chat, { text: '❌ An error occurred while fetching the video. Try again later.' }, { quoted: msg });
        }

        delete client.ultra[msg.sender];
    });
};

async function searchAndDownloadMusic(query) {
    try {
        const { videos } = await yts(query);
        if (!videos.length) return { allLinks: [] };

        return {
            title: videos[0].title,
            description: videos[0].description,
            duration: videos[0].duration,
            author: videos[0].author.name,
            allLinks: videos.map(video => ({ title: video.title, url: video.url })),
            videoUrl: videos[0].url,
            thumbnail: videos[0].thumbnail,
        };
    } catch (error) {
        console.error('Error:', error.message);
        return { allLinks: [] };
    }
}

async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url);
        if (response.ok) return response;
    }
    throw new Error('Failed to fetch media content after retries');
  }
