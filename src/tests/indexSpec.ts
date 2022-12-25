import app from '../index';
import supertest from 'supertest';

const request = supertest(app);

describe('Test endpoint responses', () => {
  it('Called the /api endpoint to display information of all images in directory.', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
  });

  it('Called /api/:imageName the transforms the specified image.', async () => {
    const response = await request.get('/api/fjord.jpg');
    expect(response.status).toBe(200);
  });
});
