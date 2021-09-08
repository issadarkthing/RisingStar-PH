import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { UserCommand } from "../structure/UserCommand";
import { DateTime } from "luxon";

export default class Claim extends UserCommand {
  name = "claim";
  amount = 200;

  async exec(msg: Message, args: string[]) {

    const user = await this.getUser(msg.author.id);
    const now = DateTime.now();
    const template = new EmbedTemplate(msg);

    if (user.lastDailyClaim) {
      const lastClaimed = DateTime.fromJSDate(user.lastDailyClaim);
      const nextClaim = lastClaimed.plus({ days: 1 });

      if (nextClaim > now) {
        const timeLeft = nextClaim.toRelative({ unit: "hours" });
        template.showError(`You can claim again ${timeLeft}`);
        return;
      }
    }

    user.lastDailyClaim = now.toJSDate();
    user.balance += this.amount;
    await user.save();

    template.showSuccess(`You have claimed your daily $${this.amount}!`);
  }
}
