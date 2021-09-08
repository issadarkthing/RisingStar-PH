import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { random } from "../structure/utils";

export default class Slut extends UserCommand {
  name = "slut";
  min = 20;
  max = 40;
  successRate = 0.8;
  throttle = 60 * 1000; // 60 seconds

  async exec(msg: Message, args: string[]) {

    const user = await this.getUser(msg.author.id);
    const earned = random().integer(this.min, this.max);
    const isSuccess = random().bool(this.successRate);

    if (isSuccess) {
      user.balance += earned;
      await user.save();
      msg.channel.send(`You earned $${earned}!`);
    } else {
      msg.channel.send("Slut attempt failed");
    }
  }
}
