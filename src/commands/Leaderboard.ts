import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { User } from "../database/User";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { Player } from "../structure/Player";
import { inlineCode, toNList } from "../structure/utils";

export default class extends UserCommand {
  name = "leaderboard";
  aliases = ["l"];
  description = "Leaderboard of most richest player";

  async exec(msg: Message) {

    const users = await User.find();
    const embed = new EmbedTemplate(msg);

    users.sort((a, b) => (b.balance + b.bank) - (a.balance + a.bank));


    const members = msg.guild!.members.cache;

    const players = await Promise.all(users
                     .map(x => members.get(x.userID))
                     .filter(x => !!x)
                     .map(x => Player.fromMember(x!)))

    const list = players.map(x => `${x.name} ${inlineCode(x.netWorth())}`);
    const listText = toNList(list);

    embed.showInfo(listText);
  }
}
