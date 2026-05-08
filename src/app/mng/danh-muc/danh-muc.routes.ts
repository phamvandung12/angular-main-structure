import { Routes } from '@angular/router';

export const danhMucRoutes: Routes = [
  {
    path: '',
    redirectTo: 'bac-dao-tao',
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
