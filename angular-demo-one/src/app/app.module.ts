import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SsoLoginComponent } from './sso-login/sso-login.component';
import { DasgboardComponent } from './dasgboard/dasgboard.component';
import { SsoLoginCbComponent } from './sso-login-cb/sso-login-cb.component';

@NgModule({
  declarations: [
    AppComponent,
    SsoLoginComponent,
    DasgboardComponent,
    SsoLoginCbComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
