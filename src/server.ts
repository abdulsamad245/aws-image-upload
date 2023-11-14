import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import notesRouter from './routes/notes';
import imageRouter from './routes/image_upload';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3000;
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes_db';
const sessionSecret = process.env.SESSION_SECRET || "3F8cX5aZp7QsR9wY3F8cX5aZp7QsR9wY";

app.use(express.json());
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

mongoose
    .connect(dbUrl, { retryWrites: true, w: 'majority' })
    .then(() => {
        console.info('Mongo connected successfully.');
        // StartServer();
    })
    .catch((error:any) => console.error(error));
  

app.use('/auth', authRouter);
app.use('/notes', notesRouter);
app.use('/image', imageRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
