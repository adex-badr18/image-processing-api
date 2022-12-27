import path from 'path';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import { imageCache } from './middlewares';

export const resizer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<unknown> => {
    const width = Number(req.query.width);
    const height = Number(req.query.height);
    const imagePath = req.params.imagePath;
    const imageName =
        path.parse(req.params.imageName).name || req.params.imageName;
    if (!imageName || !imagePath) {
        return res.status(404)
            .send('No image matched your search. Please try again.');
    }

    const imageExtension = path.parse(req.params.imageName).ext;
    const newImageName = `${imageName}-${width}-${height}${imageExtension}`;
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
        req.params.imageName = newImageName;
        req.params.imagePath = newImagePath;
        imageCache.set('resizedImage', [newImageName, newImagePath], 10000);
        next();
    } catch (error) {
        return res.send(`${error}`);
    }
};