import { Guild, Message, MessageEmbed } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { User } from "../database/User";
import { Player } from "../structure/Player";
import { inlineCode, toNList } from "../structure/utils";

export default class extends UserCommand {
  name = "leaderboard";
  aliases = ["l"];
  description = "Leaderboard of most richest player";

  async create(guild: Guild) {
    const users = await User.find();

    users.sort((a, b) => (b.balance + b.bank) - (a.balance + a.bank));

    const members = guild.members.cache;

    const players = await Promise.all(users
                     .map(x => members.get(x.userID))
                     .filter(x => !!x)
                     .map(x => Player.fromMember(x!)))

    const list = players.map(x => `${x.name} ${inlineCode(x.netWorth())}`);
    const listText = toNList(list);

    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("Leaderboard")
      .setDescription(listText);

    return embed;
  }

  async exec(msg: Message) {
    const leaderboard = await this.create(msg.guild!);
    msg.channel.send({ embeds: [leaderboard] });
  }
}
