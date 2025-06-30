export class CredentialData {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expirationTimeMilliseconds: number;
  refreshTokenExpirationTimeMilliseconds: number;
  createdAt: Date = new Date();
}
