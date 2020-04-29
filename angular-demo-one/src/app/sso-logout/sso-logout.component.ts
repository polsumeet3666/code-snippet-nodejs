import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sso-logout',
  templateUrl: './sso-logout.component.html',
  styleUrls: ['./sso-logout.component.css'],
})
export class SsoLogoutComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.document.location.href = 'http://localhost:8080/logout';
  }
}
