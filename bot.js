// Load up the discord.js library
const Discord = require("discord.js");
// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`${client.users.size} Members.`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`NewLife_BOT`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`NewLife_BOT`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    if(!message.member.roles.some(r=>[".","『🌌』 Founder", "『✨』 Vice Founder", "『🔮』 Comunity Manager", "『🔮』Vice Community Manger", "『💥 』High  Management"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this!");
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send(".");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    if(!message.member.roles.some(r=>[".","『🌌』 Founder", "『✨』 Vice Founder", "『🔮』 Comunity Manager", "『🔮』Vice Community Manger", "『💥 』High  Management"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this!");

    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }


  if(command === "ip") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});  
    message.channel.send(sayMessage);

    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    message.channel.send("Server IP: 185.185.134.53:62509");
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>[".","『🌌』 Founder", "『✨』 Vice Founder", "『🔮』 Comunity Manager", "『🔮』Vice Community Manger", "『💥 』High  Management"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>[".","『🌌』 Founder", "『✨』 Vice Founder", "『🔮』 Comunity Manager", "『🔮』Vice Community Manger", "『💥 』High  Management"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "clear") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    if(!message.member.roles.some(r=>[".","『🌌』 Founder", "『✨』 Vice Founder", "『🔮』 Comunity Manager", "『🔮』Vice Community Manger", "『💥 』High  Management"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this!");
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

  if(command === "help") {
    
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});  
    message.channel.send(sayMessage);
    //Embed Code
    const help = new Discord.RichEmbed()
	.setColor('#0099ff')
	.setTitle('__**NewLife Commands:**__')
	//.setURL('https://discord.gg/pjySjVs')
	.setAuthor('Discord', 'https://i.imgur.com/qAEqC47.png', 'https://discord.gg/pjySjVs', true)
	//.setDescription('**.ban (@Mention)** \n Bans someone from the discord.\n \n **.kick (@Mention)** \n Kicks someone from the discord.')
	.setThumbnail('https://i.imgur.com/1TJOfY7.png')
	.addField('.ban (@Mention)', 'Bans people from the discord.')
  //.addBlankField()
	.addField('.kick (@Mention)', 'Kicks people from the discord.', false)
  //.addBlankField()
  //.addBlankField()
	.addField('.ip', 'Sends the Fivem server IP.', false )
 // .addBlankField()
  .addField('.clear (Number)', 'Clearing a number of messages you choose.', false)
  //.addBlankField()
	.addField('.dm (@mention) (message)', 'Sends a private message to a person.', false)
  .addField('.dmall (message)', 'It dms all the people in the server.', false)
  .addField('.website', 'sends our official website.', false)
	//.setImage('https://i.imgur.com/1TJOfY7.png')
	.setTimestamp()
	.setFooter('© Made by Vex', 'https://i.imgur.com/1TJOfY7.png');
  //message.channel.send(help);
  message.author.send(help);
  }

if(command === "dm"){
  if(!message.member.roles.some(r=>[".","『🌌』 Founder", "『✨』 Vice Founder", "『🔮』 Comunity Manager", "『🔮』Vice Community Manger", "『💥 』High  Management"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this!");

  const sayMessage = args.join(" ");

    let dUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if (!dUser) return message.channel.send("Can't find user!")
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You can't you that command!")
    let dMessage = args.join(" ").slice(22);
    if(dMessage.length < 1) return message.reply('You must supply a message!')

    dUser.send(`**A message from a NewLife Administrator:** \n${dMessage}`)

    message.channel.send(`${message.author} The message was sent :thumbsup:`)
}


if (command === "dmall"){

if(!message.member.roles.some(r=>[".","『🌌』 Founder", "『✨』 Vice Founder", "『🔮』 Comunity Manager", "『🔮』Vice Community Manger", "『💥 』High  Management"].includes(r.name)) )
    return message.reply("Sorry, you don't have permissions to use this!");

   let dmGuild = message.guild;
        let role = message.mentions.roles.first();
        var msg = message.content;


        try {
            msg = msg.substring(msg.indexOf("dmall") + 5);
        } catch(error) {
            console.log(error);
            return;
        }

        if(!msg || msg.length <= 1) {
            const embed = new Discord.RichEmbed()
                .addField(":x: Failed to send", "Message not specified")
                .addField(":eyes: Listen up!", "Every character past the command will be sent,\nand apparently there was nothing to send.");
            message.channel.send({ embed: embed });
            return;
        }

        let memberarray = dmGuild.members.array();
        let membercount = memberarray.length;
        let botcount = 0;
        let successcount = 0;
        console.log(`Responding to ${message.author.username} :  Sending message to all ${membercount} members of ${dmGuild.name}.`)
        for (var i = 0; i < membercount; i++) {
            let member = memberarray[i];
            if (member.user.bot) {
                console.log(`Skipping bot with name ${member.user.username}`)
                botcount++;
                continue
            }
            let timeout = Math.floor((Math.random() * (config.wait - 0.01)) * 1000) + 10;
            await sleep(timeout);
            if(i == (membercount-1)) {
                console.log(`Waited ${timeout}ms.\t\\/\tDMing ${member.user.username}`);
            } else {
                console.log(`Waited ${timeout}ms.\t|${i + 1}|\tDMing ${member.user.username}`);
            }
            try {
                member.send(`${msg}`);
                successcount++;
            } catch (error) {
                console.log(`Failed to send DM! ` + error)
            }
        }
        console.log(`Sent ${successcount} ${(successcount != 1 ? `messages` : `message`)} successfully, ` +
            `${botcount} ${(botcount != 1 ? `bots were` : `bot was`)} skipped.`);
    }
    
    if(command === "website") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});  
    message.channel.send(sayMessage);

    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    message.channel.send("http://newlifeweb.epizy.com");
  }
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

});

client.login(config.token);
