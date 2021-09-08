import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { random } from "../structure/utils";
import { EmbedTemplate } from "../structure/EmbedTemplate";

export default class Crime extends UserCommand {
  name = "crime";
  min = 40;
  max = 120;
  successRate = 0.35;
  throttle = 40 * 1000; // 40 seconds

  async exec(msg: Message, args: string[]) {

    const user = await this.getUser(msg.author.id);
    const earned = random().integer(this.min, this.max);
    const isSuccess = random().bool(this.successRate);

    if (isSuccess) {
      user.balance += earned;
      await user.save();
      const message = `You earned $${earned}!`;
      const template = new EmbedTemplate(msg);
      template.showSuccess(message);
    } else {
      const message = `Crime attempt failed`;
      const template = new EmbedTemplate(msg);
      template.showError(message);
    }
  }
}
