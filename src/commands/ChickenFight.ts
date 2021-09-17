import { UserCommand } from "../structure/UserCommand";
import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { random, sleep } from "../structure/utils";

export default class extends UserCommand {
  name = "chicken-fight";
  aliases = ["cf"];
  winningChance = 0.65;

  async exec(msg: Message, args: string[]) {

    const player = await this.getUser(msg.author.id);
    const [arg1] = args;

    let amount = 0;

    try {

      amount = this.validateAmount(arg1, player.balance);

    } catch (err) {
      msg.channel.send(err.message);
      return;
    }

    const embed = new EmbedTemplate(msg);

    const loadingMessage = await embed.showInfo("Fighting..");

    await sleep(4);
    await loadingMessage.delete();

    const win = random().bool(this.winningChance);

    if (win) {
      embed.showSuccess(`Your chicken wins! you earned ${amount * 2}!`);
      player.balance += amount;

    } else {
      embed.showError(`Your chicken died! you lost ${amount}!`);
      player.balance -= amount;

    }

    player.save();
  }
}
