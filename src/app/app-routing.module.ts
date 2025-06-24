import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./services/auth-guard.service";

const login = import('./views/biit-login-page/biit-login-page.module').then(m => m.BiitLoginPageModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => login
  },
  {
    path: 'login',
    loadChildren: () => login
  },
  {
    data: { no_decoration: true },
    path: 'microsoft',
    loadChildren: () => import('./views/ms-auth/ms-auth.module').then(m => m.MsAuthModule),
    canActivate: [AuthGuard]
  },
  {
    data: {no_decoration: true},
    path: 'google',
    loadChildren: () => import('./views/google-auth/google-auth.module').then(m => m.GoogleAuthModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'appointments',
    loadChildren: () => import('./views/appointment-calendar/appointment-calendar.module').then(m => m.AppointmentCalendarModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'schedule',
    loadChildren: () => import('./views/schedule-calendar/schedule-calendar.module').then(m => m.ScheduleCalendarModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadChildren: () => login
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
