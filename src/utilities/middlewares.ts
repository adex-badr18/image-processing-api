import path from 'path';
import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import NodeCache from 'node-cache';

const imageCache = new NodeCache();

interface Image {
    image: string;
    imagePath: string;
}

export const getFullImages = async () => {
    const dirPath = 'images/full';
    interface Image {
        image: string;
        imagePath: string;
    }
    const imageArray: Image[] = [];

    await fs.promises
        .readdir(dirPath)
        .then((names) => {
            names.forEach((image) => {
                const imagePath = path.join(dirPath, image);
                imageArray.push({ image, imagePath });
            });
        })
        .catch((err) => console.log(err));
    return imageArray;
};

export const getThumbImages = async () => {
    const dirPath = 'images/thumb';
    const imageArray: Image[] = [];

    await fs.promises
        .readdir(dirPath)
        .then((names) => {
            names.forEach((image) => {
                const imagePath = path.join(dirPath, image);
                imageArray.push({ image, imagePath });
            });
        })
        .catch((err) => console.log(err));
    return imageArray;
};

export const getFullImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const imageName = req.params.imageName;
    let fullImageArray: { image: string, imagePath: string }[] = imageCache.get('fullImageArray')!;
    if (!fullImageArray) {
        await getFullImages().then((image) => {
            fullImageArray = image;
            fullImageArray.forEach((imageInfo) => {
                if (imageInfo.image.includes(imageName)) {
                    req.params.imagePath = imageInfo.imagePath;
                    req.params.imageName = imageInfo.image;
                }
            });
            imageCache.set('fullImageArray', image, 10000);
        });
    }
    fullImageArray.forEach((imageInfo) => {
        if (imageInfo.image.includes(imageName)) {
            req.params.imagePath = imageInfo.imagePath;
            req.params.imageName = imageInfo.image;
        }
    });
    next();
};

export const getThumbImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const imageName = req.params.newImageName;
    let thumbImageArray: { image: string, imagePath: string }[] = imageCache.get('thumbImageArray')!;
    if (!thumbImageArray) {
        await getThumbImages().then((image) => {
            thumbImageArray = image;
            thumbImageArray.forEach((imageInfo) => {
                if (imageInfo.image.includes(imageName)) {
                    req.params.imagePath = imageInfo.imagePath;
                    req.params.imageName = imageInfo.image;
                }
            });
            imageCache.set('thumbImageArray', image, 10000);
        });
    }
    thumbImageArray.forEach((imageInfo) => {
        if (imageInfo.image.includes(imageName)) {
            req.params.imagePath = imageInfo.imagePath;
            req.params.imageName = imageInfo.image;
        }
    });
    next();
};

export const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log('Image resize successful.');
    next();
};
