import { Guild, Message, MessageEmbed, TextChannel } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { User } from "../database/User";
import { Player } from "../structure/Player";
import { chunk } from "../structure/utils";
import { Pagination } from "discordjs-v13-button-pagination";
import { stripIndents } from "common-tags";
//@ts-ignore
import Table from "table-layout";

export default class extends UserCommand {
  name = "leaderboard";
  aliases = ["l"];
  description = "Leaderboard of most richest player";

  async getList(guild: Guild) {

    const users = await User.find();

    users.sort((a, b) => (b.balance + b.bank) - (a.balance + a.bank));

    const members = guild.members.cache;

    const players = await Promise.all(users
                     .map(x => members.get(x.userID))
                     .filter(x => !!x)
                     .map(x => Player.fromMember(x!)))

    return players.map((x, i) => ({ 
      rank: i + 1, 
      balance: x.netWorth(),
      user: x.name,
    }));
  }

  async create(guild: Guild) {

    const list = await this.getList(guild);
    const data = new Table(list, { minWidth: 5 });

    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("Leaderboard")
      .setDescription(
        stripIndents`
          \`\`\`yaml
          Rank | Coins | Users
          ===============================================
          ${data.toString()}
          \`\`\`
        `
      );

    return embed;
  }

  async exec(msg: Message) {
    const list = await this.getList(msg.guild!);

    const embeds = chunk(list, 10)
      .map(x => {
        const data = new Table(x, { minWidth: 5 });
        const embed = new MessageEmbed()
          .setTitle("Leaderboard")
          .setDescription(
            stripIndents`
            \`\`\`yaml
            Rank | Coins | Users
            ===============================================
            ${data.toString()}
            \`\`\`
            `
          )

        return embed;
      })

    const pagination = new Pagination(
      msg.channel as TextChannel, 
      embeds, 
      "page",
    );

    await pagination.paginate();
  } 
}
