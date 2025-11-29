import mongoose from "mongoose";

const UserTempSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  token: String,
  createdAt: Date
});

export default mongoose.model("UserTemp", UserTempSchema);
