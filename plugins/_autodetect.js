import chalk from 'chalk'
import fetch from 'node-fetch'
import ws from 'ws'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata }) {
if (!m.messageStubType || !m.isGroup) return
const fkontak = { 
  "key": { 
    "participants":"0@s.whatsapp.net", 
    "remoteJid": "status@broadcast", 
    "fromMe": false, 
    "id": "Halo" 
  }, 
  "message": { 
    "contactMessage": { 
      "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
    }
  }, 
  "participant": "0@s.whatsapp.net"
}  

let chat = global.db.data.chats[m.chat]
let usuario = `@${m.sender.split`@`[0]}`
let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'

// ─── Mensajes con formato ALERTA ─────────────────────────
let nombre = `> ✐ \`ALERTA\` » ${usuario} ha cambiado el *nombre del grupo* a: *${m.messageStubParameters[0]}* ✐`
let foto = `> ✐ \`ALERTA\` » ${usuario} ha cambiado la *foto del grupo* ✐`
let edit = `> ✐ \`ALERTA\` » ${usuario} ha configurado que ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} puedan *editar la información del grupo* ✐`
let newlink = `> ✐ \`ALERTA\` » ${usuario} ha *restablecido* el enlace del grupo ✐`
let status = `> ✐ \`ALERTA\` » ${usuario} ha *${m.messageStubParameters[0] == 'on' ? 'cerrado' : 'abierto'}* el grupo\n> ✦ Ahora ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} pueden enviar mensajes ✐`
let admingp = `> ✐ \`ALERTA\` » ${usuario} ha *ascendido* a @${m.messageStubParameters[0].split`@`[0]} ✐`
let noadmingp = `> ✐ \`ALERTA\` » ${usuario} ha *descendido* a @${m.messageStubParameters[0].split`@`[0]} ✐`
// ────────────────────────────────────────────────────────

if (chat.detect && m.messageStubType == 2) {
  const uniqid = (m.isGroup ? m.chat : m.sender)
  const sessionPath = './Sessions/'
  for (const file of await fs.readdir(sessionPath)) {
    if (file.includes(uniqid)) {
      await fs.unlink(path.join(sessionPath, file))
      console.log(`${chalk.yellow.bold('[ Archivo Eliminado ]')} ${chalk.greenBright(`'${file}'`)}\n` +
      `${chalk.blue('(Session PreKey)')} ${chalk.redBright('que provoca el "undefined" en el chat')}`)
    }
  }

} else if (chat.detect && m.messageStubType == 21) {
  await this.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })  
} else if (chat.detect && m.messageStubType == 22) {
  await this.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak })
} else if (chat.detect && m.messageStubType == 23) {
  await this.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })
} else if (chat.detect && m.messageStubType == 25) {
  await this.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })  
} else if (chat.detect && m.messageStubType == 26) {
  await this.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })  
} else if (chat.detect && m.messageStubType == 29) {
  await this.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })
} else if (chat.detect && m.messageStubType == 30) {
  await this.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })
} else {
  if (m.messageStubType == 2) return
  console.log({
    messageStubType: m.messageStubType,
    messageStubParameters: m.messageStubParameters,
    type: WAMessageStubType[m.messageStubType], 
  })
}}
export default handler