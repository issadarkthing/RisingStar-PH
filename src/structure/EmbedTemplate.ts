import { User, MessageEmbed, Message } from "discord.js";

export class EmbedTemplate {
  private msg: Message;
  private base: MessageEmbed;
  
  constructor(msg: Message) {
    this.msg = msg;
    this.base = EmbedTemplate.base(msg.author);
  }

  static base(user: User) {
    const embed = new MessageEmbed()
      .setTitle(`${user.username}#${user.discriminator}`)

    return embed;
  }

  showInfo(message: string) {
    const embed = this.base;
    embed.setColor("#1e90ff");
    embed.setDescription(message);
    this.msg.channel.send({ embeds: [embed] });
  }

  showSuccess(message: string) {
    const embed = this.base;
    embed.setColor("#32cd32");
    embed.setDescription(message);
    this.msg.channel.send({ embeds: [embed] });
  }

  showError(message: string) {
    const embed = this.base;
    embed.setColor("#ff4f4f");
    embed.setDescription(message);
    this.msg.channel.send({ embeds: [embed] });
  }
}
