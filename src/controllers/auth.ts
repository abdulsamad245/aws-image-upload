import { Request, Response } from 'express';
import passport from 'passport';
import { User, IUser } from '../models/User';

export const login = (req: Request, res: Response) => {
    res.send('Login Successful');
  };

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username }).exec();

    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    // Create a new user
    const newUser: IUser = new User({ username, password });

    await newUser.save();

    res.send('Registration Successful');
  } catch (error) {
    console.log();
    
    res.status(500).send('Internal Server Error');
  }
};

export const logout = (req: Request, res: Response) => {
    try {
      req.logout((err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.send('Logged out successfully');
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };
  

export const isLoggedIn = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('You must be logged in');
};
