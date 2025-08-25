import express from 'express';
import { uploadFile, getDownloadLink } from '../controllers/fileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import fileUpload from 'express-fileupload';


const router = express.Router();
router.use(fileUpload({ useTempFiles: true }));


router.post('/upload', authMiddleware, uploadFile);
router.get('/download/:id', getDownloadLink);


export default router;