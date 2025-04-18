const fs = require("fs");
const { session } = require("./settings");
const { useMultiFileAuthState } = require("baileys");

async function authenticateSession() {
    try {
        const sessionFolder = "./session";
        const sessionPath = `${sessionFolder}/creds.json`;

        if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder, { recursive: true });

        let sessionData = null;

        // Load session if exists, with error handling
        if (fs.existsSync(sessionPath)) {
            try {
                console.log("🔄 Restoring session...");
                sessionData = JSON.parse(fs.readFileSync(sessionPath, "utf8"));
            } catch (error) {
                console.error("⚠️ Corrupted session file! Resetting...");
                fs.unlinkSync(sessionPath); // Delete corrupted session file
            }
        } 
        
        // If no valid session, create a new one
        if (!sessionData && session !== "zokk") {
            console.log("📡 Connecting...");
            sessionData = Buffer.from(session, "base64").toString("utf8");
            fs.writeFileSync(sessionPath, sessionData, "utf8");
        }

        // Use Baileys session manager with error handling
        const { state, saveCreds } = await useMultiFileAuthState(sessionFolder).catch((err) => {
            console.error("❌ Baileys Auth Error:", err);
            return { state: null, saveCreds: null };
        });

        if (!state) throw new Error("Failed to initialize Baileys session.");

        return { state, saveCreds };
    } catch (e) {
        console.error("❌ Session error:", e);
        return null;
    }
}

// Prevent duplicate event listeners
process.removeAllListeners("uncaughtException");
process.on("uncaughtException", (err) => console.error("❌ Uncaught Exception:", err));

module.exports = authenticateSession;
