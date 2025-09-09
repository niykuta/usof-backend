export class BaseError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

export class ValidationError extends BaseError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

export class AuthError extends BaseError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Not found') {
    super(message, 404);
  }
}

export class ConflictError extends BaseError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

export class ServerError extends BaseError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}
