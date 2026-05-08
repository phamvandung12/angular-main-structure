import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SystemConstant } from '@constants/system.constant';
import { UrlConstant } from '@constants/url.constant';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import { AuthService } from '@services/auth/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { concat, first, takeWhile, timer } from 'rxjs';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NzGridModule,
    NzDropDownModule,
    NzButtonModule,
  ],
})
export class MainHeaderComponent implements OnInit {
  private authSvc = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private appRef = inject(ApplicationRef);


  urlConst = UrlConstant;

  isLogin = false;
  isStudent = false;
  isAdmin = false;

  userName = 'Menu';
  userAvatarLink = '';

  // Language ///////////////////
  langCode: 'en' | 'vi' = localStorage.getItem('language') as 'en' | 'vi' ?? 'vi';
  langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).LAYOUT.MAIN.HEADER;

  ngOnInit(): void {
    localStorage.setItem('language', this.langCode);
    this.checkLogin();
    concat(this.appRef.isStable.pipe(first(isStable => isStable)), timer(0, 1000))
      .pipe(takeWhile(() => !this.isLogin))
      .subscribe(() => {
        this.checkLogin();
      });
  }

  checkLogin(): void {
    if (this.authSvc.getAuthData() && this.authSvc.getToken()) {
      this.isLogin = true;
      this.isStudent = this.authSvc.checkRole(SystemConstant.ROLE.STUDENT);
      this.isAdmin = Object.values(SystemConstant.MNG_ROLE).some(role => this.authSvc.checkRole(role));
      this.userAvatarLink = this.authSvc.getAvatarOfLogin() ?? '';
      this.userName = this.authSvc.getNameOfLogin();
      this.cdr.detectChanges();
    }
  }

  onLogOut(): void {
    this.authSvc.doLogout(UrlConstant.ROUTE.MAIN.HOMEPAGE);
    this.isLogin = false;
  }

  switchLang(lang: string): void {
    localStorage.setItem('language', lang);
    window.location.reload();
  }
}
