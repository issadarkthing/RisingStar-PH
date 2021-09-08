import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { UserCommand } from "../structure/UserCommand";
import { random } from "../structure/utils";


export default class Work extends UserCommand {
  name = "work";
  min = 1;
  max = 20;

  async exec(msg: Message, args: string[]) {

    const user = await this.getUser(msg.author.id);
    const earned = random().integer(this.min, this.max);

    user.balance += earned;
    await user.save();

    const message = EmbedTemplate.success(msg.author, `You earned $${earned}!`);
    EmbedTemplate.sendEmbed(msg, message);
  }
}
