import { Injectable } from '@angular/core';
import {RoleBinding} from "../config/rbac/role-binding";
import {Permission} from "../config/rbac/permission";
import {AppRole} from "authorization-services-lib/lib/models/app-role";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissions: RoleBinding;
  constructor() { }
  public setRole(roles: AppRole[]): void{
    this.permissions = new RoleBinding(roles);
  }
  public hasPermission(permission: Permission): boolean{
    if (!this.permissions) {
      return false;
    }
    return this.permissions.getPermissions().has(permission);
  }

  public clear(): void {
    this.permissions = null;
  }
}
