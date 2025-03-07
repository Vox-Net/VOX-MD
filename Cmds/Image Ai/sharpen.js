const axios = require("axios");
const fs = require("fs");

module.exports = async (client, m) => {
    if (!m.quoted || !m.quoted.message.imageMessage) {
        return m.reply("📌 *Reply to an image* with `.sharpen` to enhance it!");
    }

    try {
        m.reply("🔄 Processing your image... Please wait!");

        // Download the image
        let imagePath = "./temp/sharpen.jpg";
        let buffer = await client.downloadMediaMessage(m.quoted);
        fs.writeFileSync(imagePath, buffer);

        // Upload image to a temporary host (use a real image upload API here)
        let form = new FormData();
        form.append("file", fs.createReadStream(imagePath));

        let upload = await axios.post("https://tmpfiles.org/api/upload", form, {
            headers: { ...form.getHeaders() },
        });

        if (!upload.data || !upload.data.url) {
            return m.reply("❌ Failed to upload image for processing!");
        }

        let imageUrl = upload.data.url;

        // Send to sharpening API
        let sharpened = await axios.get(
            `https://fastrestapis.fasturl.cloud/aiimage/imgsharpen?url=${encodeURIComponent(imageUrl)}`,
            { responseType: "arraybuffer" }
        );

        let outputPath = "./temp/sharpened.jpg";
        fs.writeFileSync(outputPath, sharpened.data);

        // Send the sharpened image
        await client.sendMessage(m.chat, { image: { url: outputPath }, caption: "✅ *Image Sharpened Successfully!*" });

        // Clean up
        fs.unlinkSync(imagePath);
        fs.unlinkSync(outputPath);
    } catch (error) {
        console.error(error);
        m.reply("❌ Failed to sharpen image! Please try again.");
    }
};
