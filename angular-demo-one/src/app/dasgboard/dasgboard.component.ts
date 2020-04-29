import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dasgboard',
  templateUrl: './dasgboard.component.html',
  styleUrls: ['./dasgboard.component.css'],
})
export class DasgboardComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    //alert(this.document.cookie);
    console.log(document.location);
  }
}
