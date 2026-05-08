import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { MainFooterComponent } from '../main-footer/main-footer.component';
import { MainHeaderComponent } from '../main-header/main-header.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  imports: [
    RouterOutlet,
    NzGridModule,
    MainHeaderComponent,
    MainFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent { }
