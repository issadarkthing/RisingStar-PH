import { Message } from "discord.js";
import { Button, UserCommand } from "../structure/UserCommand";
import fs from "fs";
import path from "path";
import { random } from "../structure/utils";

export default class extends UserCommand {
  name = "quiz";
  aliases = ["q"];

  async exec(msg: Message, args: string[]) {

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

    await msg.channel.send(`The answer is: ${selectedAnswer}`);

    for (const [member, [selected]] of result) {

      const player = await this.getUser(member.id);

      if (selected === selectedAnswer) {
        const amount = 300;
        await msg.channel.send(`${member.displayName} got it right!`);
        await msg.channel.send(`${member.displayName} earned ${amount}!`);
        player.balance += amount;
        await player.save();
      }
    }
  }
}
