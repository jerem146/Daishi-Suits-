// plugins/unmute.js

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    if (!user) return m.reply(`❮✦❯ Para desmutear a un usuario, menciónalo o responde a uno de sus mensajes.\n\n> → Ejemplo:\n*${usedPrefix + command} @usuario*`);

    let dbUser = global.db.data.users[user];
    if (!dbUser || !dbUser.muto) {
        return m.reply('❮✦❯ Este usuario no se encuentra muteado.');
    }

    // Cambiamos el estado de 'muto' y reseteamos el contador
    dbUser.muto = false;
    dbUser.muteWarn = 0;

    let mentionedUser = `@${user.split('@')[0]}`;
    await conn.reply(m.chat, `*${mentionedUser} ha sido desmuteado.*\n\n❮✦❯ Ahora puede volver a enviar mensajes en el grupo.`, m, { mentions: [user] });
}

handler.help = ['unmute @usuario'];
handler.tags = ['group'];
handler.command = /^(unmute|desmutear)$/i;

handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;