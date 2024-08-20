import express from 'express';
import { createClass, getClasses, getClassById, updateClass, getClassesByYear,getClassesBySubject, deleteClass } from '../controllers/class.controllers';

const classRouter = express.Router();

classRouter.post('/create-class', createClass);
classRouter.get('/get-classes', getClasses);
classRouter.get('/get-class/:id', getClassById);
classRouter.put('/update-class/:id', updateClass);
classRouter.get('/get-classes-by-year/:year', getClassesByYear);
classRouter.get('/get-classes-by-subject/:subject', getClassesBySubject);
classRouter.delete('/delete-class/:id', deleteClass);



export default classRouter;