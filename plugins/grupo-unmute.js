// plugins/unmute.js
let handler = async (m, { conn, participants, usedPrefix, command, isROwner, isOwner }) => {
  try {
    if (!m.isGroup) return m.reply('『✦』Este comando solo se puede usar en grupos.')

    let part = (participants && participants.length) ? participants : (await conn.groupMetadata(m.chat).catch(()=>({ participants: [] }))).participants || []
    const senderNum = (m.sender || '').split('@')[0]

    const isAdmin = part.some(p => {
      const pid = ((p.id || p.jid || p.participant || '') + '').split('@')[0]
      const adminFlag = p.admin ?? p.isAdmin ?? p.role ?? false
      return pid === senderNum && (adminFlag === 'admin' || adminFlag === 'superadmin' || adminFlag === true)
    })

    if (!(isROwner || isOwner || isAdmin)) return m.reply('『✦』Solo los administradores pueden usar este comando.')

    let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null)
    if (!who) return m.reply(`『✦』Etiqueta o responde al usuario a desmutear.\nEjemplo: *${usedPrefix}${command} @usuario*`)

    if (!global.db.data.users[who]) global.db.data.users[who] = {}
    let user = global.db.data.users[who]

    if (!user.muto) return m.reply('『✦』El usuario no está silenciado.')
    user.muto = false
    user.muteWarn = 0

    await conn.reply(m.chat, `『🔊』 @${who.split('@')[0]} ha sido *desmuteado* correctamente.`, m, { mentions: [who] })
  } catch (e) {
    console.error(e)
    throw e
  }
}

handler.help = ['unmute @user']
handler.tags = ['group']
handler.command = ['unmute','desilenciar']
handler.group = true
handler.admin = false

export default handler