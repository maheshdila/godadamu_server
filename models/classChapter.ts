import mongoose, { Document, Schema } from "mongoose";
import { ClassType, Month,subjects } from "../utils/enums";

import { classSchema } from "./class.model";
import { IClass } from "./class.model";

export interface IClassChapter extends IClass{
  chapterName: string;
  weeknumber: number;
  liveLink: string;
  date: Date;
  
}

const classChapterSchema: Schema<IClassChapter> = new mongoose.Schema({
...classSchema.obj,
  
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
chapterName: {
    type: String,
    required: true,
},
weeknumber: {
    type: Number,
    required: true,
},
liveLink: {
    type: String,
    required: true,
},
date: {
    type: Date,
    required: true,
},
});

const ClassChapter = mongoose.model<IClassChapter>('ClassChapter', classChapterSchema);

export default ClassChapter;