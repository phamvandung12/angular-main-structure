import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, input, output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import { CheckFileTypeService } from '@services/common/check-file-type.service';
import { FileService } from '@services/common/file.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ToastrService } from 'ngx-toastr';

export const pluginsModules = [NgxExtendedPdfViewerModule];
@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrl: './view-file.component.css',
  imports: pluginsModules,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewFileComponent implements OnInit {
  private alert = inject(ToastrService);
  private fileSvc = inject(FileService);
  private sanitizerSvc = inject(DomSanitizer);
  private checkFileTypeSvc = inject(CheckFileTypeService);
  private cdr = inject(ChangeDetectorRef);

  readonly fileId = input.required<string>();
  readonly viewer = input(''); // imageViewer / pdfViewer / ''
  readonly hideIframe = output<boolean>();

  // Ngon ngu hien thi //////////
  langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).SHARED.VIEW_FILE;
  //////////////////////////////

  // viewer = '';
  resourceUrl!: string;
  safeResourceUrl!: SafeResourceUrl;
  pdfBlob!: Blob;
  unsupportFileBlob!: HttpResponse<Blob>;
  extension!: string;
  degree = 0;
  imgW = 0;
  imgH = 0;
  localViewer = '';
  fileType = '';

  constructor() {
    this.localViewer = this.viewer() ?? '';
  }

  ngOnInit(): void {
    this.fileSvc.downloadFile(this.fileId()).subscribe(res => {
      res.body?.arrayBuffer()
        .then(data => {
          this.checkFileTypeSvc.checkTypeOfBlob(data)
            .subscribe({
              next: (fileType: string) => {
                if (res.body) {
                  if (['jpg', 'png'].includes(fileType)) {
                    this.localViewer = 'imageViewer';
                    const blobImg = new Blob([res.body], { type: 'image/*' });
                    this.safeResourceUrl = this.sanitizerSvc.bypassSecurityTrustResourceUrl(URL.createObjectURL(blobImg));
                  } else if (['pdf'].includes(fileType)) {
                    this.localViewer = 'pdfViewer';
                    this.pdfBlob = new Blob([res.body], { type: 'application/pdf' });
                  } else if (['doc', 'docx'].includes(fileType)) {
                    this.localViewer = 'officeViewer';
                    // this.pdfBlob = new Blob([res.body], { type: 'application/pdf' });
                    // Unsupport view file right now
                    this.unsupportFileBlob = res;
                    ///////////////////
                  } else {
                    this.localViewer = 'unsupportViewer';
                    this.unsupportFileBlob = res;
                  }
                } else {
                  this.localViewer = 'unsupportViewer';
                  this.unsupportFileBlob = res;
                }
                this.cdr.detectChanges();
              },
            });
        });
    });
  }

  hide(): void {
    this.localViewer = '';
    this.hideIframe.emit(false);
  }

  getImgSize(): void {
    this.imgW = Math.round(document.getElementById('image')?.clientWidth ?? 0);
    this.imgH = Math.round(document.getElementById('image')?.clientHeight ?? 0);
  }

  rotateImage(): void {
    this.degree = this.degree + 90 >= 450 ? this.degree = 90 : this.degree + 90;

    const tmp = document.getElementById('image');
    if (tmp) {
      if (this.imgW >= this.imgH) {
        tmp.style.transform = 'rotate(' + this.degree + 'deg)';
        // margin top-bot
        const imgRatio = this.imgH / this.imgW;
        if (this.degree / 90 % 2 === 1) {
          tmp.style.margin = Math.round((1 - imgRatio) * 50) + '% auto';
        } else {
          tmp.style.margin = 'auto';
        }
      } else {
        tmp.style.transform = 'rotate(' + this.degree + 'deg)';
      }
    }
  }

  downloadUnsupportedViewFile() {
    if (this.unsupportFileBlob.body) {
      if (this.unsupportFileBlob.headers.get('filename')) {
        this.fileSvc.blobToDownloadFile(this.unsupportFileBlob.body, this.unsupportFileBlob.headers.get('filename') ?? '');
      } else {
        this.fileSvc.blobToDownloadFile(this.unsupportFileBlob.body, 'no-name' + (this.fileType ? `.${this.fileType}` : ''));
      }
    } else {
      this.alert.error(this.langData.CO_LOI_XAY_RA);
    }
  }
}
