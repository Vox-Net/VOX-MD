module.exports = async (client, m, Owner, budy, fetchJson, store) => {
const { proto } = require("baileys");

if (budy && budy.startsWith('>')) {
  if (!Owner) return;
  try { 
 let evaled = await eval(budy.slice(2)); 
 if (typeof evaled !== 'string') evaled = require('util').inspect(evaled); 
 await m.reply(evaled); 
   } catch (err) { 
 await m.reply(String(err)); 
   } 
 } 
}

