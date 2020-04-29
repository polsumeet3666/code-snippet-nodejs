import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoLogoutComponent } from './sso-logout.component';

describe('SsoLogoutComponent', () => {
  let component: SsoLogoutComponent;
  let fixture: ComponentFixture<SsoLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsoLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
