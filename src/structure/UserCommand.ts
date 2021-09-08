import { Command } from "@jiman24/commandment";
import { User } from "../database/User";


export abstract class UserCommand extends Command {

  /**
   * Helper method to reduce the boilerplate of validating the argument given by
   * user. It checks if the argument was given, if the argument is valid number
   * (i.e. not negative and floating number), and check if it exceeds
   * maxAmount.
   * */
  validateAmount(arg: string | undefined, maxAmount: number) {
    if (!arg) throw new Error("no amount given");

    const amount = parseInt(arg);

    if (arg !== "all") {
      if (Number.isNaN(amount) || !Number.isInteger(amount)) {
        throw new Error("invalid amount given");
      } else if (amount <= 0) {
        throw new Error("negatives and zeros is not allowed");
      } else if (amount > maxAmount) {
        throw new Error("insufficient amount");
      }

      return amount;
    }

    return maxAmount;
  }

  async getUser(userID: string) {
    const user = await User.findByUserID(userID);

    if (!user) {
      const user = new User({ userID });
      await user.save();
    }

    return user;
  }
}
