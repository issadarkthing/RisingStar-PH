import { Message } from "discord.js";
import { UserCommand } from "../structure/UserCommand";
//@ts-ignore
import { Captcha } from "discord.js-captcha";
import { client } from "../index";

export default class extends UserCommand {
  name = "verify";

  async exec(msg: Message, args: string[]) {

    const captcha = new Captcha(client, {
      guildID: msg.guild!.id,
      roleID: process.env.VERIFIED_ROLE_ID,
      channelID: msg.channel.id,
      sendToTextChannel: true,
    });

    captcha.present(msg.member);
  }
}
