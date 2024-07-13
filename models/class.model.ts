import mongoose, { Document, Schema } from "mongoose";

export interface IClass extends Document {
  name: string;
  description: string;
  thumbnail: {
    public_id: string;
    url: string;
  };
  liveClassroomLink: string;
}

const classSchema: Schema<IClass> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  liveClassroomLink: {
    type: String,
    required: true,
  },
});

const Class = mongoose.model<IClass>('Class', classSchema);

export default Class;