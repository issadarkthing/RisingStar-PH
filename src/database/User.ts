import { Model, model, Schema, Document } from "mongoose";


const userSchema = new Schema({
  userID: String,
  balance: { type: Number, default: 0 },
});

userSchema.statics.findByUserID = function(userID: string) {
  return this.findOne({ userID });
}

interface UserDocument extends Document {
  userID: string;
  balance: number;
};

interface UserModel extends Model<UserDocument> {
  findByUserID(userID: string): Promise<UserDocument>;
};

export const User = model<UserDocument>("User", userSchema) as UserModel;
