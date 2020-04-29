import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SsoLoginComponent } from './sso-login/sso-login.component';
import { DasgboardComponent } from './dasgboard/dasgboard.component';
import { SsoLogoutComponent } from './sso-logout/sso-logout.component';

@NgModule({
  declarations: [
    AppComponent,
    SsoLoginComponent,
    DasgboardComponent,
    SsoLogoutComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
