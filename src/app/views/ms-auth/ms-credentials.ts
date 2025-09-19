export class MsCredentials {
  access_token: string;
  expires_in: number;
  ext_expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  origin: string;

  public static copy(from: MsCredentials, to: MsCredentials): void {
    to.access_token = from.access_token;
    to.expires_in = from.expires_in;
    to.ext_expires_in = from.ext_expires_in;
    to.refresh_token = from.refresh_token;
    to.scope = from.scope;
    to.token_type = from.token_type;
    to.origin = from.origin;
  }
  public static clone(from: MsCredentials): MsCredentials {
    const to: MsCredentials = new MsCredentials();
    MsCredentials.copy(from, to);
    return to;
  }
}
