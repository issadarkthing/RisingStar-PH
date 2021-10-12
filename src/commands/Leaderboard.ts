import { Guild, Message, MessageEmbed, TextChannel } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { User } from "../database/User";
import { Player } from "../structure/Player";
import { inlineCode, toNList, chunk } from "../structure/utils";
import { Pagination } from "discordjs-v13-button-pagination";
import { stripIndents } from "common-tags";

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

    return players.map((x, i) => `${i+1}\t| ${x.netWorth()} | ${x.name}`);
  }

  async create(guild: Guild) {

    const list = await this.getList(guild);
    const listText = toNList(list);

    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("Leaderboard")
      .setDescription(listText);

    return embed;
  }

  async exec(msg: Message) {
    const list = await this.getList(msg.guild!);

    const embeds = chunk(list, 10)
      .map(x => {
        const embed = new MessageEmbed()
          .setTitle("Leaderboard")
          .setDescription(
            stripIndents`
            \`\`\`yaml
            Rank | Coins | Users
            ===============================================
            ${x.join("\n")}
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
