import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
import { Role } from "../database/Role";
import { BROWN, toNList } from "../structure/utils";
import { CustomRole } from "../structure/CustomRole";

export default class extends UserCommand {
  name = "shop";

  async exec(msg: Message, args: string[]) {

    const rolesDB = await Role.find({ guildID: msg.guild!.id });
    const roles = rolesDB.map(role => new CustomRole(msg.guild!, role));
    const [index] = args;


    if (index) {

      const selected = roles.at(parseInt(index) - 1);

      if (!selected) {
        return msg.channel.send("no item found");
      }

      const info = selected.show();

      const button = new MessageButton()
        .setCustomId("buy")
        .setLabel("buy")
        .setStyle("PRIMARY");

      const row = new MessageActionRow()
        .addComponents(button);

      msg.channel.send({ embeds: [info], components: [row] });

      const filter = (i: MessageComponentInteraction) => {
        i.deferUpdate();
        return i.user.id === msg.author.id;
      }

      const collector = msg.channel.createMessageComponentCollector({ max: 1, filter });

      collector.on("end", buttons => {
        const button = buttons.first();

        if (!button) return;

        selected.buy(msg);
      })

      return;
    }


    const roleList = toNList(roles.map(x => `${x.role} \`${x.roleDB.price} coins\``));

    const embed = new MessageEmbed()
      .setColor(BROWN)
      .setTitle("Shop")
      .setDescription(roleList);

    msg.channel.send({ embeds: [embed] });
  }
}
