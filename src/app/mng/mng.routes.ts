import { Routes } from '@angular/router';
import { cauHinhRoutes } from './cau-hinh/cau-hinh.routes';
import { danhMucRoutes } from './danh-muc/danh-muc.routes';
import { taiKhoanRoutes } from './tai-khoan/tai-khoan.routes';

export const mngRoutes: Routes = [
  {
    path: '',
    // canActivate: [canActiveGuard],
    // data: {
    //   listRoles: Object.values(SystemConstant.MNG_ROLE), // All management roles had defined
    //   rolesRelation: 'OR',
    //   fallbackUrl: UrlConstant.ROUTE.AUTH.LOGIN
    // },
    loadComponent: () => import('../layout/mng/management-layout/management-layout.component')
      .then(m => m.ManagementLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'academic-ranks',
        loadComponent: () => import('./academic-ranks/list-academic-ranks/list-academic-ranks.component')
          .then(m => m.ListAcademicRanksComponent),
      },
      {
        path: 'danh-muc',
        children: danhMucRoutes,
      },
      {
        path: 'cau-hinh',
        children: cauHinhRoutes,
      },
      {
        path: 'tai-khoan',
        children: taiKhoanRoutes,
      },
    ],
  },
];
