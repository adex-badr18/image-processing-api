import express, { Express, Request, Response } from 'express';
import { resizer } from './utilities/sharp';
import {
  getFullImages,
  getFullImage,
  getThumbImage,
  logger
} from './utilities/middlewares';

export const app: Express = express();
const port = 3000;

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
    res.sendFile(req.params.imageName, { root: './images/thumb' });
  }
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
