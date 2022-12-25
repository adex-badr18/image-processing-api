import { getFullImages, getThumbImages } from '../utilities/middlewares';
import probe from 'probe-image-size';
import fs from 'node:fs';

describe('Test suite for image retrievals', () => {
  it('Returned an array of object that contains thumb images', async () => {
    const thumbImagesArray = await getThumbImages();
    expect(thumbImagesArray).toBeTruthy();
  });
  it('Returned an array of object that contains full-sized images', async () => {
    const fullImagesArray = await getFullImages();
    expect(fullImagesArray).toBeTruthy();
  });
});

describe('Test suite for image transform', () => {
  it('Checked the width and height of resized image', async () => {
    const imageInfo = await probe(
      fs.createReadStream('images/thumb/fjord-thumb.jpg')
    );
    expect(imageInfo.height).toEqual(200);
    expect(imageInfo.width).toEqual(200);
  });
});
