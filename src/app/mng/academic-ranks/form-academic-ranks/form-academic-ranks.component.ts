import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SystemConstant } from '@constants/system.constant';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import { MakeForm } from '@models/common/make-form.model';
import { ModalData } from '@models/common/modal-data.model';
import { FormValidatorService } from '@services/common/form-validator.service';
import { FieldErrorDisplayComponent } from '@widget/field-error-display/field-error-display.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IAcademicRanks, IAcademicRanksDTO } from '../DEMO-academic.model';
import { AcademicRanksService } from '../DEMO-academic.service';

@Component({
  selector: 'app-form-academic-ranks',
  imports: [
    ReactiveFormsModule,
    NzInputModule,
    NzGridModule,
    NzButtonModule,
    FieldErrorDisplayComponent,
  ],
  templateUrl: './form-academic-ranks.component.html',
  styleUrl: './form-academic-ranks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormAcademicRanksComponent implements OnInit {
  private fb = inject(FormBuilder);
  private academicRanksSvc = inject(AcademicRanksService);
  private formValidatorSvc = inject(FormValidatorService);
  private alert = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);

  readonly modalData = input.required<ModalData<IAcademicRanks>>();
  readonly closeModal = output<boolean>();

  // Ngon ngu hien thi //////////
  langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi)
    .MNG.CATEGORIES.ACADEMIC_RANKS;
  //////////////////////////////

  form!: FormGroup<MakeForm<IAcademicRanksDTO>>;

  isFieldValid = this.formValidatorSvc.isFieldValid;
  displayFieldCssZorro = this.formValidatorSvc.displayFieldCssZorro;

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.nonNullable.group({
      academicRankName: ['', [Validators.required]],
      academicRankNameEn: ['', [Validators.required]],
      academicRankAbbreviation: ['', [Validators.required]],
      academicRankAbbreviationEn: ['', [Validators.required]],
    });
    const modalData = this.modalData();
    if (modalData.action === SystemConstant.ACTION.EDIT) {
      this.form.patchValue({
        academicRankName: modalData.data?.academicRankName,
        academicRankNameEn: modalData.data?.academicRankNameEn,
        academicRankAbbreviation: modalData.data?.academicRankAbbreviation,
        academicRankAbbreviationEn: modalData.data?.academicRankAbbreviationEn,
      });
    }
  }

  onCancel(): void {
    this.closeModal.emit(false);
  }

  onSubmit(): void {
    console.log(this.form.value);
    if (this.form.valid) {
      this.spinner.show();
      const modalData = this.modalData();
      if (modalData.action === SystemConstant.ACTION.EDIT && modalData?.data?.id) {
        this.academicRanksSvc.update(this.form.value, modalData.data.id)
          .subscribe({
            next: () => {
              this.closeModal.emit(true);
              this.alert.success(this.langData.CAP_NHAT_THANH_CONG);
            },
          });
      } else {
        this.academicRanksSvc.create(this.form.value)
          .subscribe({
            next: () => {
              this.closeModal.emit(true);
              this.alert.success(this.langData.THEM_MOI_THANH_CONG);
            },
          });
      }
    } else {
      this.formValidatorSvc.validateAllFormFields(this.form);
    }
  }
}
