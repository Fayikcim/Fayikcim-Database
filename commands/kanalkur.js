const Discord = require('discord.js')
const ChannelData = require('../models/Channel.js');

exports.run = async (client, message, args) => {

    if(global.config.owners.includes(message.author.id) === false) return;

    if (!args[0] || isNaN(args[0])) return message.channel.send(`Geçerli bir Kanal ID'si belirtmelisin.`);
  
      ChannelData.findOne({guildID: global.config.guild, channelID: args[0]}, async (err, channelData) => {
        if (!channelData) return message.channel.send("Belirtilen Kanal ID'si ile ilgili veri tabanında veri bulunamadı!");
        const kEmbed = new Discord.MessageEmbed()
        .setColor("#fd72a4")
        .setAuthor(message.member.displayName, message.author.avatarURL({dynamic:true}))
        .setFooter(global.config.footer, message.user.avatarURL({dynamic:true}))
        .setTimestamp()
        .setDescription(`Hey, **${channelData.name}** isimli kanalın backup'u kullanılarak, sunucuda aynı ayarları ile oluşturulup, kanalın rol izinleri ayarlanacaktır.\n\nOnaylıyor iseniz ✅ emojisine tıklayın!`)
  
        await message.channel.send({ embed: kEmbed }).then(msg => {
          msg.react("✅");
  
          const onay = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
  
          const collect = msg.createReactionCollector(onay, { time: 60000 });
  
          collect.on("collect", async r => {
            setTimeout(async function(){
  
              msg.delete().catch(err => console.log(`Backup mesajı silinemedi.`));
  
              message.guild.channels.create(channelData.name, {type: channelData.type}).then(channel => {
                if(channel.type === "voice"){
                  channel.setBitrate(channelData.bitrate);
                  channel.setUserLimit(channelData.userLimit);
                  channel.setParent(channelData.parentID);
                  channel.setPosition(channelData.position);

                  if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                    for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                      channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                    };
                  };

                }else if(channel.type === "category"){
                  if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                    for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                      channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                    };
                  };
                }else {
                  channel.setRateLimitPerUser(channelData.setRateLimitPerUser);
                  channel.setTopic(channelData.topic);
                  channel.setParent(channelData.parentID);
                  channel.setPosition(channelData.position);

                  if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                    for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                      channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                    };
                  };

                };
              });

              let logKanali = client.channels.cache.get(global.config.logChannel);
              if (logKanali) { logKanali.send(new Discord.MessageEmbed().setColor("#fd72a4").setAuthor('Kanal Yedeği Kullanıldı!', message.guild.iconURL({dynamic: true})).setDescription(`**${message.author.tag}** tarafından **${channelData.name}** (**${channelData.channelID}**) kanalının yedeği kurulmaya başlandı! Kanal sunucuda tekrar aynı ayarları ile oluşturuluyor, rol izinleri ekleniyor.`).setFooter(global.config.footer).setTimestamp()).catch(); } else { message.guild.owner.send(new Discord.MessageEmbed().setColor("#fd72a4").setAuthor('Kanal Yedeği Kullanıldı!', message.guild.iconURL({dynamic: true})).setDescription(`**${message.author.tag}** tarafından **${channelData.name}** (**${channelData.channelID}**) kanalının yedeği kurulmaya başlandı! Kanal sunucuda tekrar aynı ayarları ile oluşturuluyor, rol izinleri ekleniyor.`).setFooter(global.config.footer).setTimestamp()).catch(err => {}); };
            
            }, 450)
          })
        })
        });
    
}


exports.conf ={
   enabled: true,
    guildOnly: true,
    aliases: ['channelsetup', 'kanalsetup', 'kanal-kur', 'channel-kur', 'channel-setup'],
    permLevel: 0
}

exports.help = {
    name: 'kanalkur',
    description: 'Silinen bir kanalı aynı izinleri ile kurar.',
    usage: 'kanalkur <id>'
}
