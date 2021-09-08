import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { random } from "../structure/utils";


export default class Work extends UserCommand {
  name = "work";
  min = 1;
  max = 25;

  async exec(msg: Message, args: string[]) {

    const user = await this.getUser(msg.author.id);
    const earned = random().integer(this.min, this.max);

    user.balance += earned;
    await user.save();

    msg.channel.send(`You earned $${earned}!`);
  }
}
