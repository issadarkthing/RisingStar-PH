import { Message } from "discord.js";
import { EmbedTemplate } from "../structure/EmbedTemplate";
import { UserCommand } from "../structure/UserCommand";
import { random, sleep } from "../structure/utils";

export default class extends UserCommand {
  name = "doubleornothing";
  aliases = ["don"];

  async exec(msg: Message, args: string[]) {

    const embed = new EmbedTemplate(msg);

    const loadingMessage = await embed.showInfo("Calculating the odds..");

    await sleep(3);
    await loadingMessage.delete();

    const win = random().bool();
    const player = await this.getUser(msg.author.id);
    const amount = player.balance * 2;

    if (amount === 0) {
      return msg.channel.send("Cannot play with zero bet");
    }

    if (win) {
      embed.showSuccess(`Congrats, you won ${amount} coins!`);
      player.balance = amount;
    } else {
      embed.showError(`You just lost ${player.balance} coins!`);
      player.balance = 0;
    }

    player.save();
  }
}
