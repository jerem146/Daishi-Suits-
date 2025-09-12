let handler = async (m, { conn, text, usedPrefix, command }) => {
    let user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    if (!user) return m.reply(`❮✦❯ Para mutear a un usuario, menciónalo o responde a uno de sus mensajes.\n\n> → Ejemplo:\n*${usedPrefix + command} @usuario*`);

    if (user === conn.user.jid) return m.reply('❮✦❯ No me puedo mutear a mí mismo.');

    let dbUser = global.db.data.users[user];
    if (!dbUser) global.db.data.users[user] = {};

    // Establecemos el estado de mute y reseteamos el contador de advertencias
    global.db.data.users[user].muto = true;
    global.db.data.users[user].muteWarn = 0;

    let mentionedUser = `@${user.split('@')[0]}`;
    await conn.reply(m.chat, `*${mentionedUser} ha sido muteado.*\n\n❮✦❯ A partir de ahora, sus mensajes serán eliminados. Si insiste, será expulsado.`, m, { mentions: [user] });
}

handler.help = ['mute @usuario'];
handler.tags = ['group'];
handler.command = /^(mute|mutear)$/i;

handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;