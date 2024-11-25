import { generate, generateV1, generateV2, generateV3 } from "../lib/captcha.js"
import { createHash, randomBytes } from "crypto"
import { getDevice } from '@whiskeysockets/baileys'
import fetch from "node-fetch"
import _ from "lodash"
const Reg = /\|?(.*)([^\w\s])([0-9]*)$/i
let msg, user, pp, who, name, age, sn, otp

let handler = async function (m, { conn, text, usedPrefix, command }) {
const dispositivo = await getDevice(m.key.id)
user = global.db.data.users[m.sender]
who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
// if (user.banned) return await conn.reply(m.chat, `🚫 Esta baneado. No tiene permitido usar este bot.*`, m)
if (user.registered) return await conn.sendMessage(m.chat, { text: `${dis}Ya esta registrado como *${user.name}*\n\nSi desea hacer un nuevo registro ✨ debe de usar el comando:\n*${usedPrefix}delregistro* \`Número de serie\`\n\n🙂 Si no conoce su número de serie, use el comando:\n*${usedPrefix}numserie*`, ...fake }, { quoted: m })
let nombre = await conn.getName(m.sender) || await generarNombreRandom()
const edadRandom = _.random(10, 60)
const formatoIncorrecto = `⚠️ *¡Verifica el formato de uso!*\n\n📌 Usa el comando de esta manera:\n*${usedPrefix + command} nombre.edad*\n\n📝 Ejemplo:\n*${usedPrefix + command}* ${nombre}.${edadRandom}`
if (!Reg.test(text)) { 
const edadesMayores = await generarEdades(18, 60)
const edadesMenores = await generarEdades(10, 17)
/*const sections = [
{
title: `🔢 Datos Aleatorios`,
highlight_label: "Popular",
rows: [{
title: "🎲 Edad Aleatoria",
description: `Elige ${edadRandom} para tu edad.`,
id: `${usedPrefix + command} ${nombre}.${edadRandom}`
}]
},
{
title: `❇️ Registro Dinámico`,
highlight_label: "Recomendado",
rows: [{
title: "💫 Nombre y edad aleatorios",
description: `Registrarme como ${await generarNombreRandom()} con edad de ${edadRandom} años.`,
id: `${usedPrefix + command} ${await generarNombreRandom()}.${edadRandom}`
}]
},
{
title: `🧓 Mayor de edad`,
rows: edadesMayores.map(age => ({
title: `${age} Años`,
description: `👉 Elige ${age} para tu edad.`,
id: `${usedPrefix + command} ${nombre}.${age}`
}))
},
{
title: `👶 Menor de edad`,
rows: edadesMenores.map(age => ({
title: `${age} Años`,
description: `🍭 Elige ${age} para tu edad.`,
id: `${usedPrefix + command} ${nombre}.${age}`
}))
}  
]*/
if (/ios|web|desktop|unknown/gi.test(dispositivo)) {
return await conn.reply(m.chat, formatoIncorrecto + '\n\n' + wm, m)
} else {
//return await conn.sendButton(m.chat, formatoIncorrecto + '\n\n> _También puedes usar el botón de abajo..._\n', wm.trim(), null, null, null, null, [['Completar registro', sections]], m)
}
}  
[, name, , age] = text.match(Reg)
if (!name) return conn.reply(m.chat, `🫠 *No hemos econtrado su nombre, intente de nuevo.*`, m)
if (name.length >= 41) return conn.reply(m.chat, `😩 *Use un nombre más corto por favor.*`, m)
if (!age) return conn.reply(m.chat, `🤔 *No hemos econtrado su edad, intente de nuevo.*`, m)
age = parseInt(age)
if (age >= 61) return conn.reply(m.chat, `🤷‍♀️ *Use una edad más joven por favor.*`, m)
if (age <= 9) return conn.reply(m.chat, `😆 *Use una edad mayor por favor.*`, m)
sn = createHash('md5').update(m.sender).digest('hex')
try {
const { image } = await createOtp("Éxito", sn.replace(/\D/g, ""))
let confirm = "📌 Responde este mensaje con el código OTP que aparece en la imagen."
let txt = `🕵️‍♀️ *Proceso de Verificación* 🕵️‍♀️\n\n@${m.sender.split("@")[0]}\n${confirm}\n\n> _(El código OTP es personal y de un solo uso.)_`
otp = sn.replace(/\D/g, "").slice(0, 6)
msg = await conn.sendMessage(m.sender, { image: image, caption: txt, mentions: [m.sender] }, { quoted: m })
// Si el tiempo se agota, se limpian los datos de registro
setTimeout(() => {
if (user.registered) return
user.name = ""
user.age = 0
user.registered = false
user.OTP = "" 
user.registered ? '' : conn.sendMessage(m.sender, { delete: msg.key })
}, 30000)
m.isGroup ? await conn.reply(m.chat, "📨 El formulario de verificación se ha enviado a tu chat privado. ¡Revísalo!", m) : ''
} catch (e) {
msg = ''
console.error(e)
await conn.reply(m.chat, "*⚠️ Ocurrió un error al enviar el formulario de verificación. Intenta de nuevo más tarde.*", m)
}
handler.before = async function (m, { conn }) {
let isVerified = m.quoted && m.quoted.id == msg.key.id && m.text == otp
if (isVerified) {
pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://qu.ax/QGAVS.jpg')
user.name = name
user.age = age
user.registered = true
user.OTP = otp
await conn.sendMessage(m.sender, { delete: msg.key })
//m.react('✨') 
await conn.sendMessage(m.chat, { image: { url: pp }, caption: `*║⫘⫘⫘⫘⫘⫘✨*
*║ ＲＥＧＩＳＴＲＯ*
*║ .・゜゜・・゜゜・．*
*║* 💠 *Nombre* ${name}
*║* 💠 *Edad* ${age} años
*║* 💠 *Número de serie* \`${sn.slice(0, 20)}\`
*║* 💠 *OTP* \`${user.OTP}\` (correcto)
*║⫘⫘⫘⫘⫘⫘✨*\n
> ✅ _Tus datos están seguros en nuestra base de datos y ahora puedes usar todas las funciones disponibles para usuarios verificados._`, mentions: [m.sender], ...fake }, { quoted: m })
}}}
handler.command = ['reg']
export default handler

async function createOtp(buffer, code) {
code = code.slice(0, 6)
try {
const captcha = await generateV2(code) || await generateV3(code) || await generateV1(code) || await generate(code)
const captchaBuffer = captcha.buffer
const securityBuffer = (await generateV2(buffer) || await generateV3(buffer) || await generateV1(buffer) || await generate(buffer))?.buffer
return { image: captchaBuffer, otp: captcha.code, verified: securityBuffer }
} catch (e) {
console.error(e)
}}

async function generarNombreRandom() {
const numeros = '0123456789'
const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const combinacion = [ numeros[_.random(0, numeros.length - 1)], numeros[_.random(0, numeros.length - 1)], letras[_.random(0, letras.length - 1)], letras[_.random(0, letras.length - 1)], letras[_.random(0, letras.length - 1)]]
return `Usuario#${_.shuffle(combinacion).join('')}`
}

function generarEdades(min, max) {
return _.range(max, min - 1, -1)  // Rango será de max a min (de mayor a menor)
}

/*import {createHash} from 'crypto';
import PhoneNumber from 'awesome-phonenumber'
const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;
const handler = async function(m, {conn, text, usedPrefix, command}) {
  const user = global.db.data.users[m.sender];
  const name2 = conn.getName(m.sender);
    let delirius = await axios.get(`https://deliriussapi-oficial.vercel.app/tools/country?text=${PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international')}`)
  let paisdata = delirius.data.result
  let mundo = paisdata ? `${paisdata.name} ${paisdata.emoji}` : 'Desconocido'
  let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://qu.ax/QGAVS.jpg')
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
  global.db.data.users[m.sender].money += 23;
  global.db.data.users[m.sender].exp += 45;
  global.db.data.users[m.sender].moras += 60;
  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20);
  const caption = `📃Registro completado información de registro 

Nombre ${name}

Edad de ${age}

🌟 Ya estás registrado en nuestra comunidad, muchas gracias por registrarte ahora disfruta del bot 🤖

Código de registro
${sn}

Verifica tu registro aquí:
https://whatsapp.com/channel/0029Vawz6Y91SWsyLezeAb0f
`;
  await conn.sendFile(m.chat, pp, 'hades.jpg', caption);

let chtxt = `
👤 *𝚄𝚜𝚎𝚛* » ${m.pushName || 'Anónimo'}
🌎 *𝙿𝚊𝚒𝚜* » ${mundo}
🗂 *𝚅𝚎𝚛𝚒𝚏𝚒𝚌𝚊𝚌𝚒𝚘́𝚗* » ${user.name}
⭐️ *𝙴𝚍𝚊𝚍* » ${user.age} años
📆 *𝙵𝚎𝚌𝚑𝚊* » ${moment.tz('America/Bogota').format('DD/MM/YY')}
☁️ *𝙽𝚞𝚖𝚎𝚛𝚘 𝚍𝚎 𝚛𝚎𝚐𝚒𝚜𝚝𝚛𝚘* »
⤷ ${sn}

🎁 𝐑𝐞𝐜𝐨𝐦𝐩𝐞𝐧𝐬𝐚𝐬
23 • 𝙼𝚘𝚗𝚎𝚢 💰
45 • 𝙴𝚡𝚙 💫
60 • 𝙼𝚘𝚛𝚊𝚜 🪙

> ¡Gracias por registrarte en nuestro bot: Hutao Proyect! Disfruta tu estadía y déjate sorprender por todo lo que tenemos para ofrecer. ✨🚀
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
  
};
handler.help = ['verificar'];
handler.tags = ['xp'];
handler.command = /^(Reg|reg)$/i;
export default handler;*/