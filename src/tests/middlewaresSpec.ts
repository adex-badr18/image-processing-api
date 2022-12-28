import { getFullImages, getThumbImages } from '../utilities/middlewares';

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

