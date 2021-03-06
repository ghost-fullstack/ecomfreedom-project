const HttpStatus = require('http-status-codes');
const request = require('supertest');
const config = require('../../server/core/config');
const app = require('../../server/web-server');
const db = require('../../server/db/test');

const path = `${config.get('base-path')}/permission`;

describe('permissions apis', () => {
  beforeAll(db.beforeAll);
  afterAll(db.afterAll);

  let id;
  let name;
  let description;

  beforeEach(async () => {
    await db.model.Permission.deleteMany({});

    const res = await request(app)
      .post(path)
      .send({
        name: 'read-write',
        description: 'read write permission'
      });

    id = res.body.id;
    name = res.body.name;
    description = res.body.description;

    expect(res.status).toBe(HttpStatus.OK);
    expect(id).toMatch('read-write');
    expect(name).toBe('read-write');
    expect(description).toBe('read write permission');
  });

  test('should create and read a permission', async () => {
    let res = await request(app)
      .get(`${path}/${id}`)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toEqual({ id, name, description });

    res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.total).toBe(1);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]).toEqual({ id, name, description });
  });

  test('should create and read a permission without pagination', async () => {
    let res = await request(app)
      .get(`${path}/${id}`)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toEqual({ id, name, description });

    res = await request(app).get(path);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.total).toBe(1);
    expect(res.body.data.length).toBe(1);
  });

  test('should create and read by name a permission', async () => {
    const res = await request(app)
      .get(`${path}/read-write`)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toEqual({ id, name, description });
  });

  test('should fail to read when wrong id', async () => {
    const res = await request(app)
      .get(`${path}/WRONG!`)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  test('should update the permission by id', async () => {
    let res = await request(app)
      .post(path)
      .send({ id, name: 'read-write-changed', description: 'read write changed permission' });
    expect(res.status).toBe(HttpStatus.OK);

    res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.total).toBe(2);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[1]).toEqual({
      id: 'read-write-changed',
      name: 'read-write-changed',
      description: 'read write changed permission'
    });
  });

  test('should delete the permission by id', async () => {
    let res = await request(app).delete(`${path}/${id}`);
    expect(res.status).toBe(HttpStatus.OK);

    res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.total).toBe(0);
  });

  test('should delete the permission by name', async () => {
    let res = await request(app).delete(`${path}/read-write`);
    expect(res.status).toBe(HttpStatus.OK);

    res = await request(app)
      .get(path)
      .query({ pageNumber: 0, pageSize: 10 });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.total).toBe(0);
  });

  test('should fail on wrong id', async () => {
    const res = await request(app)
      .post(path)
      .send({
        id: 12345,
        name: 'read-write-updated',
        description: 'updated'
      });

    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  test('should fail on creation with same name', async () => {
    const res = await request(app)
      .post(path)
      .send({
        name: 'read-write',
        description: 'read write permission'
      });

    expect(res.status).toBe(HttpStatus.CONFLICT);
  });

  test('should delete permission by name', async () => {
    const res = await request(app).delete(`${path}/read-write`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toEqual({ deleted: 1 });
  });

  test('should delete permission by id', async () => {
    const res = await request(app).delete(`${path}/${id}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toEqual({ deleted: 1 });
  });

  test('should fail delete when wrong param', async () => {
    const res = await request(app).delete(`${path}/WRONG!`);
    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
});
