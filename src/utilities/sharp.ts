import * as fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';

export const resizer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const width = Number(req.query.width);
    const height = Number(req.query.height);
    const imagePath = req.params.imagePath;
    const imageName =
        path.parse(req.params.imageName).name || req.params.imageName;
    if (!imageName || !imagePath) {
        return res
            .status(404)
            .send('No image matched your search. Please try again.');
    }

    const imageExtension = path.parse(req.params.imageName).ext;
    const newImageName = `${imageName}-thumb${imageExtension}`;
    const newImagePath = `images/thumb/${newImageName}`;
    try {
        if (!width || !height) {
            return res.send('Resize parameters not specified, please try again.');
        }
        await sharp(imagePath)
            .resize({
                width: width,
                height: height
            })
            .toFile(newImagePath);
        req.params.newImageName = newImageName;
        req.params.newImagePath = newImagePath;
        next();
    } catch (error) {
        return res.send(`${error}`);
    }
};