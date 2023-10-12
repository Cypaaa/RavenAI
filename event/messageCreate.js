const Error = require("../utils/error.js");
module.exports = (message) => {
    // when a message is received and the author is not a bot
    if (message.author.bot) return;
    // we split the content to check if the first word is our prefix
    // that triggers our commands
    let args = message.content.split(" ");
    let commandName = args.shift();
    let commandProperties = process.discord.commands[commandName.toLowerCase().slice(1)];
    if (commandName[0] == process.env.DISCORD_PREFIX && commandProperties) {
        // if it match our previous conditionsm execute the command
        if (message.member.permissions.has(commandProperties.permissions)) {
            commandProperties.execute(message.member, message, args);
        } else {
            // if the user is missing the required permission to
            // execute the command, then he is told
            message.reply(Error.PermissionMissing);
        }
    }
};