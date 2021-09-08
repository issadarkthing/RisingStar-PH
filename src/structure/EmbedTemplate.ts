import { User, MessageEmbed, Message } from "discord.js";


export class EmbedTemplate {
  static base(user: User, msg: string) {
    const embed = new MessageEmbed()
      .setTitle(`${user.username}#${user.discriminator}`)
      .setDescription(msg)

    return embed;
  }

  static info(user: User, msg: string) {
    const embed = this.base(user, msg);
    embed.setColor("#1e90ff");
    return embed;
  }

  static success(user: User, msg: string) {
    const embed = this.base(user, msg);
    embed.setColor("#32cd32");
    return embed;
  }

  static error(user: User, msg: string) {
    const embed = this.base(user, msg);
    embed.setColor("#ff4f4f");
    return embed;
  }

  static sendEmbed(msg: Message, embed: MessageEmbed) {
    msg.channel.send({ embeds: [embed] });
  }
}
