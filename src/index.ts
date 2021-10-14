import { Client, TextBasedChannels, TextChannel } from "discord.js";
import { CommandManager } from "@jiman24/commandment";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import CoinDrop from "./commands/CoinDrop";
import { CustomRole } from "./structure/CustomRole";
import Leaderboard from "./commands/Leaderboard";
import { nukeChannel } from "./structure/utils";

dotenv.config();

const COMMAND_PREFIX = process.env.PREFIX || "!";
export const client = new Client({ intents: [
  "GUILDS", 
  "GUILD_MESSAGES", 
  "GUILD_MEMBERS",
  "DIRECT_MESSAGES",
] });

export const commandManager = new CommandManager(COMMAND_PREFIX);

commandManager.verbose = true;
commandManager.registerCommands(path.resolve(__dirname, "./commands"));
commandManager.registerCommandOnThrottleHandler((msg, cmd, timeLeft) => {
  const time = Math.round(timeLeft / 1000);
  msg.channel.send(`You cannot run ${cmd.name} command after ${time} s`);
});

client.on("ready", () => {
  console.log(client.user?.username, "is ready!");

  const leaderboardChannelID = process.env.LEADERBOARD_CHANNEL_ID;
  const guildID = process.env.GUILD_ID;

  if (!leaderboardChannelID) 
    throw new Error("no leaderboard channel id specified");
  else if (!guildID)
    throw new Error("no guild id specified");

  const channel = client.channels.cache.get(leaderboardChannelID);
  const guild = client.guilds.cache.get(guildID);

  setInterval(async () => {

    if (!channel || !guild)
      return;

    await guild.members.fetch();
    const leaderboard = new Leaderboard();
    const info = await leaderboard.create(guild);

    await nukeChannel(channel as TextChannel);

    (channel as TextBasedChannels).send({ embeds: [info] });

  }, 60 * 1000)
})

let messageCount = 0;
client.on("messageCreate", msg => { 

  if (!msg.guild) return;

  messageCount++;
  commandManager.handleMessage(msg); 

  const coinDrop = new CoinDrop();
  if (messageCount >= coinDrop.spawnAt) {
    messageCount = 0; 
    coinDrop.exec(msg);
  }

  CustomRole.checkRoles(msg.guild);

});

client.login(process.env.BOT_TOKEN);
mongoose.connect(process.env.DB_URI!)
  .then(() => console.log("connected to database"));
