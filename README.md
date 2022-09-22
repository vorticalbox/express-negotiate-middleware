express-negotiate-middleware
====

This middleware allows client to negotiate responses based on the `accept` or `content-type` headers allowing a single route to return multi-formats of data.


### Features

- clients to accept multiple responses `application/xhtml+xml;q=0.9,*/*;q=0.7,application/xml;q=0.8,text/html;q=1`
- client to state which response they perfer with `relative quality factor`
- default handlers for fallback responses

## Project Status
[![npm (tag)](https://img.shields.io/npm/v/express-negotiate-middleware/latest)](https://www.npmjs.com/package/express-negotiate-middleware)

## Installation

### Requirements
- Node Version: 16+ (may work on older versions but not tested)
- Dependencies are listed in [package.json](package.json)

Install dependencies

```bash
npm install
```

## Linting

Run the Static analiser:
```bash
npm run lint
```

Correct issues which can be automatically fixed:
```bash
npm run lint:fix
```

## Testing

Full test suite:
```bash
npm test
```

## Examples


### Basic Example

In this example the server will have the abilty to return both html and JSON. The client will able to negation which gets returned.

#### Server

```typescript
import express, { Request, Response } from 'express';
import { negotiate } from 'express-negotiate-middleware';

const jsonHandler = (_request: Request, response: Response): void => {
  response.json({ message: 'hello world' });
};

const htmlHandler = (_request: Request, response: Response): void => {
  response.send('<h1>hello world</h1>');
};

const application = express();

application.get('/', negotiate({ 'application/json': jsonHandler, 'text/html': htmlHandler }));

application.listen(8080);
```

#### Client

```typescript

// ask the server for json
const jsonData = await fetch('http://localhost:8080/', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
});
// ask the server for html
const htmlData = await fetch('http://localhost:8080/', {
    headers: {
      'Accept': 'text/html',
      'Content-Type': 'text/html'
    },
});

// prefer json by using q parameter
// q is usally between 0-1 higher numbers mean return this type first

const jsonData = await fetch('http://localhost:8080/', {
    headers: {
      'Accept': 'application/json;q=1,text/html',
    },
});

```

### Default handlers
You can set a default handler that all requests fall into should a negatiation fails

```typescript
application.get('/', negotiate({ 
    'application/json': jsonHandler, 
    'text/html': htmlHandler, 
    // if negation fails return json
    default: jsonHanlder 
}));

```

If there is no default handler then failed negatiations will throw `NotAcceptable` error


### Handling errors

Creating a error handling middleware allows for all errors to be passed to `next(error)` and be handled in a single location

```typescript
import express, { Request, Response } from 'express';
import { negotiate, NotAcceptable } from 'express-negotiate-middleware';

const jsonHandler = (_request: Request, response: Response): void => {
  response.json({ message: 'hello world' });
};

const htmlHandler = (_request: Request, response: Response): void => {
  response.send('<h1>hello world</h1>');
};

const application = express();

application.get('/', negotiate({ 'application/json': jsonHandler, 'text/html': htmlHandler }));

application.use((error: unknown, _request: Request, response: Response) => {
    if (error instanceof NotAcceptable) {
        response.status(error.statusCode).json({ error: error.message });
    } else {
        response.status(500).json(error);
    }
});

application.listen(8080);
```
