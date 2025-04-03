import { FastifyInstance, FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { BaseError } from '../errors/BaseError';
import logger from '../utils/logger/logger';

export default function errorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler(
    (error: FastifyError | BaseError, request: FastifyRequest, reply: FastifyReply) => {
      // Determine log level: warn for client errors, error for server errors
      const logLevel = (error instanceof BaseError && error.statusCode < 500) ? 'warn' : 'error';

      logger[logLevel]({
        error: {
          message: error.message,
          stack: error.stack,
          ...(error instanceof BaseError && {
            code: error.errorCode,
            details: error.details,
            context: error.context,
          }),
        },
        request: {
          method: request.method,
          url: request.url,
          params: request.params,
          query: request.query,
        },
      }, 'Unhandled error caught by Fastify');

      // Handle schema validation errors if present
      const validation = (error as any).validation;
      if (validation) {
        let validationErrors: Array<{
          instancePath: string;
          schemaPath: string;
          keyword: string;
          params: any;
          message: string;
        }> = [];

        // Case 1: validation is an array of errors
        if (Array.isArray(validation) && validation.length > 0) {
          validationErrors = validation.map((err: any) => ({
            instancePath: err.instancePath || '',
            schemaPath: err.schemaPath || '',
            keyword: err.keyword || '',
            params: err.params || {},
            message: err.message || '',
          }));
        }
        // Case 2: validation is an object with an 'errors' array
        else if (validation.errors && Array.isArray(validation.errors)) {
          validationErrors = validation.errors.map((err: any) => ({
            instancePath: err.instancePath || '',
            schemaPath: err.schemaPath || '',
            keyword: err.keyword || '',
            params: err.params || {},
            message: err.message || '',
          }));
        }
        // Case 3: validation is a plain object – iterate its keys
        else if (typeof validation === 'object') {
          Object.entries(validation).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((err: any) => {
                const message = err.message || JSON.stringify(err);
                validationErrors.push({ instancePath: key, schemaPath: '', keyword: '', params: {}, message });
              });
            } else {
              validationErrors.push({ instancePath: key, schemaPath: '', keyword: '', params: {}, message: String(value) });
            }
          });
        }

        // Fallback: if no errors were mapped, return the whole validation object as a string
        if (validationErrors.length === 0) {
          validationErrors = [{ instancePath: '', schemaPath: '', keyword: '', params: {}, message: JSON.stringify(validation) }];
        }

        return reply.code(400).send({
          success: false,
          error: {
            message: error.message || 'Schema validation error',
            code: (error as any).code || 'SCHEMA_VALIDATION_ERROR',
            details: {
              validation: validationErrors,
              validationContext: (error as any).validationContext || 'body'
            },
            timestamp: new Date().toISOString(),
          },
        });
      }

      if (error instanceof BaseError) {
        reply.code(error.statusCode).send(error.toJSON());
      } else {
        reply.status(500).send({
          success: false,
          error: {
            message: 'Internal Server Error',
            code: 'INTERNAL_SERVER_ERROR',
            details: {},
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  );
}
