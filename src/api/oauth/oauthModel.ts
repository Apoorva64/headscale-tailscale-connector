import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type OAuth = z.infer<typeof OAuthSchema>;
export const OAuthSchema = z.object({
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tokenType: z.string(),
  expiresIn: z.number(),
  scope: z.string(),
  accessToken: z.string(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetOAuthSchema = z.object({
  params: z.object({ userId: commonValidations.id }),
});
export type PostOAuthSchema = z.infer<typeof PostOAuthSchema>;
export const PostOAuthSchema = z.object({
  body: z.object({
    client_id: z.string(),
    client_secret: z.string(),
  }),
});

export type PostOAuthResponseSchema = z.infer<typeof PostOAuthSchemaResponseSchema>;
export const PostOAuthSchemaResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  scope: z.string(),
});
