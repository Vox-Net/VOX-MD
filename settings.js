/* Bot settings 

You don't have to set this if you deploy using heroku because you can simply set them in environment variables, also don't forget to sleep */


const session = process.env.SESSION || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZ0dxbVRpUUZyTTBrbjB6MWwxUlIySzBFWnNPS2NOR1lYZ3hXYWlHZFRIcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibnoraC9TamZpTUtKdnJrNGMzekdBd3RZTzA1WkJLQy83ZkVzRThTUEhqaz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ1UDJtRnhUQ0RlTDNuVTRkTWpyTXJSbzZ5a0lSZlZZMERSclRONG1wcG5FPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJOL0lKRERSdmxVWmxEYktTMXc1cTRNK2hnYm04Z2NXQUZ6UTNSQm9FUEVJPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IllFbjBHNS81V295RE45K3lMUTArZ0FkaUI1cXNYbDlzTldTcmJqclpHa289In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkRrRjRPUWxRK1FpTzBBVlRRbVFsaWh4Y0hSK3p5MFRKU3MvMUpOMVRuM009In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUUVSWE1kZ3hhRmFpcG1KQ2t2blFQZXlWcHgwTEdwM09Ycnd4NHJib1QwMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS1B6MDd4R3hkVnVjMlFCOGg4Z283T2NYNmZ4dWRkbnZ2bGl4cFlqOHNFQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9RZmJYWGRLa2FZQmdVclA5a1lKMlg1dGRWTFJmSGROdFg5SXZzSnZBZjI4c3BraElpRzc2RUR5dExNTXhxbE1pQzhzcGlYMEd4eDhBL0QzbXVMK2l3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjI2LCJhZHZTZWNyZXRLZXkiOiJrczhjdnBhaExUZmNPR1JRRldaSTlMUFlzLzkyeVhvdUVDcGllb3hEazg4PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI1NDczMTIxODE2NUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI0QzFDOTkyQTE4RjI5MUE5QUFCMzcwMzU0MTUwNDVEOSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzQ0NjI1NDQyfSx7ImtleSI6eyJyZW1vdGVKaWQiOiIyNTQ3MzEyMTgxNjVAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiODAxQ0RCNUI1NkFBM0E2MkQyMTFFNjI1MDMxN0ZGRkUifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc0NDYyNTQ0M31dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sImRldmljZUlkIjoiMkZ2T1lCRDRTV3VuNW1zT0xYanZGdyIsInBob25lSWQiOiI2YzYxYzg5Yy1lYzQzLTQ4ZDktYjFmZi02NDRlNGJjMmMzZTgiLCJpZGVudGl0eUlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUVVpUG5GOTNFdjMrR1l2Tmtuazd1Ky9ZL0NVPSJ9LCJyZWdpc3RlcmVkIjp0cnVlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InZuM3NRbHFmVWVvSkc4eStUNjJIR2pUbnJIOD0ifSwicmVnaXN0cmF0aW9uIjp7fSwicGFpcmluZ0NvZGUiOiIzTjZWNTFSRCIsIm1lIjp7ImlkIjoiMjU0NzMxMjE4MTY1OjUyQHMud2hhdHNhcHAubmV0IiwibmFtZSI6ImJvdCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT0dRdTRZQkVKRys4NzhHR0FVZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiWjBwdGtNVUphZGZDdk96SmVQN2ZGRmlJVUF2RUl4SDJXcWVqTFBlR09FYz0iLCJhY2NvdW50U2lnbmF0dXJlIjoieHN3ajdpZnVIcTFDM0NOLzk3Q0RnVHhCVGl5ZFFBRmIrc3U3SkdYOW9oTnNwNkREaGlNbmw3TW9YNUU3SGdzUFQ3d2ZRbDFtZ1k1UFdxcVpadmVjQmc9PSIsImRldmljZVNpZ25hdHVyZSI6IjBqNFhGS0lqYUZPaWdJaDcxeWxoM09TeTE5ZXpoSkhLUXdXUWQ4MnZ4V25oRUJGRFRjV0sxQ1d2bXNXejdHeTZEK0t2V3BHYStza0M5MUZDVlpha2hnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzMxMjE4MTY1OjUyQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQldkS2JaREZDV25Yd3J6c3lYaiszeFJZaUZBTHhDTVI5bHFub3l6M2hqaEgifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NDQ2MjU0MzgsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBUGV2In0=';

const prefix = process.env.PREFIX || '.';
const mycode = process.env.CODE || "254";
const author = process.env.STICKER_AUTHOR || 'Kanambo';
const packname = process.env.PACKNAME || 'Kanlia md2 🤖';
const dev = process.env.DEV || '254114148625';
const DevDreaded = dev.split(",");
const botname = process.env.BOTNAME || 'VOX-MD';
const mode = process.env.MODE || 'public';
const gcpresence = process.env.GC_PRESENCE || 'false';
const antionce = process.env.ANTIVIEWONCE || 'true';
const sessionName = "session";
const cookies = JSON.parse(process.env.COOKIE || '[{"domain":".youtube.com","expirationDate":1764463277.409877,"hostOnly":false,"httpOnly":false,"name":"__Secure-1PAPISID","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"UoBcKfo0_FSAxQ5D/A5ZClpB2xVLQJQGUx","id":1},{"domain":".youtube.com","expirationDate":1764463277.412158,"hostOnly":false,"httpOnly":true,"name":"__Secure-1PSID","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"g.a000pghxevPjwTr5Un_D-PS1UxiaEdymANhc_5NWNQgaApthzLU0MOFGGamQ5yqi2vrAqKldbgACgYKASoSARUSFQHGX2MiB0PtUQYJy2_oQLkmMPXgfRoVAUF8yKpuqWya_M2xRHe_6e9o_6TK0076","id":2},{"domain":".youtube.com","expirationDate":1762941611.655441,"hostOnly":false,"httpOnly":true,"name":"__Secure-1PSIDCC","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"AKEyXzWtrmvqerXnEweUSkGiFKAn57TBnvoAEBDi6B33Sg4gpMOANgVFwDBU_JtKQXLpisy_","id":3}]');
const presence = process.env.WA_PRESENCE || 'online';

const antitag = process.env.ANTITAG || 'true';
const antidelete = process.env.ANTIDELETE || 'true';
const autoview = process.env.AUTOVIEW_STATUS || 'true';
const autolike = process.env.AUTOLIKE_STATUS || 'true';
const autoread = process.env.AUTOREAD || 'false';
const autobio = process.env.AUTOBIO || 'false';

module.exports = {
  sessionName,
  presence,
  autoview,
  autoread,
  botname,
  cookies,
  autobio,
  mode,
autolike,
  prefix,
  mycode,
  author,
  packname,
  dev,
  DevDreaded,
  gcpresence,
  antionce,
session,
antitag,
antidelete
};
