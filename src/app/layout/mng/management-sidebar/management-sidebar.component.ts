import { NgClass } from '@angular/common';
import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, viewChildren } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SystemConstant } from '@constants/system.constant';
import { UrlConstant } from '@constants/url.constant';
import langDataEn from '@languages/en.json';
import langDataVi from '@languages/vi.json';
import { cauHinhMngMenu } from '@mng/cau-hinh/cau-hinh.menu';
import { danhMucMngMenu } from '@mng/danh-muc/danh-muc.menu';
import { taiKhoanMngMenu } from '@mng/tai-khoan/tai-khoan.menu';
import { ISiderMenu } from '@models/common/sider-menu.model';
import { AuthService } from '@services/auth/auth.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { concat, first, takeWhile, timer } from 'rxjs';

@Component({
  selector: 'app-management-sidebar',
  templateUrl: './management-sidebar.component.html',
  styleUrl: './management-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    NzDropDownModule,
    NzTooltipModule,
  ],
})
export class ManagementSidebarComponent implements OnInit {
  private authSvc = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private appRef = inject(ApplicationRef);


  readonly subMenuItem = viewChildren<NzSubMenuComponent>('subMenuItem');

  // Ngon ngu hien thi //////////
  langData: Record<string, string> = (localStorage.getItem('language') === 'en' ? langDataEn : langDataVi).LAYOUT.MNG.SIDEBAR;
  //////////////////////////////

  nameOfUser = '';
  avatarOfUser = '';

  listMenu: ISiderMenu[] = [];

  listRoleUser: string[] = [];

  ngOnInit(): void {
    // this.nhanVienSvc.getCurrentLogin()
    //   .subscribe(res => {
    //     this.listRoleUser = res.roles;
    //   });
    concat(this.appRef.isStable.pipe(first(isStable => isStable)), timer(0, 500))
      .pipe(takeWhile(() => !this.nameOfUser))
      .subscribe(() => {
        this.checkLogin();
      });

    this.listMenu = [
      {
        roles: [SystemConstant.MNG_ROLE.ADMIN],
        icon: 'fa-solid fa-solar-panel', // If have child, this icon must using from zorro
        title: this.langData.TONG_QUAN,
        routerLink: UrlConstant.ROUTE.MANAGEMENT.DASHBOARD,
        listChild: [],
      },
      ...danhMucMngMenu,
      ...cauHinhMngMenu,
      ...taiKhoanMngMenu,
    ];
  }

  checkLogin(): void {
    this.nameOfUser = this.authSvc.getNameOfLogin();
    this.avatarOfUser = this.authSvc.getAvatarOfLogin();
    this.cdr.detectChanges();
  }

  checkRole(listRoleCheck: string[]) {
    if (!listRoleCheck.length) {
      return true;
    }
    return !!this.listRoleUser.filter(value => listRoleCheck.includes(value)).length;
  }

  autoHideMenu() {
    this.subMenuItem().forEach(e => {
      if (!e.isSelected && !e.isActive && e.nzOpen) {
        e.toggleSubMenu();
      }
    });
  }
}
