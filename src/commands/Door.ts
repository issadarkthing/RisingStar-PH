import { Message } from "discord.js";
import { Button, UserCommand } from "../structure/UserCommand";
import { random } from "../structure/utils";

export default class extends UserCommand {
  name = "door";
  description = "door game";

  async exec(msg: Message, args: string[]) {

    const arg1 = args[0];
    const player = await this.getUser(msg.author.id);

    let amount = 0;

    try {
      amount = this.validateAmount(arg1, player.balance);

    } catch (err: any) {
      return msg.channel.send(err.message);
    }

    const buttons: Button[] = [
      {
        id: "door-1",
        label: "🚪"
      },
      {
        id: "door-2",
        label: "🚪"
      },
      {
        id: "door-3",
        label: "🚪"
      },
    ];

    const text = "Please select a door. One of the doors consist of money bag";
    const result = await this.collect(msg, text, buttons);
    const selectedDoor = `door-${random().integer(1, 3)}`;

    const doors = buttons.map(button => {
      if (button.id === selectedDoor) {
        return "💰";
      } else {
        return button.label;
      }
    });

    await msg.channel.send(doors.join(" "));

    for (const [member, [selected]] of result) {

      const player = await this.getUser(member.id);

      if (player.balance < amount) {
        msg.channel.send(`${member} insufficient balance`);
        continue;
      }

      player.balance -= amount;

      if (selected === selectedDoor) {
        const reward = amount * 2;
        msg.channel.send(`${member.displayName} got that bag!`);
        msg.channel.send(`${member.displayName} earned ${reward}!`);

        player.balance += reward;
      } else {
        msg.channel.send(`${member.displayName} has lost ${amount}!`);
      }

      await player.save();
    }
  }
}
