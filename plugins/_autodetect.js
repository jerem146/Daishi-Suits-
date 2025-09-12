import chalk from 'chalk'
import fetch from 'node-fetch'
import ws from 'ws'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import { promises as fs } from 'fs'
import path from 'path'

let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata }) {
if (!m.messageStubType || !m.isGroup) return

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

if (chat.detect && m.messageStubType == 21) {
  await this.sendMessage(m.chat, { text: nombre, mentions: [m.sender] })  
} else if (chat.detect && m.messageStubType == 22) {
  await this.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] })
} else if (chat.detect && m.messageStubType == 23) {
  await this.sendMessage(m.chat, { text: newlink, mentions: [m.sender] })
} else if (chat.detect && m.messageStubType == 25) {
  await this.sendMessage(m.chat, { text: edit, mentions: [m.sender] })  
} else if (chat.detect && m.messageStubType == 26) {
  await this.sendMessage(m.chat, { text: status, mentions: [m.sender] })  
} else if (chat.detect && m.messageStubType == 29) {
  await this.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] })
} else if (chat.detect && m.messageStubType == 30) {
  await this.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] })
} else {
  if (m.messageStubType == 2) return
  console.log({
    messageStubType: m.messageStubType,
    messageStubParameters: m.messageStubParameters,
    type: WAMessageStubType[m.messageStubType], 
  })
}}
export default handler