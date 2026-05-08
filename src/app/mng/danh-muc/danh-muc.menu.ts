import { SystemConstant } from '@constants/system.constant';
import { ISiderMenu } from '@models/common/sider-menu.model';

export const danhMucMngMenu: ISiderMenu[] = [
  {
    roles: [SystemConstant.MNG_ROLE.ADMIN],
    icon: 'pic-left', // If have child, this icon must using from zorro
    title: 'Danh mục',
    routerLink: '',
    listChild: [
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Bậc đào tạo',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.BAC_DAO_TAO,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Cấp đề tài',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.CAP_DE_TAI,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Chức vụ',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.CHUC_VU,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Dân tộc',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.DAN_TOC,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Hệ đào tạo',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.HE_DAO_TAO,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Học hàm',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.HOC_HAM,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Học vị',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.HOC_VI,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Khoa',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.KHOA,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Ngành đào tạo',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.NGANH_DAO_TAO,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Quốc gia',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.QUOC_GIA,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Tôn giáo',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.TON_GIAO,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Tỉnh thành',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.TINH_THANH,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Quận huyện',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.QUAN_HUYEN,
      //   roles: []
      // },
      // {
      //   icon: 'fa-solid fa-circle',
      //   title: 'Xã phường',
      //   routerLink: UrlConstant.ROUTE.MANAGEMENT.XA_PHUONG,
      //   roles: []
      // }
    ],
  },
];
