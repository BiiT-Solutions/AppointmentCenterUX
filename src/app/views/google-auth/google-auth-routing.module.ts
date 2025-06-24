import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {GoogleAuthComponent} from "./google-auth.component";

const routes: Routes = [
  {
    path: '',
    component: GoogleAuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoogleAuthRoutingModule { }
