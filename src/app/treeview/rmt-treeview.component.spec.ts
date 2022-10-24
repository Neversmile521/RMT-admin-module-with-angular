import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmtTreeviewComponent } from './rmt-treeview.component';

describe('RmtTreeviewComponent', () => {
  let component: RmtTreeviewComponent;
  let fixture: ComponentFixture<RmtTreeviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmtTreeviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RmtTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
