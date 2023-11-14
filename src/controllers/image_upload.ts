import { Request, Response } from 'express';
import crypto from 'crypto'
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { bucketName, s3Client } from '../config/aws_s3';
import sharp from 'sharp';
import { Mongoose, Document, Schema } from 'mongoose';
import { promisify } from 'util';
import { ImageModel } from '../models/ImageUpload';

const unlinkFile = promisify(require('fs').unlink);

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// Assuming you have a Mongoose model for posts
// interface Post extends Document {
//   imageName: string;
//   caption: string;
//   created: Date;
// }

// const ImageModel = Mongoose.model<Post>('Post', new Schema({
//   imageName: String,
//   caption: String,
//   created: { type: Date, default: Date.now },
// }));

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const caption = req.body.caption;

    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer();

    const fileName = generateFileName();
    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const post = await ImageModel.create({
      imageName: fileName,
      caption,
    });

    res.send(post);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const posts = await ImageModel.find().sort({ created: 'desc' });

    for (let post of posts) {
      post.imageUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: bucketName,
          Key: post.imageName,
        }),
        { expiresIn: 60 },
      );
    }

    res.send(posts);
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const post = await ImageModel.findById(id);

    if (!post) {
      return res.status(404).send('Post not found');
    }

    const deleteParams = {
      Bucket: bucketName,
      Key: post.imageName,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
    await ImageModel.deleteOne({ _id: id });
    res.send(post);
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).send('Internal Server Error');
  }
};



