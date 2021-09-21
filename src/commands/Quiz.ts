import { Message } from "discord.js";
import { Button, UserCommand } from "../structure/UserCommand";
import fs from "fs";
import path from "path";
import { random } from "../structure/utils";
import { EmbedTemplate } from "../structure/EmbedTemplate";

export default class extends UserCommand {
  name = "quiz";
  aliases = ["q"];
  description = "play quiz game";

  async exec(msg: Message) {

    const embed = new EmbedTemplate(msg);
    const dbPath = path.resolve("quiz.json");
    const file = fs.readFileSync(dbPath, { encoding: "utf8" });
    const db = JSON.parse(file);
    const questions = Object.keys(db);
    const answers = Object.values(db);

    const selectedQuestion = random().pick(questions);
    const selectedAnswer = db[selectedQuestion];
    const randomAnswers = random().sample(answers, 3);

    const buttons: Button[] = [];

    for (const answer of random().shuffle([selectedAnswer, ...randomAnswers])) {
      buttons.push({
        id: answer,
        label: answer,
      });
    }

    const result = await this.collect(msg, selectedQuestion, buttons);

    await embed.showInfo(`The answer is: ${selectedAnswer}`);

    for (const [member, [selected]] of result) {

      const player = await this.getUser(member.id);

      if (selected === selectedAnswer) {
        const amount = 300;
        await embed.showSuccess(`${member.displayName} got it right!`);
        await embed.showSuccess(`${member.displayName} earned ${amount}!`);
        player.balance += amount;
        await player.save();
      } else {
        embed.showError(`${member.displayName} got it wrong`);
      }
    }
  }
}
