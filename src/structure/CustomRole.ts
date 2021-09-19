import { Guild, MessageEmbed, Role } from "discord.js";
import { RoleDocument } from "../database/Role";
import { BROWN } from "./utils";

export class CustomRole {
  roleDB: RoleDocument;
  role: Role;

  constructor(guild: Guild, roleDB: RoleDocument) {
    this.roleDB = roleDB;

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
}
