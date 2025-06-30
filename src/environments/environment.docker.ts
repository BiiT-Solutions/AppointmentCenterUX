export class Environment {
  public static readonly ROOT_URL: string = `DOCKER:PROTOCOL://DOCKER:MACHINE_DOMAIN`;
  public static readonly APPOINTMENT_CENTER_PATH: string = '/appointment-center-backend';
  public static readonly CONTEXT: string = 'DOCKER:CONTEXT';
  public static readonly USER_MANAGER_SERVER: string = 'DOCKER:USER_MANAGER_URL';
  public static readonly GOOGLE_API_CLIENT_ID: string = 'DOCKER:GOOGLE_API_CLIENT_ID';
  public static readonly GOOGLE_API_CLIENT_SECRET: string = 'DOCKER:GOOGLE_API_CLIENT_ID';
  public static readonly GOOGLE_API_STATE: string = 'DOCKER:GOOGLE_API_STATE';
  public static readonly GOOGLE_API_REDIRECT: string = 'DOCKER:GOOGLE_API_REDIRECT';
  public static readonly GOOGLE_API_SCOPES: string[] = ['https://www.googleapis.com/auth/calendar'];
  public static readonly MS_API_CLIENT_ID: string = 'DOCKER:MS_API_CLIENT_ID';
  public static readonly MS_API_REDIRECT: string = 'DOCKER:MS_API_REDIRECT';
  public static readonly MS_API_SCOPES: string[] = ['User.Read', 'Calendars.ReadWrite', 'offline_access'];
  //public static readonly MS_API_SCOPES: string[] = [/*DOCKER:MS_API_SCOPES*/];
}
