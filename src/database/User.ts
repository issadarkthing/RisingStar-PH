import { Model, model, Schema, Document } from "mongoose";


const userSchema = new Schema({
  userID: String,
  balance: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  lastDailyClaim: Date,
  roles: { type: [{ roleID: String, since: Date }], default: [] },
  pet: String,
  armor: [String],
});

userSchema.statics.findByUserID = function(userID: string) {
  return this.findOne({ userID });
}

export interface UserDocument extends Document {
  userID: string;
  balance: number;
  bank: number;
  roles: { roleID: string, since: Date }[];
  lastDailyClaim?: Date;
  pet: string;
  armor: string[];
};

export interface UserModel extends Model<UserDocument> {
  findByUserID(userID: string): Promise<UserDocument>;
};

export const User = model<UserDocument>("User", userSchema) as UserModel;
