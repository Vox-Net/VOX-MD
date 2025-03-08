const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;

        if (!m || !m.key) {
            return m.reply("❌ Cannot delete an empty chat.");
        }

        await client.chatModify(
            { delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }] },
            m.chat
        );

        m.reply("✅ Successfully deleted this chat!");
    });
};
