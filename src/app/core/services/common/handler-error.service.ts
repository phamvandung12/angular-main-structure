/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { UrlConstant } from '@constants/url.constant';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import { AuthService } from '@services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HandlerErrorService {
  private authSvc = inject<AuthService>(AuthService);
  private alert = inject(ToastrService);


  // Ngon ngu hien thi //////////
  // private langCode: 'en' | 'vi' = localStorage.getItem('language') as 'en' | 'vi' ?? 'vi';
  private langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).CORE.HANDLE_ERROR;
  //////////////////////////////

  private routerNext = '';

  handleError(error: HttpErrorResponse): Observable<never> {
    if (this.authSvc.getAuthData() && this.authSvc.getToken()) {
      this.routerNext = UrlConstant.ROUTE.AUTH.LOGIN;
    } else {
      this.routerNext = UrlConstant.ROUTE.MAIN.HOMEPAGE;
    }

    try {
      if (error.status) {
        switch (error.status) {
          case 401:
            this.alert.error(this.langData.TAI_KHOAN_KHONG_CO_QUYEN);
            if (!isDevMode()) {
              this.authSvc.doLogout(UrlConstant.ROUTE.AUTH.LOGIN);
            }
            break;
          case 403:
            this.alert.error(this.langData.TAI_KHOAN_KHONG_CO_QUYEN);
            if (!isDevMode()) {
              this.authSvc.doLogout(UrlConstant.ROUTE.AUTH.LOGIN);
            }
            break;
          default:
            if (error.error instanceof Blob) {
              error.error.text().then(errText => {
                const blobJson = JSON.parse(errText) as HttpErrorResponse;
                this.alert.error(blobJson.message ?? this.langData.CO_LOI_XAY_RA);
              });
            } else if (error.error?.error?.message) { // Error message of file svc
              this.alert.error(error.error?.error?.message ?? this.langData.CO_LOI_XAY_RA);
            } else {
              this.alert.error(error.error.message ?? this.langData.CO_LOI_XAY_RA);
            }
            break;
        }
      } else {
        this.alert.error(this.langData.CO_LOI_XAY_RA);
        if (!isDevMode()) {
          this.authSvc.doLogout(this.routerNext);
        } else {
          console.log('routerNext: ', this.routerNext);
        }
      }
    } catch {
      this.alert.error(this.langData.CO_LOI_XAY_RA);
    }

    return throwError(() => new Error(error.error ?? this.langData.CO_LOI_XAY_RA));
  }

  handleErrorForkJoin(): Observable<unknown> {
    return of([]);
  }

  // doLogout() {
  //   this.spinner.show('spinner', { bdColor: 'rgba(0, 0, 0, .9)' });
  //   const showSentryDialog = localStorage.getItem('showSentryDialog');
  //   timer(100).subscribe(() => {
  //     this.cookie.delete(SystemConstant.CURRENT_INFO, '/', undefined, true, 'Strict');
  //     localStorage.clear();
  //   });
  //   return new Promise((resolve) => {
  //     timer(1000).subscribe(() => {
  //       localStorage.setItem('language', this.langCode);
  //       if (showSentryDialog) {
  //         localStorage.setItem('showSentryDialog', showSentryDialog);
  //       }
  //       this.spinner.hide();
  //       resolve(null);
  //     });
  //   });
  // }

  // getToken(): string {
  //   return JSON.parse(localStorage.getItem(SystemConstant.CURRENT_INFO) ?? '{}')?.token;
  // }
}
