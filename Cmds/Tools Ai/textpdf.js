const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply(
            "📄 *Enter the text you want to convert to PDF!*\n\n" +
            "✨ *You can also add a title, header, footer, and an optional watermark/logo.*\n\n" +
            "📝 *Example:*\n" +
            "`.textpdf This is an example text | My Title | My Header | Page 1 Footer | https://yourlogo.com/logo.png`\n\n" +
            "💡 *Title , Header, footer, and watermark are optional. If not provided, they will be skipped.*"
        );
    }

    try {
        // Notify user that the PDF is being generated
        await client.sendMessage(m.chat, {
            text: "📄 *Generating your PDF... Please wait!* ⏳"
        });

        // Split text input into parts
        let [pdfText, title, header, footer, watermark] = text.split("|").map(t => t?.trim());

        // Set defaults if values are not provided
      
        title = title || "Document";
        header = header || "";
        footer = footer || "";
        watermark = watermark ? `&watermark=${encodeURIComponent(watermark)}` : ""; // Only add watermark if provided

        // Construct API URL
        const apiUrl = `https://fastrestapis.fasturl.cloud/tool/texttopdf?text=${encodeURIComponent(pdfText)}&font=Times-Roman&fontSize=12&align=left&title=${encodeURIComponent(title)}&header=${encodeURIComponent(header)}&footer=${encodeURIComponent(footer)}${watermark}&wmSize=30`;

        // Fetch the PDF from the API
        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        // Generate filename based on title
        const fileName = `${title.replace(/\s+/g, "_")}.pdf`; // Replace spaces with underscores

        // Send the PDF as a document
        await client.sendMessage(
            m.chat,
            {
                document: Buffer.from(response.data),
                mimetype: "application/pdf",
                fileName: fileName,
                caption: `📄 *PDF Generated!*\n\n📌 *Title:* ${title}\n📝 *Header:* ${header || "None"}\n📜 *Footer:* ${footer || "None"}${watermark ? `\n🖼️ *Watermark:* Yes` : "\n🚫 *No Watermark*"}`
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("PDF generation error:", error.message);
        m.reply("❌ *Failed to generate the PDF!* Please try again later.");
    }
};
