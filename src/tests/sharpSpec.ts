import probe from 'probe-image-size';
import fs from 'node:fs';
import app from '../index';
import supertest from 'supertest';

const request = supertest(app);

describe('Test suite for image transform', () => {
  it('Checked the width and height of resized image', async () => {
    const imageInfo = await probe(
      fs.createReadStream('images/thumb/fjord-thumb.jpg')
    );
    expect(imageInfo.height).toEqual(200);
    expect(imageInfo.width).toEqual(200);
  });

  it('Checks if the transformed image is stored successfully', async () => {
    const response = await request.get('/api/fjord.jpg');
    expect(response.status).toBe(200);
  });
});
