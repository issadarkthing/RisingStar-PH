import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";

export default class extends UserCommand {
  name = "ping";
  aliases = ["p"];

  async exec(msg: Message, args: string[]) {
    msg.channel.send("pong");

    const player = await this.getUser(msg.author.id);

    player.balance = Math.round(player.balance);
    player.save();
  }
}
