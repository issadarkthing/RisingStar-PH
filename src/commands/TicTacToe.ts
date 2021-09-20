import { UserCommand } from "../structure/UserCommand";
import { Message } from "discord.js";
//@ts-ignore
import TicTacToe from "discord-tictactoe";
    
const game = new TicTacToe({ language: 'en' });

export default class extends UserCommand {
  name = "tic-tac-toe";
  aliases = ["ttt"];
  description = "play tic tac toe";

  async exec(msg: Message, args: string[]) {
    await game.handleMessage(msg);
  }
}
