export class Constants {

  public static readonly APP = class {
    public static readonly APP_PERMISSION_NAME: string = 'APPOINTMENTCENTER';
  }
  public static readonly PATHS = class {
    public static readonly APPOINTMENTS: string = '/appointments';
    public static readonly ROLES: string = '/roles';
    public static readonly APPLICATIONS: string = '/applications';
    public static readonly SERVICES: string = '/services';

    public static readonly QUERY = class {
      public static readonly EXPIRED: string = 'expired';
      public static readonly LOGOUT: string = 'logout';
    }
  }
  public static readonly HEADERS = class {
    public static readonly AUTHORIZATION: string = 'Authorization';
    public static readonly AUTHORIZATION_RESPONSE: string = 'authorization';
    public static readonly EXPIRES: string = 'expires';
  }

  public static readonly PASSWORDS = class {
    public static readonly PASSWD_REGEX:RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    public static readonly MIN_LENGTH = 12
    public static readonly MAX_LENGTH = 25
  }


}
