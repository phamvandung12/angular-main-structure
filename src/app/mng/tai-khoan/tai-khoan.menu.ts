import { SystemConstant } from '@constants/system.constant';
import { ISiderMenu } from '@models/common/sider-menu.model';

export const taiKhoanMngMenu: ISiderMenu[] = [
  {
    roles: [SystemConstant.MNG_ROLE.ADMIN],
    icon: 'idcard', // If have child, this icon must using from zorro
    title: 'Tài khoản',
    routerLink: '',
    listChild: [
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Tài khoản',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.TK_DANG_NHAP,
      //   roles: []
      // },
    ],
  },
];
