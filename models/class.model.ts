import mongoose, { Document, Model, Schema } from "mongoose";
import { ClassType, Month , subjects} from "../utils/enums";

export interface IClass extends Document {
  id : string;
  subject: subjects ;
  year: number;
  month: Month;
  
  description: string;
  thumbnail: {
    public_id: string;
    url: string;
  };
  classType: ClassType;
  weeks: number;
}

const classSchema: Schema<IClass> = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    enum: Object.values(subjects),
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
  
  classType: {
    type: String,
    enum: Object.values(ClassType),
    required: true,
  },
  weeks: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    enum: Object.values(Month),
    required: true,
  },
});

const classModel: Model<IClass>= mongoose.model<IClass>('Class', classSchema);

export default classModel;
export { classSchema };
