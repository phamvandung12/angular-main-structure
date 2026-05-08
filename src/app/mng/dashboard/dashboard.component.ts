import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CkeEditorComponent } from '@component-shared/cke-editor/cke-editor.component';
import { UploadFileComponent } from '@component-shared/upload-file-id/upload-file.component';
import { UrlConstant } from '@constants/url.constant';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import { FileService } from '@services/common/file.service';
import { LatexService } from '@services/common/latex.service';
import { BreadCrumb } from '@widget/breadcrumb/breadcrumb.model';
import { BreadcrumbComponent } from '@widget/breadcrumb/breadcumb.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzGridModule,
    NzModalModule,
    NzButtonModule,
    FormsModule,
    BreadcrumbComponent,
    UploadFileComponent,
    CkeEditorComponent,
  ],
})
export class DashboardComponent implements OnInit {
  private fbd = inject(FormBuilder);
  private fileSvc = inject(FileService);
  latexSvc = inject(LatexService);

  // Ngon ngu hien thi //////////
  langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).MNG.DASHBOARD;
  ///////////////////////////////

  breadcrumbObj: BreadCrumb = new BreadCrumb({
    heading: this.langData.DASHBOARD,
    listBreadcrumb: [
      {
        title: this.langData.DANH_MUC,
        link: UrlConstant.ROUTE.MANAGEMENT.CATEGORIES,
      },
    ],
  });

  ckeData = 'đề bài: &lt;la-tex&gt;\\( \\exp \\biggl( 2x \\biggl( 1 - \\frac{\\hat{r}}{2x\\mu} - \\log \\frac{\\hat{r}}{2x\\mu} \\biggl) \\biggl) \\)&lt;/la-tex&gt;';

  // Upload file /////////////////////////////////////////
  setListIdFileToForm = this.fileSvc.setListIdFileToForm;
  setIdFileToForm = this.fileSvc.setIdFileToForm;
  extractFileFromListId = this.fileSvc.extractFileFromListId;
  // End Upload file //////////////////////////////////////

  exampleForm!: FormGroup;

  constructor() {
    this.latexSvc.loadScript();
  }

  // Prevent reaload page
  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHander(e: BeforeUnloadEvent) {
  //   const confirmationMessage = '-';
  //   e.returnValue = confirmationMessage;
  //   return confirmationMessage;
  // }
  // // Prevent change router
  // canDeactivate(): Promise<boolean> {
  //   return new Promise(resolve => {
  //     this.nzModalSvc.confirm({
  //       nzTitle: 'Are you sure to leave this page?<br>Changes you made may not be saved.',
  //       nzOnOk: () => resolve(true),
  //       nzOnCancel: () => resolve(false),
  //     });
  //   });
  // }

  ngOnInit(): void {
    this.exampleForm = this.fbd.group({
      fieldOneFile: ['1', [Validators.required]],
      fieldMultiFile: [['1', '2'], [Validators.required]],
      dataCke: [''],
    });
  }

  viewFormValue() {
    console.log('FORM VALUE', this.exampleForm.value);
  }

  patchFormValue() {
    this.exampleForm.patchValue({
      dataCke: 'New CKEditor data',
    });
  }
}
