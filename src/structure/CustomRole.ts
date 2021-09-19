import { Guild, MessageEmbed, Role, Message } from "discord.js";
import Ping from "../commands/Ping";
import { RoleDocument } from "../database/Role";
import { BROWN } from "./utils";

export class CustomRole {
  roleDB: RoleDocument;
  role: Role;
  guild: Guild;

  constructor(guild: Guild, roleDB: RoleDocument) {
    this.roleDB = roleDB;
    this.guild = guild;

    const role = guild.roles.cache.find(role => role.id === roleDB.roleID);

    if (!role) {
      throw new Error(`cannot find role "${this.roleDB.roleID}"`);
    }

    this.role = role;
  }

  show() {

    const embed = new MessageEmbed()
      .setColor(BROWN)
      .setTitle("Custom Role")
      .setDescription(`${this.role}`)
      .addField("Price", this.roleDB.price.toString(), true)
      .addField("Expires", this.roleDB.duration.toString(), true)

    return embed;
  }

  async buy(msg: Message) {

    const userID = msg.author.id;
    const ping = new Ping();
    const user = await ping.getUser(userID);

    if (user.balance < this.roleDB.price) {
      return msg.channel.send("insufficient balance");
    }

    user.balance -= this.roleDB.price;
    await user.save();

    const member = this.guild.members.cache.find(member => member.id === userID);

    if (!member)
      return msg.channel.send("member not found");

    await member.roles.add(this.role);

    msg.channel.send("purchase successful");
  }
}
