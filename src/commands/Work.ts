import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { random } from "../structure/utils";


export default class Work extends UserCommand {
  name = "work";

  async exec(msg: Message, args: string[]) {

    const user = await this.getUser(msg.author.id);
    const earned = random().integer(1, 50);

    user.balance += earned;
    await user.save();

    msg.channel.send(`You earned $${earned}!`);
  }
}
