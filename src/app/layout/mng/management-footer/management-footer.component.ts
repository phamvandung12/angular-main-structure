import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConstant } from '@constants/system.constant';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import * as Sentry from '@sentry/angular';
import { take, timer } from 'rxjs';

@Component({
  selector: 'app-management-footer',
  templateUrl: './management-footer.component.html',
  styleUrl: './management-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ManagementFooterComponent {
  // Ngon ngu hien thi //////////
  langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).LAYOUT.MNG.FOOTER;
  langDataSentry: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).SENTRY;
  ///////////////////////////////

  currYear = new Date().getFullYear();
  revison = SystemConstant.REVISON;

  openFeedbackDialog() {
    Sentry.showReportDialog({
      lang: localStorage.getItem('language') ?? 'vi',
      title: this.langDataSentry.SENTRY_ERR_TITLE_MANUAL,
      subtitle: this.langDataSentry.SENTRY_ERR_SUBTITLE_MANUAL,
      subtitle2: '',
      labelName: this.langDataSentry.SENTRY_LABEL_NAME,
      labelComments: this.langDataSentry.SENTRY_LABEL_COMMENT,
      labelSubmit: this.langDataSentry.SENTRY_LABEL_SUBMIT,
      labelClose: this.langDataSentry.SENTRY_LABEL_CLOSE,
      successMessage: this.langDataSentry.SENTRY_SUBMIT_OK,
      errorFormEntry: this.langDataSentry.SENTRY_INPUT_INVALID,
      errorGeneric: this.langDataSentry.SENTRY_SUBMIT_ERR,
      eventId: '00000000000000000000000000000000',
      onLoad: () => {
        timer(100, 100).pipe(take(10)).subscribe(() => {
          const headerP = document.querySelector('.sentry-error-embed.clearfix header p');
          const idCmt = document.getElementById('id_comments');
          if (headerP?.innerHTML) {
            headerP.innerHTML = headerP.innerHTML.replace(/&lt;br&gt;/g, '<br>');
          }
          if (idCmt) {
            idCmt.setAttribute('placeholder', this.langDataSentry.SENTRY_DESCRIPTION_PLACEHOLDER);
          }
        });
      },
    });
  }
}
