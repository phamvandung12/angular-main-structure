import { NgClass } from '@angular/common';
import { HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, inject, input, output } from '@angular/core';
import { ViewFileComponent } from '@component-shared/view-file/view-file.component';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import { IFileInfo, IListFilesPatchId } from '@models/common/file.model';
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
  private autoUnSubSvc = inject(AutoUnsubscribeService);
  private cdr = inject(ChangeDetectorRef);

  readonly acceptFilesExtension = input('.jpg,.jpeg,.png,.pdf,.ppt,.pptx,.doc,.docx,.zip,.rar');
  readonly subFolderOnServer = input('');
  readonly isUploadMultiFile = input(false);
  readonly isDisableUpload = input(false); // but still show view BTN

  readonly isDisableView = input(false);
  readonly isDisableDelete = input(false);
  readonly isDownloadable = input(false);
  readonly deleteNoConfirm = input(false);

  readonly listFilesPatch = input<IListFilesPatchId[]>([]);
  readonly isUploading = output<boolean>();
  readonly returnedListId = output<IListFilesPatchId[]>();

  // Ngon ngu hien thi //////////
  langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).SHARED.UPLOAD_FILE;
  //////////////////////////////

  //////////////////////////////
  viewModalRef!: NzModalRef;
  uploadRef!: Subscription;

  isStartUpload = false;
  uploadingProgress = 0;
  listFiles: IListFilesPatchId[] = [];
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
    this.cdr.detectChanges();
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
                    id: x.body?.id ?? '',
                    filename: x.body?.fileName,
                  })) : [],
              ].flat().map(item => [item?.id, item])).values(),
            ];
            if (resArr?.some(x => !x || (x.type === HttpEventType.ResponseHeader && !x.ok))) { // Got an error
              this.returnedListId.emit(this.listFiles);
              this.isStartUpload = false;
              this.isUploading.emit(false);
              this.cdr.detectChanges();
            } else {
              resArr?.filter((x: HttpEvent<IFileInfo>) => x.type === HttpEventType.UploadProgress)
                .map(x => this.uploadingProgress = Math.round(100 * (x as HttpProgressEvent).loaded / allFileSize));
              this.cdr.detectChanges();
            }
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
              this.listFiles = [{ id: res.body?.id ?? '', filename: res.body?.fileName }];
              this.returnedListId.emit(this.listFiles);
              this.isStartUpload = false;
              this.isUploading.emit(false);
              this.uploadRef.unsubscribe();
              this.cdr.detectChanges();
            } else if (res.type === HttpEventType.UploadProgress) {
              if (res.total) {
                this.uploadingProgress = Math.round(100 * res.loaded / res.total);
              } else {
                this.uploadingProgress = Math.round(100 * res.loaded / files[0].size);
              }
              this.cdr.detectChanges();
            }
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
    this.cdr.detectChanges();
  }

  setFileName(file: IFileInfo | undefined, refVar: IListFilesPatchId): void {
    refVar.filename = file?.fileName ?? this.langData.LOI;
    this.cdr.detectChanges();
  }

  openModalViewFile(template: TemplateRef<unknown>, fileId: string | undefined): void {
    if (!fileId) {
      return;
    }
    this.selectedFileIdForView = fileId;
    this.viewModalRef = this.nzModalSvc.create({
      nzStyle: { top: '20px', width: '100%', maxWidth: '80vw' },
      nzTitle: undefined,
      nzMaskClosable: false,
      nzContent: template,
      nzOnOk: () => this.viewModalRef.close(),
      nzCancelText: null,
    });
    this.cdr.detectChanges();
  }

  hideModalViewFile(): void {
    this.viewModalRef.close();
  }

  onTerminateUploading(): void {
    this.uploadRef.unsubscribe();
    this.isStartUpload = false;
    this.isUploading.emit(false);
    this.cdr.detectChanges();
  }

  downloadFile(fileId: string | undefined): void {
    if (!fileId) {
      return;
    }
    this.spinner.show();
    this.fileSvc.downloadFile(fileId)
      .subscribe({
        next: res => {
          this.fileSvc.getFileInfo(fileId)
            .subscribe({
              next: fileInfo => {
                if (res.body) {
                  this.fileSvc.blobToDownloadFile(res.body, fileInfo.fileName);
                } else {
                  this.alert.error(this.langData.CO_LOI_XAY_RA);
                }
              },
            });
        },
      });
  }
}
