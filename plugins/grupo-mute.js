// plugins/mute.js
let handler = async (m, { conn, participants, usedPrefix, command, isROwner, isOwner }) => {
  if (!m.isGroup) return m.reply('『✦』Este comando solo se puede usar en grupos.')

  let part = (participants && participants.length) ? participants : (await conn.groupMetadata(m.chat).catch(()=>({ participants: [] }))).participants || []
  const senderNum = (m.sender || '').split('@')[0]

  const isAdmin = part.some(p => {
    const pid = ((p.id || p.jid || p.participant || '') + '').split('@')[0]
    const adminFlag = p.admin ?? p.isAdmin ?? p.role ?? false
    return pid === senderNum && (adminFlag === 'admin' || adminFlag === 'superadmin' || adminFlag === true)
  })
  if (!(isROwner || isOwner || isAdmin)) return m.reply('『✦』Solo los administradores pueden usar este comando.')

  // 🔹 Normalizar JID objetivo
  let who = null
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    who = m.mentionedJid[0]
  } else if (m.quoted) {
    who = m.quoted.sender
  }
  if (!who) return m.reply(`『✦』Etiqueta o responde al usuario a silenciar.\nEjemplo: *${usedPrefix}${command} @usuario*`)

  // siempre normalizar jid
  who = who.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

  if (!global.db.data.users[who]) global.db.data.users[who] = {}
  let user = global.db.data.users[who]

  if (user.muto) return m.reply('『✦』El usuario ya está silenciado.')
  user.muto = true
  user.muteWarn = 0

  await conn.reply(m.chat, `『🔇』 @${who.split('@')[0]} ha sido *silenciado*.`, m, { mentions: [who] })
}

handler.help = ['mute @user']
handler.tags = ['group']
handler.command = ['mute','silenciar']
handler.group = true
handler.admin = false

export default handler