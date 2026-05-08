import { GoogleInitOptions, GoogleLoginProvider, SOCIAL_AUTH_CONFIG, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, ErrorHandler, inject, LOCALE_ID, provideAppInitializer, Provider } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env';
import { authInterceptor } from '@interceptors/auth.interceptor';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import * as Sentry from '@sentry/angular';
import { vi as viDate } from 'date-fns/locale';
import { en_US, NZ_DATE_LOCALE, NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { provideSpinnerConfig } from 'ngx-spinner';
import { provideToastr } from 'ngx-toastr';
import { take, timer } from 'rxjs';

const langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).SENTRY;
// To test Sentry feature, allow local host: main.ts => if (environment.production || true)
const showSentryDialog = (): boolean => {
  const lastTime = parseInt(localStorage.getItem('showSentryDialog') ?? '0', 10);
  if (new Date(lastTime + 86400000) < new Date()) {
    localStorage.setItem('showSentryDialog', `${Date.now()}`);
    return true;
  } else {
    return false;
  }
};

export const coreProviders: (Provider | EnvironmentProviders)[] = [
  {
    provide: NZ_I18N,
    // Usage:
    // import { en_US, NzI18nService } from 'ng-zorro-antd/i18n';
    // constructor(private i18n: NzI18nService) {}
    // switchLanguage() { this.i18n.setLocale(en_US); }
    useFactory: () => {
      const localId = inject(LOCALE_ID);
      switch (localId) {
        case 'en':
          return en_US;
        case 'vi':
          return vi_VN;
        default:
          return vi_VN;
      }
    },
  },
  { provide: NZ_DATE_LOCALE, useValue: viDate },
  {
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler({
      logErrors: true,
      showDialog: showSentryDialog(),
      dialogOptions: {
        lang: localStorage.getItem('language') ?? 'vi',
        title: langData['SENTRY_ERR_TITLE'],
        subtitle: langData['SENTRY_ERR_SUBTITLE'],
        subtitle2: '',
        labelName: langData['SENTRY_LABEL_NAME'],
        labelComments: langData['SENTRY_LABEL_COMMENT'],
        labelSubmit: langData['SENTRY_LABEL_SUBMIT'],
        labelClose: langData['SENTRY_LABEL_CLOSE'],
        successMessage: langData['SENTRY_SUBMIT_OK'],
        errorFormEntry: langData['SENTRY_INPUT_INVALID'],
        errorGeneric: langData['SENTRY_SUBMIT_ERR'],
        onLoad: () => {
          timer(100, 100).pipe(take(10)).subscribe(() => {
            const headerP = document.querySelector('.sentry-error-embed.clearfix header p');
            const idCmt = document.getElementById('id_comments');
            const closeBtn = document.querySelector('.sentry-error-embed .close');
            if (headerP?.innerHTML) {
              headerP.innerHTML = headerP.innerHTML.replace(/&lt;br&gt;/g, '<br>');
            }
            if (idCmt) {
              idCmt.setAttribute('placeholder', langData['SENTRY_DESCRIPTION_PLACEHOLDER']);
            }
            if (closeBtn) {
              closeBtn.addEventListener('click', () => window.location.reload());
            }
          });
        },
      },
    }),
  },
  {
    provide: Sentry.TraceService,
    deps: [Router],
  },
  provideAppInitializer(() => {
    inject(Sentry.TraceService);
  }),
  {
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler(),
  },
  provideSpinnerConfig({}),
  provideToastr({
    timeOut: 6868,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
  }),
  provideHttpClient(
    withInterceptors([authInterceptor]),
  ),
  {
    provide: SOCIAL_AUTH_CONFIG,
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            environment.keyGoogle,
            {
              oneTapEnabled: false,
              scopes: 'openid profile email',
            } as GoogleInitOptions,
          ),
        },
      ],
      onError: (err) => {
        console.error(err);
      },
    } as SocialAuthServiceConfig,
  },
];
