import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as saml2 from 'saml2-js';
//import * as fs from 'fs';

@Component({
  selector: 'app-sso-login',
  templateUrl: './sso-login.component.html',
  styleUrls: ['./sso-login.component.css'],
})
export class SsoLoginComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    //alert('on init');
    this.document.location.href = 'http://localhost:8080/login';
  }
}
