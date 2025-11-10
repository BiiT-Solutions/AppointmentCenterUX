export class Environment {
  public static readonly ROOT_URL: string = 'https://testing.server.com';
  public static readonly CONTEXT: string = '';
  public static readonly APPOINTMENT_CENTER_PATH: string = '/appointment-center-backend';
  public static readonly USER_MANAGER_SERVER: string = 'https://testing.server.com/user-manager-system-backend';
  public static readonly GOOGLE_API_CLIENT_ID: string = 'google-api-password';
  public static readonly GOOGLE_API_CLIENT_SECRET: string = 'google-api-secret';
  public static readonly GOOGLE_API_SCOPES: string[] = ['https://www.googleapis.com/auth/calendar'];
  public static readonly GOOGLE_API_REDIRECT: string = 'http://localhost:4200/google';
  public static readonly MS_API_CLIENT_ID: string = 'microsoft-password';
  public static readonly MS_API_REDIRECT: string = 'http://localhost:4200/microsoft';
  public static readonly MS_API_SCOPES: string[] = ['User.Read', 'Calendars.ReadWrite', 'offline_access'];
}
