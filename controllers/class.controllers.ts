import { Request, Response, NextFunction } from 'express';
import Class, {IClass} from '../models/class.model';
import ErrorHandler from '../utils/ErrorHandler';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors';

// Create a new class
export const createClass = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newClass = new Class(req.body);
    //check if class already exists
    const isClassExist = await Class
        .findOne({ subject: newClass.subject, year: newClass.year, month: newClass.month });
    if (isClassExist) {
        return next(new ErrorHandler('Class already exists', 400));
        }
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    next(new ErrorHandler("class was not created", 400));
  }
});

// Get all classes
export const getClasses = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    next(new ErrorHandler("error in retreiving the classes", 500));
  }
});

// Get a single class by ID
export const getClassById = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (classItem) {
      res.status(200).json(classItem);
    } else {
      next(new ErrorHandler('Class not found', 404));
    }
  } catch (error) {
    next(new ErrorHandler("couldn't complete the request", 500));
  }
});

// Update a class by ID
export const updateClass = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedClass) {
      res.status(200).json(updatedClass);
    } else {
      next(new ErrorHandler('Class not found', 404));
    }
  } catch (error) {
    next(new ErrorHandler("couldn't complete the request", 400));
  }
});

// Delete a class by ID
