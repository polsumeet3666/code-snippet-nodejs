import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SsoLoginComponent } from 'src/app/sso-login/sso-login.component';
import { DasgboardComponent } from 'src/app/dasgboard/dasgboard.component';
import { SsoLogoutComponent } from 'src/app/sso-logout/sso-logout.component';

const routes: Routes = [
  { path: 'sso/login', component: SsoLoginComponent },
  { path: 'sso/logout', component: SsoLogoutComponent },
  { path: 'dashboard', component: DasgboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
