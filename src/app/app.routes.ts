import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  // {
  //     path: '',
  //     pathMatch: 'full',
  //     redirectTo: 'page'
  // },
  // {
  //     path: 'home',
  //     component: HomePageComponent
  // },
  {
    path: '',
    component: LayoutComponent,
    children: [],
  },
  // { path: '**', redirectTo: 'base/:page', pathMatch: 'full' }
];
