import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { random } from "../structure/utils";
import { EmbedTemplate } from "../structure/EmbedTemplate";

export default class Slut extends UserCommand {
  name = "slut";
  min = 20;
  max = 50;
  successRate = 0.65;
  throttle = 20 * 1000; // 20 seconds

  async exec(msg: Message, args: string[]) {

    const user = await this.getUser(msg.author.id);
    const earned = random().integer(this.min, this.max);
    const isSuccess = random().bool(this.successRate);

    if (isSuccess) {
      user.balance += earned;
      await user.save();
      const message = EmbedTemplate.success(msg.author, `You earned $${earned}!`);
      EmbedTemplate.sendEmbed(msg, message);
    } else {
      const message = EmbedTemplate.error(msg.author, `Slut attempt failed`);
      EmbedTemplate.sendEmbed(msg, message);
    }
  }
}
