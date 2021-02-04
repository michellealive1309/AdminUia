import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { GroupComponent } from 'src/app/components/group/group.component';
import { NewsComponent } from 'src/app/components/news/news.component';
import { AnnouceComponent } from 'src/app/components/annouce/annouce.component';
import { AdminComponent } from 'src/app/components/admin/admin.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'group/:id',
    component: GroupComponent
  },
  {
    path: 'news/:id',
    component: NewsComponent
  },
  {
    path: 'annouce/:id',
    component: AnnouceComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
