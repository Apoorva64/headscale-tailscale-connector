import { OAuth } from '@/api/oauth/oauthModel';

export const oAuths: OAuth[] = [
  {
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    tokenType: 'Bearer',
    expiresIn: 3600,
    scope: 'devices',
    accessToken: 'access_token',
  },
  {
    userId: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    tokenType: 'Bearer',
    expiresIn: 3600,
    scope: 'devices',
    accessToken: 'access_token',
  },
];

export const OAuthRepository = {
  findAllAsync: async (): Promise<OAuth[]> => {
    return oAuths;
  },

  findByIdAsync: async (id: string): Promise<OAuth[] | null> => {
    return oAuths.filter((oAuth) => oAuth.userId === id);
  },

  createAsync: async (oAuth: OAuth): Promise<OAuth> => {
    oAuths.push(oAuth);
    return oAuth;
  },
};
