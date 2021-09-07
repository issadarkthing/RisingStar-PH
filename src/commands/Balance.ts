import { Command } from "@jiman24/commandment"
import { Message, MessageEmbed } from "discord.js";
import { User } from "../database/User";


export default class Balance extends Command {
  name = "balance";
  aliases = ["bal", "b"];

  async exec(msg: Message, args: string[]) {

    const user = await User.findByUserID(msg.author.id);

    const embed = new MessageEmbed()
      .setTitle("User profile")
      .setThumbnail(msg.author.displayAvatarURL())
      .addField("Name", msg.author.username, true)
      .addField("Balance", `$${user.balance}`, true)
    
    msg.channel.send({ embeds: [embed] });
  }
}
