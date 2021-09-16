import { Command } from "@jiman24/commandment";
import { Message, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
import { Options, Result, RockPaperScissors } from "../structure/RockPaperScissor";

export default class extends Command {
  name = "rockpaperscissor";
  aliases = ["rps"];
  
  async exec(msg: Message, args: string[]) {

    const rock = new MessageButton()
      .setCustomId(Options.ROCK)
      .setLabel("Rock")
      .setStyle("PRIMARY");

    const paper = new MessageButton()
      .setCustomId(Options.PAPER)
      .setLabel("Paper")
      .setStyle("PRIMARY");

    const scissors = new MessageButton()
      .setCustomId(Options.SCISSORS)
      .setLabel("Scissors")
      .setStyle("PRIMARY");

    const row = new MessageActionRow()
      .addComponents(rock, paper, scissors);

    const message = await msg.channel.send({ content: "Please select", components: [row] });

    const filter = (i: MessageComponentInteraction) => {
      i.deferUpdate();
      return i.user.id === msg.author.id;
    };

    const collector = msg.channel.createMessageComponentCollector({ filter, max: 1 });

    collector.on("end", async (button) => {
      const id = button.first()?.customId as Options | undefined;

      if (!id) return;


      const result = RockPaperScissors.random(id);

      if (result === Result.WIN) {
        msg.channel.send("You won!");
      } else if (result === Result.DRAW) {
        msg.channel.send("Draw!");
      } else if (result === Result.LOSE) {
        msg.channel.send("You lose!");
      }

      await message.delete();
    })


  }
}
