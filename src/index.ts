import { Request, Response, NextFunction } from 'express';
import helpers from './helpers';

export type Handler = (request: Request, response: Response, next: NextFunction) => unknown | Promise<unknown>
export type Handlers = Record<string, Handler | undefined>

export class NotAcceptable extends Error {
  readonly statusCode!: number;

  readonly name!: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 406;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * This function takes the handers and acceptString and returns a handler for this request
 * If handlers has a `default` handler then on the event of not matching this is returned
 *
 * @param {Handlers} handlers object of passed handlers
 * @param {string} acceptString headers['accept'] or headers['content-type']
 * @returns {Handler | undefined} handler for this request based on accept string
 */
function findHandlers(handlers: Handlers, acceptString?: string): Handler | undefined {
  let handler = handlers.default;
  if (!acceptString) {
    return handler;
  }
  const accepts = helpers.parseAccept(acceptString);
  for (const accept of accepts) {
    if (accept in handlers) {
      handler = handlers[accept];
      break;
    }
  }
  return handler;
}

/**
 * This function takes an object of handlers and returns express middleware.
 *
 * @param {Handlers} handlers object the maps accept/content-type tp a handler
 * @returns {Handler} express middleware to map accept/content-type to handlers
 */
export function negotiate(handlers: Handlers): Handler {
  return function middleware(request: Request, response: Response, next: NextFunction): void {
    const acceptString = request.headers.accept || request.headers['content-type'];
    const handler = findHandlers(handlers, acceptString);
    if (!handler) {
      const error = new NotAcceptable(`${acceptString} is not accepted`);
      next(error);
    } else {
      handler(request, response, next);
    }
  };
}
