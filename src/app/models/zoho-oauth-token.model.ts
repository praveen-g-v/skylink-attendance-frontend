// zoho-oauth-token.model.ts

export interface ZohoOAuthToken {
  id: number; // always 1 (as per backend design)
  accessToken: string;
  refreshToken: string;
  expiresAt: string | Date;
  createdAt: string | Date;
  clientId: string;
  clientSecret: string;
}
