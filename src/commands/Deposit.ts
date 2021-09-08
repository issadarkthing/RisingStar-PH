import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { UserCommand } from "../structure/UserCommand";

export default class Deposit extends UserCommand {
  name = "deposit";
  aliases = ["depo"];

  async exec(msg: Message, args: string[]) {

    const user = await this.getUser(msg.author.id);
    let amount = parseInt(args[0]);
    const template = new EmbedTemplate(msg);

    if (args[0] !== "all") {
      if (Number.isNaN(amount) || !Number.isInteger(amount)) {
        template.showError("invalid amount given");
        return;
      } else if (amount <= 0) {
        template.showError("cannot deposit less than 1");
        return;
      } else if (amount > user.balance) {
        template.showError("insufficient amount");
        return;
      }
    } else {
      amount = user.balance;
    }

    user.balance -= amount;
    user.bank += amount;

    await user.save();

    template.showSuccess(`Successfully deposited $${amount}`);
  }
}
