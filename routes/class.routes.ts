import express from 'express';
import { createClass,updateClassBySubjectYearTypeMonth, getClassBySubjectYearTypeMonth, getClasses, updateClass, getClassesByYear,getClassesBySubject, deleteClass } from '../controllers/class.controllers';

const classRouter = express.Router();

classRouter.post('/create-class', createClass);
classRouter.get('/all-classes', getClasses);
classRouter.put('/update', updateClassBySubjectYearTypeMonth);
classRouter.get('/classes-by-year', getClassesByYear);
classRouter.get('/classes-by-subject', getClassesBySubject);
classRouter.delete('/delete-class', deleteClass);
classRouter.get('/class-by-subject-year-type-month', getClassBySubjectYearTypeMonth);



export default classRouter;