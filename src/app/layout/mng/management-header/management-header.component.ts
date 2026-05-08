import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UrlConstant } from '@constants/url.constant';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import { AuthService } from '@services/auth/auth.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-management-header',
  templateUrl: './management-header.component.html',
  styleUrl: './management-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NzDropDownModule,
  ],
})
export class ManagementHeaderComponent implements OnInit {
  private authSvc = inject(AuthService);


  urlConst = UrlConstant;
  avatarOfUser = '';

  // Ngon ngu hien thi //////////
  langCode: 'en' | 'vi' = localStorage.getItem('language') as 'en' | 'vi' ?? 'vi';
  langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).LAYOUT.MNG.HEADER;

  ngOnInit(): void {
    this.avatarOfUser = this.authSvc.getAvatarOfLogin();
  }

  doLogout(): void {
    this.authSvc.doLogout(UrlConstant.ROUTE.MAIN.HOMEPAGE);
  }

  switchLang(lang: 'en' | 'vi'): void {
    localStorage.setItem('language', lang);
    this.langCode = lang;
    window.location.reload();
  }
}
