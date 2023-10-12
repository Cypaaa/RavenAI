const Discord = require("discord.js");
const OpenAIApi = require("openai");
const path = require("path");
const fs = require("fs");

console.clear();
require("dotenv").config();

// initialize our process object for the rest of our program
process.discord = new Object();
process.discord.voice = new Object();
process.discord.commands = new Object();
process.OpenAI = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
});

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.Guilds,
    ]
});

// Registering in our events to detect them
let eventPath = path.join(__dirname, "event");
fs.readdir(eventPath,
    { withFileTypes: false, },
    (error, files) => {
        files.forEach(file => {
            if (file.endsWith(".js")) {
                let eventName = file.slice(file, file.length - 3);
                client.on(eventName, require(path.join(eventPath, file)));
                console.log("Loaded event: " + eventName);
            }
        });
    });

// Same for our commands so messageCreate can trigger them
let commandPath = path.join(__dirname, "command");
fs.readdir(commandPath,
    { withFileTypes: false, },
    (error, files) => {
        files.forEach(file => {
            if (file.endsWith(".js")) {
                let command = require(path.join(commandPath, file));
                process.discord.commands[command.name.toLowerCase()] = command;
                console.log("Loaded command: " + command.name);
            }
        });
    });


client.login(process.env.DISCORD_TOKEN);