// plugins/_antimute.js
function jidNormalized(jid) {
  if (!jid) return null;
  if (typeof jid === 'object') jid = jid.id || jid.jid || jid.participant || jid;
  jid = String(jid);
  jid = jid.split(':')[0];
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
  return Array.from(new Set([ base, `${d}@s.whatsapp.net`, `${d}@c.us`, `${d}@lid` ].filter(Boolean)));
}

let before = async (m, { conn }) => {
  try {
    if (!m) return
    if (!m.isGroup) return
    // obtener variantes del sender
    const variants = jidVariants(m.sender)
    // buscar si alguna variante tiene muto = true
    let userObj = null
    for (const k of variants) {
      if (global.db.data.users[k]) {
        userObj = global.db.data.users[k]
        if (userObj.muto) break
      }
    }
    if (userObj && userObj.muto) {
      // eliminar el mensaje (el bot debe ser admin para borrar mensajes)
      try {
        await conn.sendMessage(m.chat, { delete: m.key })
      } catch (e) {
        console.error('[antimute] error al borrar mensaje:', e)
      }
      // opcional: incrementar contador de advertencias si necesitas la lógica progresiva
      // userObj.muteWarn = (userObj.muteWarn || 0) + 1
    }
  } catch (e) {
    console.error(e)
  }
}

export default { before }