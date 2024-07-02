import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: String,
    bdate: Date,
    books: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        ref: "Book",
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.models.Author || model("Author", authorSchema);
