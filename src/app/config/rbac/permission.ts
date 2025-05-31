export class Permission {
  public static readonly APPOINTMENT_CENTER = class {
    public static readonly ROOT: string = 'ACCESS_APPOINTMENT_CENTER';
    public static readonly ADMIN: string = 'ACCESS_APPOINTMENT_CENTER_ADMIN';
    public static readonly MANAGER: string = 'ACCESS_APPOINTMENT_CENTER_MANAGER';
    public static readonly USER: string = 'ACCESS_APPOINTMENT_CENTER_USER';
  }

  public static readonly APPOINTMENT = class {
    public static readonly CREATE: string = 'ALLOW_APPOINTMENT_CREATE';
    public static readonly EDIT: string = 'ALLOW_APPOINTMENT_EDIT';
    public static readonly DELETE: string = 'ALLOW_APPOINTMENT_DELETE';
    public static readonly SYNCHRONIZE: string = 'ALLOW_APPOINTMENT_SYNCHRONIZE';
  }

  public static readonly WORKSHOP = class {
    public static readonly CREATE: string = 'ALLOW_APPOINTMENT_CREATE';
    public static readonly EDIT: string = 'ALLOW_APPOINTMENT_EDIT';
    public static readonly DELETE: string = 'ALLOW_APPOINTMENT_DELETE';
  }

  public static readonly CALENDAR = class {
    public static readonly DRAG: string = 'ALLOW_ACTIONS_DRAG';
    public static readonly DROP: string = 'ALLOW_ACTIONS_DROP';
    public static readonly RESIZE: string = 'ALLOW_ACTIONS_RESIZE';
  }
}
