import { UserCommand } from "../structure/UserCommand";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { Battle } from "discordjs-rpg";
import { Challenger } from "../structure/Challenger";

export default class extends UserCommand {
  name = "battle";

  async exec(msg: Message) {

    const mention = msg.mentions.members?.first();
    const player = await Player.fromMember(msg.member!);

    if (mention) {
      const opponent = await Player.fromMember(mention);

      const battle = new Battle(msg, [player, opponent]);
      await battle.run();

      return;
    }

    const challenger = new Challenger(player);

    const battle = new Battle(msg, [player, challenger]);
    const winner = await battle.run();

    if (winner.id === player.id) {

      player.balance += challenger.drop;
      await player.save();

      msg.channel.send(`${player.name} has earned ${challenger.drop} coins!`);
    } 

  }
}
