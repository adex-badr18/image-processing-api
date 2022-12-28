import probe, { ProbeResult } from 'probe-image-size';
import fs from 'node:fs';
import app from '../index';
import supertest, { SuperTest } from 'supertest';
import fetch from 'node-fetch';

const request: SuperTest<supertest.Test> = supertest(app);

describe('Test suite for image transform', () => {
  it('Resized image is successfully stored with appropriate dimensions', async () => {
    const imageInfo: ProbeResult = await probe(
      fs.createReadStream('images/thumb/palmtunnel-300-250.jpg')
    );
    expect(imageInfo.height).toEqual(250);
    expect(imageInfo.width).toEqual(300);
  });

  it('Checks if the transformed image is stored successfully', async () => {
    const response = await request.get('/api/fjord');
    expect(response.status).toBe(200);
  });

  it('Checks if the transformed image is generated successfully', async () => {
    const image: string = 'fjord-300-300.jpg';
    if (fs.existsSync(`images/thumb/${image}`)) {
      fs.unlinkSync(`images/thumb/${image}`);
    }
    app.listen(5000, () => {
      console.log(`Listening on port 5000`);
    });
    const response = await fetch(
      'http://127.0.0.1:5000/api/fjord/?width=300&height=300'
    );
    expect(response.status).toBe(200);
    expect(fs.existsSync(`images/thumb/${image}`)).toBeTruthy();
  });
});
