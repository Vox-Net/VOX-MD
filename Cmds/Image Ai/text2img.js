const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text, botname } = context;

    if (!text) {
        return m.reply("❌ *Error:* Please provide a text prompt to generate an image.");
    }

    try {
        const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(text)}`;

        const response = await axios.get(apiUrl, {
            headers: {
                "Accept": "image/png",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
            },
            responseType: "arraybuffer" // Ensure the response is handled as an image
        });

        if (response.status === 200) {
            await client.sendMessage(m.chat, {
                image: Buffer.from(response.data),
                caption: `🎨 *Image Generated by ${botname}*`
            });
        } else {
            throw new Error(`Unexpected response code: ${response.status}`);
        }

    } catch (error) {
        console.error("API Request Error:", error);
        m.reply(`❌ *API Error:* Unable to generate image.\n\n🔍 *Debug Info:*\n${error.message}`);
    }
};
