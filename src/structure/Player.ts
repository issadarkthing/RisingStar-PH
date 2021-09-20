import { GuildMember } from "discord.js";
import { Player as PlayerRPG } from "discordjs-rpg";
import { User, UserDocument } from "../database/User";
import { BasePet } from "./Pet";
import { BaseArmor } from "./Armor";

export class Player extends PlayerRPG {
  private user: UserDocument;

  constructor(member: GuildMember, user: UserDocument) {
    super(member);
    this.user = user;
  }

  get balance() {
    return this.user.balance;
  }

  set balance(amount: number) {
    this.user.balance = amount;
  }

  setPet(pet: BasePet) {
    pet.setOwner(this);
    this.user.pet = pet.id;
  }

  addArmor(armor: BaseArmor) {
    this.equipArmor(armor);
    this.user.armor.push(armor.id);
  }

  save() {
    return this.user.save();
  }

  copy() {
    const clone = super.copy();
    Object.assign(clone, this);
    return clone;
  }

  show() {
    const profile = super.show();
    const armorIndex = 8;
    const armor = profile.fields.at(armorIndex)!.value;
    profile.fields.at(armorIndex)!.name = "Coin";
    profile.fields.at(armorIndex)!.value = this.balance.toString();
    profile.fields.at(armorIndex)!.inline = true;

    profile.addField("Armor", armor);
    return profile;
  }

  static async fromMember(member: GuildMember) {
    let user = await User.findByUserID(member.id);

    if (!user) {
      user = new User({ userID: member.id });
      await user.save();
    }

    const player = new Player(member, user);
    const pet = BasePet.all.find(x => x.id === user.pet);
    const armors = user.armor
      .map(armorID => {
        return BaseArmor.all.find(x => x.id === armorID)!;
      })
      .filter(x => x !== undefined);

    pet?.setOwner(player);

    for (const armor of armors) {
      player.equipArmor(armor);
    }

    return player;
  }
}
