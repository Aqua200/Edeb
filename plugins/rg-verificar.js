import {createHash} from 'crypto';
import PhoneNumber from 'awesome-phonenumber'
const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;
const handler = async function(m, {conn, text, usedPrefix, command}) {
  const user = global.db.data.users[m.sender];
  const name2 = conn.getName(m.sender);
    let delirius = await axios.get(`https://deliriussapi-oficial.vercel.app/tools/country?text=${PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international')}`)
  let paisdata = delirius.data.result
  let mundo = paisdata ? `${paisdata.name} ${paisdata.emoji}` : 'Desconocido'
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => global.imagen1);
  if (user.registered === true) throw `🌴 Hola amigo, ya estás registrado en nuestra base de datos.`;
  if (!Reg.test(text)) throw `regístrese bien hijo de su, ejemplo: !reg miguelon.23`;
  let [_, name, splitter, age] = text.match(Reg);
  if (!name) throw '❌ No puedes dejar tu nombre vacío por favor completa el registro No puedes dejar tu nombre vacío Por favor completa el registro';
  if (!age) throw '❌ Por favor no dejes tu edad vacía, haz el registro completo';
  if (name.length >= 30) throw '️☘ ¿puedes acortar tu nombre por favor?';
  age = parseInt(age);
  if (age > 100) throw '☘️ por favor use una edad menor, no tan alta';
  if (age < 5) throw '[❌] Lo siento, pero no se permiten 5 años. Lo siento, pero no se permiten 5 años.';
  user.name = name.trim();
  user.age = age;
  user.regTime = + new Date;
  user.registered = true;
  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20);
  const caption = `📃Registro completado información de registro 

Nombre ${name}

Edad de ${age}

🌟Ya estás registrado en nuestra comunidad, muchas gracias por registrarte ahora disfruta del bot 🤖

código de registro
${sn}
`;
  await conn.sendFile(m.chat, pp, 'hades.jpg', caption);

let chtxt = `
👤 *𝚄𝚜𝚎𝚛* » ${m.pushName || 'Anónimo'}
🌎 *𝙿𝚊𝚒𝚜* » ${mundo}
🗂 *𝚅𝚎𝚛𝚒𝚏𝚒𝚌𝚊𝚌𝚒𝚘́𝚗* » ${user.name}
⭐️ *𝙴𝚍𝚊𝚍* » ${user.age} Años
📆 *𝙵𝚎𝚌𝚑𝚊* » ${moment.tz('America/Bogota').format('DD/MM/YY')}
☁️ *𝙽𝚞𝚖𝚎𝚛𝚘 𝚍𝚎 𝚛𝚎𝚐𝚒𝚜𝚝𝚛𝚘* »
⤷ ${sn}
`.trim()

await conn.sendMessage(global.idchannel, { text: chtxt, contextInfo: {
externalAdReply: {
title: "【 🔔 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐂𝐈𝐎́𝐍 🔔 】",
body: '🥳 ¡𝚄𝚗 𝚞𝚜𝚞𝚊𝚛𝚒𝚘 𝚗𝚞𝚎𝚟𝚘 𝚎𝚗 𝚖𝚒 𝚋𝚊𝚜𝚎 𝚍𝚎 𝚍𝚊𝚝𝚘𝚜!',
thumbnailUrl: pp,
sourceUrl: redes,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null })
  
  global.db.data.users[m.sender].money += 10000;
  global.db.data.users[m.sender].exp += 10000;
};
handler.help = ['verificar'];
handler.tags = ['xp'];
handler.command = /^(Reg|reg)$/i;
export default handler;