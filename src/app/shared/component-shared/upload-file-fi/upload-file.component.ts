import { NgClass } from '@angular/common';
import { HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, inject, input, output } from '@angular/core';
import { ViewFileComponent } from '@component-shared/view-file/view-file.component';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import { IFileInfo, IListFilesPatchFileInfo } from '@models/common/file.model';
import { AutoUnsubscribeService } from '@services/common/auto-unsubscribe.service';
import { FileService } from '@services/common/file.service';
import { GetFileInfoDirective } from '@widget/directives/get-file-info.directive';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription, take, takeUntil, timer } from 'rxjs';

export const pluginsModules = [
  NgClass,
  NzModalModule,
  NzPopconfirmModule,
  GetFileInfoDirective,
  ViewFileComponent,
];
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css',
  imports: pluginsModules,
  providers: [AutoUnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent implements OnInit {
  private alert = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private fileSvc = inject(FileService);
  private nzModalSvc = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);
  private autoUnSubSvc = inject(AutoUnsubscribeService);


  readonly acceptFilesExtension = input('.jpg,.jpeg,.png,.pdf,.ppt,.pptx,.doc,.docx');
  readonly subFolderOnServer = input('');
  readonly isUploadMultiFile = input(false);
  readonly isDisableUpload = input(false); // but still show view BTN

  readonly isDisableView = input(false);
  readonly isDownloadable = input(false);
  readonly isDisableDelete = input(false);
  readonly deleteNoConfirm = input(false);
  readonly showFileName = input(false);

  readonly listFilesPatch = input<IListFilesPatchFileInfo[]>([]);
  readonly isUploading = output<boolean>();
  readonly returnedListId = output<IListFilesPatchFileInfo[]>();

  // Ngon ngu hien thi //////////
  langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).SHARED.UPLOAD_FILE;
  //////////////////////////////

  //////////////////////////////
  viewModalRef!: NzModalRef;
  uploadRef!: Subscription;

  isStartUpload = false;
  uploadingProgress = 0;
  listFiles: IListFilesPatchFileInfo[] = [];
  selectedFileIdForView = '';
  defaultFolder = 'chua-phan-loai';

  trackingTimer!: Subscription;

  ngOnInit(): void {
    const trackingFilePatch = timer(200, 200)
      .pipe(take(100)).subscribe({
        next: () => { // Try 100 times until listFilesPatch is not empty
          this.listFiles = this.listFilesPatch();
          if (this.listFiles.length > 0) {
            this.trackingTimer = timer(1000, 1000)
              .pipe(takeUntil(this.autoUnSubSvc.destroyed))
              .subscribe({
                next: () => {
                  this.listFiles = this.listFilesPatch();
                  this.cdr.detectChanges();
                },
              });
            trackingFilePatch.unsubscribe();
          }
          this.cdr.detectChanges();
        },
      });
  }

  uploadFile(files: FileList) {
    this.uploadingProgress = 0;
    this.isStartUpload = true;
    this.isUploading.emit(true);
    if (this.isUploadMultiFile()) {
      const allFileSize = Array.from(files).reduce((total, cur) => total += cur.size, 0);
      this.uploadRef = this.fileSvc.uploadMultiFile(files, this.subFolderOnServer() ?? this.defaultFolder)
        .subscribe({
          next: (resArr) => {
            this.listFiles = [
              ...new Map([
                this.listFiles, resArr?.length ? resArr
                  ?.filter(x => x.type === HttpEventType.Response)
                  ?.map(x => ({
                    id: x.body?.fileName ?? '',
                    filename: x.body?.fileName,
                  })) : [],
              ].flat().map(item => [item?.id, item])).values(),
            ];
            if (resArr?.some(x => !x || (x.type === HttpEventType.ResponseHeader && !x.ok))) { // Got an error
              this.returnedListId.emit(this.listFiles);
              this.isStartUpload = false;
              this.isUploading.emit(false);
            } else {
              resArr?.filter(x => x.type === HttpEventType.UploadProgress)
                .map(x => this.uploadingProgress = Math.round(100 * (x as HttpProgressEvent).loaded / allFileSize));
            }
            this.cdr.detectChanges();
          },
          complete: () => {
            this.isStartUpload = false;
            this.isUploading.emit(false);
            this.cdr.detectChanges();
          },
        });
    } else {
      this.uploadRef = this.fileSvc.uploadFile(files[0], this.subFolderOnServer() ?? this.defaultFolder)
        .subscribe({
          next: (res) => {
            if (res.type === HttpEventType.Response) {
              this.listFiles = [{ id: res.body?.fileName ?? '', fileInfo: res.body }];
              this.returnedListId.emit(this.listFiles);
              this.isStartUpload = false;
              this.isUploading.emit(false);
              this.uploadRef.unsubscribe();
            } else if (res.type === HttpEventType.UploadProgress) {
              if (res.total) {
                this.uploadingProgress = Math.round(100 * res.loaded / res.total);
              } else {
                this.uploadingProgress = Math.round(100 * res.loaded / files[0].size);
              }
            }
            this.cdr.detectChanges();
          },
          error: () => {
            this.isStartUpload = false;
            this.isUploading.emit(false);
            this.uploadRef.unsubscribe();
            this.cdr.detectChanges();
          },
        });
    }
  }

  onRemove(index: number): void {
    this.listFiles.splice(index, 1);
    this.returnedListId.emit(this.listFiles);
  }

  setFileName(file: IFileInfo, refVar: IListFilesPatchFileInfo): void {
    if (refVar.fileInfo) {
      refVar.fileInfo.fileName = file?.fileName ?? this.langData.LOI;
    } else {
      refVar.fileInfo = { fileName: this.langData.LOI } as IFileInfo;
    }
  }

  openModalViewFile(template: TemplateRef<unknown>, fileId: string | undefined): void {
    if (!fileId) {
      return;
    }
    this.selectedFileIdForView = fileId;
    this.viewModalRef = this.nzModalSvc.create({
      nzStyle: { top: '20px', maxHeight: '90vh' },
      nzWidth: '90vw',
      nzTitle: undefined,
      nzMaskClosable: false,
      nzContent: template,
      nzOnOk: () => this.viewModalRef.close(),
      nzCancelText: null,
    });
  }

  hideModalViewFile(): void {
    this.viewModalRef.close();
  }

  onTerminateUploading(): void {
    this.uploadRef.unsubscribe();
    this.isStartUpload = false;
    this.isUploading.emit(false);
  }

  downloadFile(downloadUri: string | undefined): void {
    if (!downloadUri) {
      return;
    }
    this.spinner.show();
    this.fileSvc.downloadFile(downloadUri)
      .subscribe({
        next: res => {
          if (res.body) {
            this.fileSvc.blobToDownloadFile(res.body, res.headers.get('filename') ?? 'file');
          } else {
            this.alert.error(this.langData.CO_LOI_XAY_RA);
          }
        },
      });
  }
}
