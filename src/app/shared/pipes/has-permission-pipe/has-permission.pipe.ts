import { Pipe, PipeTransform } from '@angular/core';
import {PermissionService} from "../../../services/permission.service";
import {Permission} from "../../../config/rbac/permission";

@Pipe({
  name: 'hasPermission',
  pure: false,
})
export class HasPermissionPipe implements PipeTransform {

  constructor(private permissionService: PermissionService) {
  }

  transform(permission: Permission | Permission[]): boolean {
    if (permission instanceof Array) {
      return permission.map(p => this.permissionService.hasPermission(p)).includes(true);
    } else {
      return this.permissionService.hasPermission(permission);
    }
  }
}
