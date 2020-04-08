import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SsoLoginComponent } from 'src/app/sso-login/sso-login.component';
import { SsoLoginCbComponent } from 'src/app/sso-login-cb/sso-login-cb.component';
import { DasgboardComponent } from 'src/app/dasgboard/dasgboard.component';

const routes: Routes = [
  { path: 'ssologin', component: SsoLoginComponent },
  { path: 'ssologincb', component: SsoLoginCbComponent },
  { path: 'dashboard', component: DasgboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
