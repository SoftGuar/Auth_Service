import { Type } from '@sinclair/typebox';
import { CommonErrorResponses } from '../baseSchema';

export const loginSchema = {
  body: Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String(),
    role: Type.String()
  }),
  response: {
    200: Type.Object({
      success: Type.Literal(true),
      data: Type.Object({
        token: Type.String()
      })
    }),
    ...CommonErrorResponses,
  }
};

export const verifyTokenSchema = {
  headers: Type.Object({
    authorization: Type.Optional(Type.String())
  }, { additionalProperties: false }),
  response: {
    200: Type.Object({
      success: Type.Literal(true),
      data: Type.Object({
        userId: Type.String(),
        role: Type.String()
      })
    }),
    ...CommonErrorResponses,
  }
};