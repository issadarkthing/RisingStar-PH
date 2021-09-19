import { Guild, Role } from "discord.js";
import { RoleDocument } from "../database/Role";

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
}
