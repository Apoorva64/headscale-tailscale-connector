import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { OAuth, PostOAuthResponseSchema, PostOAuthSchema } from '@/api/oauth/oauthModel';
import { OAuthRepository } from '@/api/oauth/oauthRepository';
import { userRepository } from '@/api/user/userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
export const oauthService = {
  // Retrieves all the tokens in the database
  findAll: async (): Promise<ServiceResponse<OAuth[] | null>> => {
    try {
      const oAuths = await OAuthRepository.findAllAsync();
      if (!oAuths) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Tokens found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<OAuth[]>(ResponseStatus.Success, 'Users found', oAuths, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves tokens user by their user id
  findById: async (id: string): Promise<ServiceResponse<OAuth[] | null>> => {
    try {
      const oAuths = await OAuthRepository.findByIdAsync(id);
      if (!oAuths) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Tokens found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<OAuth[]>(ResponseStatus.Success, 'oAuths found', oAuths, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding oAuths by Id: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  create: async (oAuth: PostOAuthSchema['body']): Promise<ServiceResponse<PostOAuthResponseSchema | null>> => {
    try {
      const user = await userRepository.findByIdAsync(oAuth.client_id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      if (user.secret !== oAuth.client_secret) {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid secret', null, StatusCodes.UNAUTHORIZED);
      }

      const token = uuidv4();
      const oAuthC: OAuth = {
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        tokenType: 'Bearer',
        expiresIn: 3600,
        scope: 'devices',
        accessToken: 'tskey-' + token,
      };

      const newOAuth = await OAuthRepository.createAsync(oAuthC);

      const res = {
        access_token: newOAuth.accessToken,
        token_type: newOAuth.tokenType,
        expires_in: newOAuth.expiresIn,
        scope: newOAuth.scope,
      };

      return new ServiceResponse<PostOAuthResponseSchema>(
        ResponseStatus.Success,
        'Token created',
        res,
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = `Error creating token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
