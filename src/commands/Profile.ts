import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { UserCommand } from "../structure/UserCommand";


export default class extends UserCommand {
  name = "profile";
  aliases = ["p"];

  async exec(msg: Message) {

    const player = await Player.fromMember(msg.member!);

    msg.channel.send({ embeds: [player.show()] });
  }
}
