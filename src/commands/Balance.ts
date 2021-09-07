import { Message, MessageEmbed } from "discord.js";
import { UserCommand } from "../structure/UserCommand";

export default class Balance extends UserCommand {
  name = "balance";
  aliases = ["bal", "b"];

  async exec(msg: Message, args: string[]) {

    const user = await this.getUser(msg.author.id);

    const embed = new MessageEmbed()
      .setTitle("User profile")
      .setThumbnail(msg.author.displayAvatarURL())
      .addField("Name", msg.author.username, true)
      .addField("Balance", `$${user.balance}`, true)
    
    msg.channel.send({ embeds: [embed] });
  }
}
