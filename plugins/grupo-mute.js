// plugins/mute.js
function jidNormalized(jid) {
  if (!jid) return null;
  if (typeof jid === 'object') jid = jid.id || jid.jid || jid.participant || jid;
  jid = String(jid);
  jid = jid.split(':')[0]; // quitar sufijos tipo :1234
  return jid;
}
function digitsOf(jid) {
  const s = jidNormalized(jid) || '';
  return s.replace(/\D/g, '');
}
function jidVariants(jid) {
  const d = digitsOf(jid);
  const base = jidNormalized(jid);
  if (!d) return [base];
  // variantes comunes
  return Array.from(new Set([ base, `${d}@s.whatsapp.net`, `${d}@c.us`, `${d}@lid` ].filter(Boolean)));
}

let handler = async (m, { conn, participants, usedPrefix, command, isROwner, isOwner }) => {
  try {
    if (!m.isGroup) return m.reply('『✦』Este comando solo se puede usar en grupos.')

    // --- admin detection (tolerante) ---
    let part = (participants && participants.length) ? participants : (await conn.groupMetadata(m.chat).catch(()=>({ participants: [] }))).participants || []
    const senderNum = (m.sender || '').split('@')[0]
    const isAdmin = part.some(p => {
      const pid = ((p.id || p.jid || p.participant || '') + '').split('@')[0]
      const adminFlag = p.admin ?? p.isAdmin ?? p.role ?? false
      return pid === senderNum && (adminFlag === 'admin' || adminFlag === 'superadmin' || adminFlag === true)
    })
    if (!(isROwner || isOwner || isAdmin)) return m.reply('『✦』Solo los administradores pueden usar este comando.')

    // --- detectar objetivo (responder o mencionar) ---
    let whoOriginal = (m.mentionedJid && m.mentionedJid.length > 0) ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null)
    if (!whoOriginal) return m.reply(`『✦』Etiqueta o responde al usuario a silenciar.\nEjemplo: *${usedPrefix}${command} @usuario*`)

    const variants = jidVariants(whoOriginal)

    // crear/actualizar todas las variantes para asegurar detección en middleware
    for (const k of variants) {
      if (!global.db.data.users[k]) global.db.data.users[k] = {}
      global.db.data.users[k].muto = true
      global.db.data.users[k].muteWarn = 0
    }

    await conn.reply(m.chat, `『🔇』 @${digitsOf(whoOriginal)} ha sido *silenciado* correctamente.`, m, { mentions: [whoOriginal] })
  } catch (e) {
    console.error(e)
    throw e
  }
}

handler.help = ['mute @user']
handler.tags = ['group']
handler.command = ['mute','silenciar']
handler.group = true
handler.admin = false

export default handler