
const Discord = require('discord.js')

exports.run = async (client, message, args) => {
  if (global.config.owners.includes(message.author.id) === false) return message.channel.send(`**Bu komutu sadece \`AWOKEN & FAYIKCIM\` kullanabilir!**`);
  let msg = message;
  
    let code = args.join(" ");
    if (!code) return message.channel.send("Kod belirt!");
    
    const clean = (text) => {
        if (typeof text !== "string") text = require("util").inspect(text, { depth: 0 });
        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(new RegExp(client.token, "g"), "awokenfayikcimwashere");

        return text;
    }
    try {
        var evaled = await (eval(code));
        return message.channel.send(clean(evaled), {
            code: "js",
            split: true
        }).catch(e => {
            return message.channel.send(e, {
                split: true,
                code: "xl"
            });
        });
    } catch(e) {
        return message.channel.send(e, {
            split: true,
            code: "xl"
        }).catch(err => {
            return message.channel.send(err, {
                split: true,
                code: "xl"
            });
        });
    }

}


exports.conf = {
   enabled: true,
    guildOnly: true,
    aliases: ['eval','evsat','kod'],
    permLevel: 0
}

exports.help = {
    name: 'eval',
    description: 'Yazılan kodu çalıştırır.',
    usage: 'eval <kod>'
}
