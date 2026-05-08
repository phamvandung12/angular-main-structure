import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SystemConstant } from '@constants/system.constant';
import { UrlConstant } from '@constants/url.constant';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import { ModalData } from '@models/common/modal-data.model';
import { BreadCrumb } from '@widget/breadcrumb/breadcrumb.model';
import { BreadcrumbComponent } from '@widget/breadcrumb/breadcumb.component';
import { TablePaginateComponent } from '@widget/paginate/paginate.component';
import { Paginate } from '@widget/paginate/paginate.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IAcademicRanks } from '../DEMO-academic.model';
import { AcademicRanksService } from '../DEMO-academic.service';
import { FormAcademicRanksComponent } from '../form-academic-ranks/form-academic-ranks.component';

@Component({
  selector: 'app-list-academic-ranks',
  imports: [
    FormsModule,
    NzGridModule,
    NzModalModule,
    NzSwitchModule,
    NzInputModule,
    NzTableModule,
    NzButtonModule,
    BreadcrumbComponent,
    TablePaginateComponent,
    FormAcademicRanksComponent,
  ],
  templateUrl: './list-academic-ranks.component.html',
  styleUrl: './list-academic-ranks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListAcademicRanksComponent implements OnInit {
  // private destroyRef = inject(DestroyRef); // Use when setup search subject subscription https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed
  private cdr = inject(ChangeDetectorRef);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(ToastrService);
  private nzModalSvc = inject(NzModalService);
  private academicRanksSvc = inject(AcademicRanksService);

  // Ngon ngu hien thi //////////
  langCode: 'en' | 'vi' = localStorage.getItem('language') as 'en' | 'vi' ?? 'vi';
  langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi)
    .MNG.CATEGORIES.ACADEMIC_RANKS;
  //////////////////////////////

  breadcrumbObj: BreadCrumb = new BreadCrumb({
    heading: this.langData.HOC_HAM,
    listBreadcrumb: [
      {
        title: this.langData.DANH_MUC,
        link: UrlConstant.ROUTE.MANAGEMENT.CATEGORIES,
      },
    ],
  });

  listAcademicRanks = new Paginate<IAcademicRanks>();
  modalData = new ModalData<IAcademicRanks>();
  searchValue = '';
  selectedSwitcherId = '';

  ngOnInit(): void {
    this.getDataPaging();
  }

  getDataPaging(isSearch?: boolean): void {
    if (isSearch) {
      this.listAcademicRanks.currentPage = 1;
    }
    this.spinner.show();
    this.academicRanksSvc.getAllPaging(
      this.listAcademicRanks.currentPage - 1,
      this.listAcademicRanks.limit,
      this.searchValue,
    )
      .subscribe({
        next: res => {
          this.listAcademicRanks.currentPage = res.pageable.pageNumber + 1;
          this.listAcademicRanks.limit = res.pageable.pageSize;
          this.listAcademicRanks.totalPage = res.totalPages;
          this.listAcademicRanks.totalItem = res.totalElements;
          this.listAcademicRanks.data = res.content;
          this.cdr.detectChanges();
        },
      });
  }

  openModal(template: TemplateRef<unknown>, data?: IAcademicRanks): void {
    if (data) {
      this.modalData.action = SystemConstant.ACTION.EDIT;
      this.modalData.data = data;
    } else {
      this.modalData.action = SystemConstant.ACTION.ADD;
    }
    this.nzModalSvc.create({
      nzStyle: { top: '20px' },
      nzWidth: 500,
      nzTitle: `${(data ? this.langData.CHINH_SUA :
        this.langData.THEM_MOI)} ${this.breadcrumbObj.heading}`,
      nzContent: template,
      nzFooter: null,
      nzMaskClosable: false,
    });
  }

  closeModal(reload?: boolean): void {
    if (reload) {
      this.getDataPaging();
    }
    this.nzModalSvc.closeAll();
  }

  pageChange(page: Paginate<IAcademicRanks>): void {
    this.listAcademicRanks = page;
    this.getDataPaging();
  }

  changeStatus(id: string): void {
    this.selectedSwitcherId = id;
    this.nzModalSvc.confirm({
      nzWidth: 300,
      nzTitle: this.langData.XAC_NHAN_THAY_DOI_TRANG_THAI,
      nzCancelText: this.langData.HUY,
      nzOkDanger: true,
      nzOkText: this.langData.XAC_NHAN,
      nzOnOk: () => {
        this.spinner.show();
        this.academicRanksSvc.delete(id)
          .subscribe({
            next: () => {
              this.alert.success(this.langData.THAY_DOI_THANH_CONG);
              this.selectedSwitcherId = '';
              this.getDataPaging();
            },
            error: () => { this.selectedSwitcherId = ''; this.cdr.detectChanges(); },
          });
      },
      nzOnCancel: () => { this.selectedSwitcherId = ''; this.cdr.detectChanges(); },
    });
  }
}
