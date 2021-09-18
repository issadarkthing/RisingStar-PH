import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { random } from "../structure/utils";

export default class extends UserCommand {
  name = "roulette";

  async exec(msg: Message, args: string[]) {

    const [arg1, arg2] = args;

    if (!arg1) {
      return msg.channel.send("You must place a bet");
    } else if (!arg2) {
      return msg.channel.send("You must specify space");
    }

    let amount = 0;
    const player = await this.getUser(msg.author.id);

    try {
      amount = this.validateAmount(arg1, player.balance);

    } catch (err) {
      return msg.channel.send(err.message);
    }

    let multiplier = 1;
    const chosenNumber = random().integer(1, 36);
    const color = random().pick(["black", "red"]);

    player.balance -= amount;

    if (chosenNumber.toString() === arg2) {
      multiplier++;
    }

    if (color === arg2) {
      multiplier++;
    }

    if (multiplier > 1) {
      const winAmount = amount * multiplier;
      msg.channel.send(`You have won ${winAmount}!`);
      player.balance += winAmount;

    } else {
      msg.channel.send(`You have lost ${amount}`);

    }

    player.save();
  }
}
