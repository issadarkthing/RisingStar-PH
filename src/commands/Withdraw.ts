import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { UserCommand } from "../structure/UserCommand";

export default class Withdraw extends UserCommand {
  name = "withdraw";
  aliases = ["wd"];

  async exec(msg: Message, args: string[]) {

    const user = await this.getUser(msg.author.id);
    let amount = parseInt(args[0]);
    const template = new EmbedTemplate(msg);

    if (args[0] !== "all") {
      if (Number.isNaN(amount) || !Number.isInteger(amount)) {
        template.showError("invalid amount given");
        return;
      } else if (amount <= 0) {
        template.showError("cannot withdraw less than 1");
        return;
      } else if (amount > user.bank) {
        template.showError("insufficient amount");
        return;
      }
    } else {
      amount = user.bank;
    }

    user.bank -= amount;
    user.balance += amount;

    await user.save();

    template.showSuccess(`Successfully withdrew $${amount}`);
  }
}
