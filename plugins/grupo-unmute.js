// plugins/unmute.js
let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    if (!m.isGroup) return m.reply('『✦』Este comando solo se puede usar en grupos.')
    if (!m.isAdmin) return m.reply('『✦』Solo los administradores pueden usar este comando.')

    let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null)
    if (!who) return m.reply(`『✦』Etiqueta o responde al usuario a desmutear.\nEjemplo: *${usedPrefix}unmute @usuario*`)

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
handler.command = ['unmute']
handler.group = true
handler.admin = true
handler.botAdmin = false

export default handler