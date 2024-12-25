export interface AppError extends Error {
  code?: string;
  field?: string;
  details?: Record<string, any>;
}

export class ValidationError extends Error implements AppError {
  code: string;
  field?: string;
  details?: Record<string, any>;

  constructor(message: string, field?: string, details?: Record<string, any>) {
    super(message);
    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
    this.field = field;
    this.details = details;
  }
}

export class FileUploadError extends Error implements AppError {
  code: string;
  details?: Record<string, any>;

  constructor(message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'FileUploadError';
    this.code = 'UPLOAD_ERROR';
    this.details = details;
  }
}

export class FormSubmissionError extends Error implements AppError {
  code: string;
  field?: string;
  details?: Record<string, any>;

  constructor(message: string, field?: string, details?: Record<string, any>) {
    super(message);
    this.name = 'FormSubmissionError';
    this.code = 'FORM_ERROR';
    this.field = field;
    this.details = details;
  }
}