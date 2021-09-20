import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";

export default class extends UserCommand {
  name = "ping";
  description = "ping NASA";

  async exec(msg: Message) {
    msg.channel.send("pong");
  }
}
