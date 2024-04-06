import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { GetOAuthSchema, OAuthSchema, PostOAuthSchema, PostOAuthSchemaResponseSchema } from '@/api/oauth/oauthModel';
import { oauthService } from '@/api/oauth/oauthService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const oAuthRegistry = new OpenAPIRegistry();

oAuthRegistry.register('OAuth', OAuthSchema);

export const oauthRouter: Router = (() => {
  const router = express.Router();

  oAuthRegistry.registerPath({
    method: 'get',
    path: '/oauth',
    tags: ['OAuth'],
    responses: createApiResponse(z.array(OAuthSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await oauthService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  oAuthRegistry.registerPath({
    method: 'get',
    path: '/oauth/{userId}',
    tags: ['OAuth'],
    request: { params: GetOAuthSchema.shape.params },
    responses: createApiResponse(z.array(OAuthSchema), 'Success'),
  });

  router.get('/:userId', validateRequest(GetOAuthSchema), async (req: Request, res: Response) => {
    const serviceResponse = await oauthService.findById(req.params.userId);
    handleServiceResponse(serviceResponse, res);
  });

  oAuthRegistry.registerPath({
    method: 'post',
    path: '/oauth/token',
    tags: ['OAuth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: PostOAuthSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(PostOAuthSchemaResponseSchema, 'Success'),
  });

  router.post('/token', validateRequest(PostOAuthSchema), async (req: Request, res: Response) => {
    const serviceResponse = await oauthService.create(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
