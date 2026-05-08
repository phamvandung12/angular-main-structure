import { SystemConstant } from '@constants/system.constant';
import { ISiderMenu } from '@models/common/sider-menu.model';

export const cauHinhMngMenu: ISiderMenu[] = [
  {
    roles: [SystemConstant.MNG_ROLE.ADMIN],
    icon: 'setting', // If have child, this icon must using from zorro
    title: 'Cấu hình',
    routerLink: '',
    listChild: [
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Banner trang chủ',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.BANNER,
      //   roles: []
      // },
    ],
  },
];
