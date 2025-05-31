import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {MsAuthComponent} from "./ms-auth.component";

const routes: Routes = [
  {
    path: '',
    component: MsAuthComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MsAuthRoutingModule { }
