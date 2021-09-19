import { Message, MessageEmbed } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { Role } from "../database/Role";
import { BROWN, toNList } from "../structure/utils";
import { CustomRole } from "../structure/CustomRole";

export default class extends UserCommand {
  name = "shop";

  async exec(msg: Message) {

    const rolesDB = await Role.find({ guildID: msg.guild!.id });

    const roles = rolesDB.map(role => new CustomRole(msg.guild!, role));
    const roleList = toNList(roles.map(x => `${x.role} \`${x.roleDB.price} coins\``));

    const embed = new MessageEmbed()
      .setColor(BROWN)
      .setTitle("Shop")
      .setDescription(roleList);

    msg.channel.send({ embeds: [embed] });
  }
}
