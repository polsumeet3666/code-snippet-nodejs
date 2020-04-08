import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoLoginCbComponent } from './sso-login-cb.component';

describe('SsoLoginCbComponent', () => {
  let component: SsoLoginCbComponent;
  let fixture: ComponentFixture<SsoLoginCbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsoLoginCbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoLoginCbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
