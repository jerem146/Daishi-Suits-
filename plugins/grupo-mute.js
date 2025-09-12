let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!m.isGroup) throw `『✦』Este comando solo se puede usar en grupos.`
  if (!m.isAdmin) throw `『✦』Solo los *administradores* pueden usar este comando.`

  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
  if (!who) throw `『✦』Etiqueta o responde al usuario que quieres silenciar.\n\nEjemplo: *${usedPrefix + command} @user*`

  let user = global.db.data.users[who]
  if (!user) throw `『✦』Usuario no encontrado en la base de datos.`

  if (user.muto) throw `『✦』El usuario ya está silenciado.`

  user.muto = true
  user.muteWarn = 0

  await conn.reply(m.chat, `『🔇』@${who.split`@`[0]} fue *silenciado* correctamente.`, m, { mentions: [who] })
}
handler.help = ['mute @user']
handler.tags = ['group']
handler.command = /^mute$/i
handler.group = true
handler.admin = true
handler.botAdmin = false

export default handler