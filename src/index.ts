import { Client } from "discord.js";
import { CommandManager } from "@jiman24/commandment";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./database/User";

dotenv.config();

const COMMAND_PREFIX = "!";
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const commandManager = new CommandManager(COMMAND_PREFIX);

commandManager.verbose = true;
commandManager.registerCommands(path.resolve(__dirname, "./commands"));

client.on("ready", () => console.log(client.user?.username, "is ready!"))
client.on("messageCreate", async msg => { 
  
  const user = await User.findByUserID(msg.author.id);

  if (!user) {
    const user = new User({ userID: msg.author.id });
    await user.save();
  }

  commandManager.handleMessage(msg); 
});

client.login(process.env.BOT_TOKEN);
mongoose.connect(process.env.DB_URI!)
  .then(() => console.log("connected to database"));
