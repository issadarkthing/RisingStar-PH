import { Command } from "@jiman24/commandment";
import { User } from "../database/User";


export abstract class UserCommand extends Command {

  async getUser(userID: string) {

    const user = await User.findByUserID(userID);

    if (!user) {
      const user = new User({ userID });
      await user.save();
    }

    return user;
  }
}
