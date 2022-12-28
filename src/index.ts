import express, { Express, Request, Response } from 'express';
import { resizer } from './utilities/sharp';
import path from 'path';
import {
  getFullImages,
  getFullImage,
  getThumbImage,
  logger
} from './utilities/middlewares';

export const app: Express = express();
const port = 3000;

app.get('/', async (req: Request, res, Response) => {
  res.send(`<h1>IMAGE PROCESSING API GUIDE</h1>
  <h3>URL to display request guide:</h3>
  <code>http://localhost:3000/</code>
  <h3>URL to display a list of image info:</h3>
  <code>http://localhost:3000/api</code>
  <h3>URL to resize the image into a thumbnail image:</h3>
  <code>http://localhost:3000/api/{imagename}/?width&height</code>
  e.g. <code>http://localhost:3000/api/fjord/?width=500&height=300</code>`);
});

app.get('/api', async (req: Request, res: Response) => {
  getFullImages().then((image) => {
    const imageArray: { image: string; imagePath: string }[] = image;
    res.send(imageArray);
  });
});

app.get(
  '/api/:imageName',
  [getFullImage, resizer, logger, getThumbImage],
  async (req: Request, res: Response) => {
    res.sendFile(req.params.imageName, { root: path.dirname(req.params.imagePath) });
  }
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
