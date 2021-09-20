import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";

export default class extends UserCommand {
  name = "ping";

  async exec(msg: Message) {
    msg.channel.send("pong");

    const player = await this.getUser(msg.author.id);

    player.balance = Math.round(player.balance);
    player.save();
  }
}
