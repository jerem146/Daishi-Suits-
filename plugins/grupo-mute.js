// plugins/mute.js
let handler = async (m, { conn, participants, usedPrefix, command, isROwner, isOwner }) => {
  try {
    if (!m.isGroup) return m.reply('『✦』Este comando solo se puede usar en grupos.')

    // fallback: si no recibimos participants desde el loader, intentar pedir metadata
    let part = (participants && participants.length) ? participants : (await conn.groupMetadata(m.chat).catch(()=>({ participants: [] }))).participants || []

    // normalizar sender (sin dominio)
    const senderNum = (m.sender || '').split('@')[0]

    // detectar admin de forma tolerante
    const isAdmin = part.some(p => {
      const pid = ((p.id || p.jid || p.participant || '') + '').split('@')[0]
      const adminFlag = p.admin ?? p.isAdmin ?? p.role ?? false
      return pid === senderNum && (adminFlag === 'admin' || adminFlag === 'superadmin' || adminFlag === true)
    })

    // permitir a creadores/owners pasar
    if (!(isROwner || isOwner || isAdmin)) return m.reply('『✦』Solo los administradores pueden usar este comando.')

    // obtener objetivo
    let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null)
    if (!who) return m.reply(`『✦』Etiqueta o responde al usuario a silenciar.\nEjemplo: *${usedPrefix}${command} @usuario*`)

    if (!global.db.data.users[who]) global.db.data.users[who] = {}
    let user = global.db.data.users[who]

    if (user.muto) return m.reply('『✦』El usuario ya está silenciado.')
    user.muto = true
    user.muteWarn = 0

    await conn.reply(m.chat, `『🔇』 @${who.split('@')[0]} ha sido *silenciado* correctamente.`, m, { mentions: [who] })
  } catch (e) {
    console.error(e)
    throw e
  }
}

handler.help = ['mute @user']
handler.tags = ['group']
handler.command = ['mute','silenciar'] // alias
handler.group = true
handler.admin = false // lo controlamos manualmente arriba

export default handler