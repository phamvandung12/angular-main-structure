import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SystemConstant } from '@constants/system.constant';
import { UrlConstant } from '@constants/url.constant';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import { IRegisterDTO } from '@models/auth/auth.model';
import { MakeForm } from '@models/common/make-form.model';
import { AuthService } from '@services/auth/auth.service';
import { FormValidatorService } from '@services/common/form-validator.service';
import { mustMatch } from '@validators/must-match.validator';
import { FieldErrorDisplayComponent } from '@widget/field-error-display/field-error-display.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    RouterLink,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzTooltipModule,
    NzDividerModule,
    FieldErrorDisplayComponent,
  ],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private formValidatorSvc = inject(FormValidatorService);
  private authSvc = inject(AuthService);
  private socialLoginSvc = inject(SocialAuthService);
  private router = inject(Router);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(ToastrService);


  // Ngon ngu hien thi //////////
  langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).AUTH.REGISTER;
  //////////////////////////////

  urlConst = UrlConstant;

  form!: FormGroup<MakeForm<IRegisterDTO>>;
  showPass = false;

  isFieldValid = this.formValidatorSvc.isFieldValid;
  displayFieldCssZorro = this.formValidatorSvc.displayFieldCssZorro;


  ngOnInit(): void {
    if (this.authSvc.getAuthData() && this.authSvc.getToken()) {
      if (this.authSvc.checkRole(SystemConstant.MNG_ROLE.ADMIN)) {
        this.router.navigateByUrl(UrlConstant.ROUTE.MANAGEMENT.DASHBOARD);
      } else {
        this.router.navigateByUrl(UrlConstant.ROUTE.MAIN.HOMEPAGE);
      }
    } else {
      this.createForm();
    }
  }

  ngOnDestroy(): void {
    this.spinner.hide();
  }

  createForm(): void {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      repassword: ['', [Validators.required]],
    }, {
      validators: mustMatch('password', 'repassword'),
    });
  }

  toggleShowPassLogin(): void {
    this.showPass = !this.showPass;
  }

  onRegister(): void {
    if (this.form.valid) {
      this.spinner.show();
      if (this.form.get('email')?.value.split('@')[1] === 'hcmute.edu.vn') {
        this.spinner.hide();
        this.alert.error(this.langData.TAI_KHOAN_KHONG_HO_TRO);
      } else {
        this.authSvc.doRegisterForm(SystemConstant.ROLE.STUDENT, this.form.value)
          .subscribe({
            next: res => {
              if (res.message === 'Success') {
                this.alert.success(this.langData.DANG_KY_THANH_CONG);
                // // Nếu cần xác minh mail thì chuyển tới trang login
                // this.router.navigateByUrl(UrlConstant.ROUTE.AUTH.LOGIN);
                // // Nếu không cần xác minh mail thì đăng nhập luôn
                this.spinner.show();
                timer(1000).subscribe(() => {
                  this.authSvc.doLoginForm({
                    username: this.form.get('email')?.value,
                    password: this.form.get('password')?.value,
                    remember: true,
                  }).subscribe({
                    next: resLogin => {
                      this.authSvc.setToken(resLogin?.token ?? '');
                      delete resLogin.token;
                      this.authSvc.setAuthData(resLogin);
                      this.router.navigateByUrl(UrlConstant.ROUTE.MAIN.HOMEPAGE);
                    },
                  });
                });
              }
            },
          });
      }
    } else {
      this.formValidatorSvc.validateAllFormFields(this.form);
    }
  }

  onLoginWithGoogle(): void {
    this.socialLoginSvc.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (user) => {
        if (user?.authToken) {
          this.spinner.show();
          this.authSvc.doLoginGoogle(user.authToken)
            .subscribe({
              next: res => {
                this.authSvc.setToken(res?.token ?? '');
                delete res.token;
                this.authSvc.setAuthData(res);
                this.router.navigateByUrl(UrlConstant.ROUTE.MANAGEMENT.DASHBOARD);
              },
            });
        }
      },
    );
  }
}
