import { Routes } from '@angular/router';

export const taiKhoanRoutes: Routes = [
  {
    path: '',
    redirectTo: 'quan-ly',
    pathMatch: 'full',
  },
  /*
  {
    path: 'aaaaa',
    title: `AAAA | ${SystemConstant.WEB_NAME}`,
    loadComponent: () => import('./')
      .then(m => m.ListHeDaoTaoComponent),
  },
  */
];
