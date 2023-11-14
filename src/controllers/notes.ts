import { Request, Response } from 'express';
import { Note, INote } from '../models/Note';

export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId; // Get user ID from the request body

    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    const notes = await Note.find({ user: userId }).exec();
    res.json(notes);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, userId } = req.body;

    // Check if userId is present
    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    // Create a new note instance
    const newNote: INote = new Note({
      title,
      content,
      user: userId,
    });

    // Save the new note to the database
    const savedNote = await newNote.save();

    // Respond with the created note
    res.json(savedNote);
  } catch (error) {
    // Handle any errors during the process
    res.status(500).send('Internal Server Error');
  }
};


export const deleteNote = async (req: Request, res: Response) => {
  try {
    const noteId = req.params.id;
    const userId = req.body.userId; // Get user ID from the request body

    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    const deletedNote = await Note.findOneAndDelete({
      _id: noteId,
      user: userId,
    }).exec();

    if (!deletedNote) {
      return res.status(404).send('Note not found');
    }

    res.send('Note deleted successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const noteId = req.params.id;
    const { title, content, userId } = req.body; // Get user ID from the request body

    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: userId },
      { title, content },
      { new: true }
    ).exec();

    if (!updatedNote) {
      return res.status(404).send('Note not found');
    }

    res.json(updatedNote);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const noteId = req.params.id;
    const userId = req.body.userId; // Get user ID from the request body

    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    const note = await Note.findOne({ _id: noteId, user: userId }).exec();

    if (!note) {
      return res.status(404).send('Note not found');
    }

    res.json(note);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
