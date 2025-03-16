import { Type } from '@sinclair/typebox';

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
    401: Type.Object({
      success: Type.Literal(false),
      message: Type.String()
    })
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
    400: Type.Object({
      success: Type.Literal(false),
      message: Type.String()
    }),
    401: Type.Object({
      success: Type.Literal(false),
      message: Type.String()
    })
  }
};