import path from 'path';
import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

export const imageCache: NodeCache = new NodeCache();

interface Image {
    image: string;
    imagePath: string;
}

export const getFullImages = async (): Promise<Image[]> => {
    const dirPath: string = 'images/full';
    const imageArray: Image[] = [];

    await fs.promises
        .readdir(dirPath)
        .then((names) => {
            names.forEach((image) => {
                const imagePath: string = path.join(dirPath, image);
                imageArray.push({ image, imagePath });
            });
        })
        .catch((err) => console.log(err));
    return imageArray;
};

export const getThumbImages = async (): Promise<Image[]> => {
    const dirPath: string = 'images/thumb';
    const imageArray: Image[] = [];

    await fs.promises
        .readdir(dirPath)
        .then((names) => {
            names.forEach((image) => {
                const imagePath: string = path.join(dirPath, image);
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
): Promise<void> => {
    const imageName: string = req.params.imageName;
    const resizedImageName: string = `${imageName}-${req.query.width}-${req.query.height}`
    let fullImageArray: { image: string, imagePath: string }[] = imageCache.get('fullImageArray')!;
    let resizedImage: string[] = imageCache.get('resizedImage')! || ['', ''];
    let cached: boolean = false;

    if (path.parse(resizedImage[0]).name === resizedImageName) {
        cached = true;
        res.sendFile(resizedImage[0], { root: path.dirname(resizedImage[1]) });
    }

    // If image array is not in cache, get the array from getFullImages() & get the image 
    // info that matches with the image name specified in the request parameter.
    if (!fullImageArray) {
        await getFullImages().then((image) => {
            fullImageArray = image;
            fullImageArray.forEach((imageInfo) => {
                if (path.parse(imageInfo.image).name === imageName) {
                    req.params.imagePath = imageInfo.imagePath;
                    req.params.imageName = imageInfo.image;
                }
            });
            imageCache.set('fullImageArray', image, 10000);
        });
    }
    // Get image info from imageArray stored in the cache.
    fullImageArray.forEach((imageInfo) => {
        if (path.parse(imageInfo.image).name === imageName) {
            req.params.imagePath = imageInfo.imagePath;
            req.params.imageName = imageInfo.image;
        }
    });
    if (cached === false) {
        next();
    }
};

export const getThumbImage = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const imageName: string = req.params.imageName;
    const imagePath: string = req.params.imagePath;
    let thumbImageArray: { image: string, imagePath: string }[] = imageCache.get('thumbImageArray')!;
    if (!thumbImageArray) {
        await getThumbImages().then((image) => {
            thumbImageArray = image;
            thumbImageArray.forEach((imageInfo) => {
                if (path.parse(imageInfo.image).name === imageName) {
                    req.params.imagePath = imagePath;
                    req.params.imageName = imageName;
                }
            });
            imageCache.set('thumbImageArray', image, 10000);
        });
    }
    thumbImageArray.forEach((imageInfo) => {
        if (path.parse(imageInfo.image).name === imageName) {
            req.params.imagePath = imagePath;
            req.params.imageName = imageName;
        }
    });
    next();
};

export const logger = (req: Request, res: Response, next: NextFunction): void => {
    console.log('Image resize successful.');
    next();
};
