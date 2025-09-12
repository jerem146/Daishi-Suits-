// plugins/mute.js
let handler = async (m, { conn, participants, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('『✦』Este comando solo se puede usar en grupos.')

  // Detectar si el que manda el mensaje es admin
  const groupAdmins = participants.filter(p => p.admin).map(p => p.id)
  const isAdmin = groupAdmins.includes(m.sender)

  if (!isAdmin) return m.reply('『✦』Solo los administradores pueden usar este comando.')

  let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null)
  if (!who) return m.reply(`『✦』Etiqueta o responde al usuario a silenciar.\nEjemplo: *${usedPrefix}mute @usuario*`)

  if (!global.db.data.users[who]) global.db.data.users[who] = {}
  let user = global.db.data.users[who]

  if (user.muto) return m.reply('『✦』El usuario ya está silenciado.')
  user.muto = true
  user.muteWarn = 0

  await conn.reply(m.chat, `『🔇』 @${who.split('@')[0]} ha sido *silenciado*.`, m, { mentions: [who] })
}

handler.help = ['mute @user']
handler.tags = ['group']
handler.command = ['mute']
handler.group = true
handler.admin = false   // <- quitamos el chequeo automático, ya lo hacemos arriba

export default handler