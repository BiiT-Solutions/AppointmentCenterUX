import {Role} from "authorization-services-lib";
import {Permission} from "./permission";
import {AppRole} from "authorization-services-lib/lib/models/app-role";

export class RoleBinding {

  private readonly APPOINTMENT_CENTER_ADMIN: Permission[] = [
    Permission.APPOINTMENT_CENTER.ROOT
  ];

  private readonly APPOINTMENT_CENTER_EDITOR: Permission[] = [
    Permission.APPOINTMENT_CENTER.ROOT
  ];

  private readonly APPOINTMENT_CENTER_VIEWER: Permission[] = [
    Permission.APPOINTMENT_CENTER.ROOT
  ];

  private roles : AppRole[];

  constructor(roles: AppRole[]){
    this.roles = roles;
  }

  public getPermissions(): Set<Permission>{
    const roles: Permission[] = this.roles.map(role => {
        switch(role.toUpperCase()){
          case Role.APPOINTMENTCENTER_ADMIN:
            return this.APPOINTMENT_CENTER_ADMIN;
          case Role.APPOINTMENTCENTER_EDITOR:
            return this.APPOINTMENT_CENTER_EDITOR;
          case Role.APPOINTMENTCENTER_VIEWER:
            return this.APPOINTMENT_CENTER_VIEWER;
          default:
            return [];
        }
      }).flat();
    return new Set<Permission>(roles);
  }
}
