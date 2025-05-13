import {Permission} from "./permission";
import {AppRole} from "authorization-services-lib";

export class RoleBinding {

  private readonly APPOINTMENT_CENTER_ADMIN: Permission[] = [
    Permission.APPOINTMENT_CENTER.ROOT,
    Permission.APPOINTMENT_CENTER.ADMIN,
    Permission.APPOINTMENT.CREATE,
    Permission.APPOINTMENT.EDIT,
    Permission.APPOINTMENT.DELETE,
    Permission.WORKSHOP.CREATE,
    Permission.WORKSHOP.EDIT,
    Permission.WORKSHOP.DELETE,
    Permission.CALENDAR.DRAG,
    Permission.CALENDAR.DROP,
    Permission.CALENDAR.RESIZE,
    Permission.APPOINTMENT.SYNCHRONIZE,
  ];

  private readonly APPOINTMENT_CENTER_MANAGER: Permission[] = [
    Permission.APPOINTMENT_CENTER.ROOT,
    Permission.APPOINTMENT_CENTER.MANAGER,
    Permission.APPOINTMENT.CREATE,
    Permission.APPOINTMENT.EDIT,
    Permission.APPOINTMENT.DELETE,
    Permission.CALENDAR.DRAG,
    Permission.CALENDAR.DROP,
    Permission.CALENDAR.RESIZE,
    Permission.APPOINTMENT.SYNCHRONIZE
  ];

  private readonly APPOINTMENT_CENTER_USER: Permission[] = [
    Permission.APPOINTMENT_CENTER.ROOT,
    Permission.APPOINTMENT_CENTER.USER,
    Permission.APPOINTMENT.SYNCHRONIZE,
  ];

  private roles : AppRole[];

  constructor(roles: AppRole[]){
    this.roles = roles;
  }

  public getPermissions(): Set<Permission>{
    const roles: Permission[] = this.roles.map(role => {
        switch(role.toUpperCase()){
          case AppRole.APPOINTMENTCENTER_ADMIN:
            return this.APPOINTMENT_CENTER_ADMIN;
          case AppRole.APPOINTMENTCENTER_MANAGER:
            return this.APPOINTMENT_CENTER_MANAGER;
          case AppRole.APPOINTMENTCENTER_USER:
            return this.APPOINTMENT_CENTER_USER;
          default:
            return [];
        }
      }).flat();
    return new Set<Permission>(roles);
  }
}
