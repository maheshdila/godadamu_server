import { Request, Response, NextFunction } from 'express';
import classModel , {IClass} from '../models/class.model';
import ErrorHandler from '../utils/ErrorHandler';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors';

// Create a new class
export const createClass = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newClass = new classModel(req.body);
    //check if class already exists
    const isClassExist = await classModel
        .findOne({ subject: newClass.subject, year: newClass.year, month: newClass.month , classType: newClass.classType });
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
    const classes = await classModel.find();
    res.status(200).json(classes);
  } catch (error) {
    next(new ErrorHandler("error in retreiving the classes", 500));
  }
});

// Get a single class by ID
export const getClassById = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classItem = await classModel.findById(req.query.id);
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
    const updatedClass = await classModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedClass) {
      res.status(200).json(updatedClass);
    } else {
      next(new ErrorHandler('Class not found', 404));
    }
  } catch (error) {
    next(new ErrorHandler("couldn't complete the request", 400));
  }
});

//get classes by subject
export const getClassesBySubject = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classes = await classModel.find({ subject: req.query.subject });
    if (classes.length === 0) {
      return next(new ErrorHandler('No classes found', 404));
    }
    res.status(200).json(classes);
    
  } catch (error) {
    next(new ErrorHandler("couldn't complete the request", 500));
  }
});

//get classes by year
export const getClassesByYear = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classes = await classModel.find({ year: req.query.year });
    if (classes.length === 0) {
      return next(new ErrorHandler('No classes found', 404));
    }
    res.status(200).json(classes);
  } catch (error) {
    next(new ErrorHandler("couldn't complete the request", 500));
  }
});



// Delete a class by ID
export const deleteClass = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedClass = await classModel.findByIdAndDelete(req.params.id);
    if (deletedClass) {
      res.status(204).json(deletedClass);
    } else {
      next(new ErrorHandler('Class not found', 404));
    }
  } catch (error) {
    next(new ErrorHandler("couldn't complete the request", 500));
  }
});
