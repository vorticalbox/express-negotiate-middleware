import express, { Request, Response } from 'express';
import supertest from 'supertest';
import { negotiate, NotAcceptable } from '../index';

const jsonResponse = { message: 'using default' };
const htmlResponse = '<h1>hello world</h1>';
const jsonHandler = (_request: Request, response: Response): void => {
  response.json(jsonResponse);
};

const htmlHandler = (_request: Request, response: Response): void => {
  response.send(htmlResponse);
};

const greetingHandler = (request: Request, response: Response): void => {
  const { name } = request.params;
  response.json({ greeting: `hello ${name}` });
};

const queryHandler = (request: Request, response: Response): void => {
  response.json(request.query);
};
describe('Negotiate accept/content-type', () => {
  it('Should use default', async () => {
    const application = express();
    application.get('/', negotiate({ default: jsonHandler }));
    const { body } = await supertest(application).get('/');
    expect(body).toEqual(jsonResponse);
  });
  it('Should return based on accept', async () => {
    const application = express();
    application.get('/', negotiate({ 'application/json': jsonHandler, 'text/html': htmlHandler }));
    const { text } = await supertest(application).get('/').accept('text/html').expect(200);
    expect(text).toEqual(htmlResponse);
    const { body } = await supertest(application).get('/').accept('application/json');
    expect(body).toEqual(jsonResponse);
  });
  it('Not acceptable', async () => {
    const application = express();
    application.get('/', negotiate({ 'application/json': jsonHandler }));
    application.use((error: Error | NotAcceptable, _request: Request, response: Response) => {
      if (error instanceof NotAcceptable) {
        response.status(error.statusCode).json({ error: error.message });
      } else {
        response.status(500).json(error);
      }
    });
    const { text } = await supertest(application).get('/').accept('text/html').expect(406);
    expect(text).toContain('text/html is not accepted');
  });
  it('Should handle content-type', async () => {
    const application = express();
    application.get('/', negotiate({ 'application/json': jsonHandler }));
    const { body } = await supertest(application).get('/').set({ 'content-type': 'application/json' });
    expect(body).toEqual(jsonResponse);
  });
});

describe('Negotiate versioning', () => {
  it('should respond based on version', async () => {
    const application = express();
    application.get('/', negotiate({
      'application/vnd.example.v2+json': jsonHandler,
      'text/vnd.example.v1+html': htmlHandler,
    }));
    const { text } = await supertest(application).get('/').accept('text/vnd.example.v1+html').expect(200);
    expect(text).toEqual(htmlResponse);
    const { body } = await supertest(application).get('/').accept('application/vnd.example.v2+json');
    expect(body).toEqual(jsonResponse);
  });
});

describe('Express features', () => {
  it('express parameters', async () => {
    const application = express();
    application.get('/:name', negotiate({
      default: greetingHandler,
    }));
    const { body } = await supertest(application).get('/vorticalbox');
    expect(body).toEqual({ greeting: 'hello vorticalbox' });
  });
  it('express query', async () => {
    const application = express();
    application.get('/', negotiate({
      default: queryHandler,
    }));
    const { body } = await supertest(application).get('/').query({ name: 'vorticalbox' });
    expect(body).toEqual({ name: 'vorticalbox' });
  });
});
