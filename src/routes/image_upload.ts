import express from 'express';
import { isLoggedIn } from '../controllers/auth';
import { uploadImage } from '../controllers/image_upload';
import { deleteImage } from '../controllers/image_upload';
import { getImage } from '../controllers/image_upload';
import multer from 'multer';


const imageRouter = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

imageRouter.use(isLoggedIn);
imageRouter.post('/posts', upload.single('image'), uploadImage);
imageRouter.get('/', getImage);
imageRouter.post('/posts/:id', deleteImage);

export default imageRouter;


