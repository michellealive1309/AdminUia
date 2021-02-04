import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component'
import { ProfileEditorComponent } from 'src/app/components/profile-editor/profile-editor.component';
import { UserService } from 'src/app/services/user.service';
import { GroupCreatorComponent } from 'src/app/components/group-creator/group-creator.component';
import { GroupListComponent } from 'src/app/components/group-list/group-list.component';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { GroupComponent } from 'src/app/components/group/group.component';
import { NewsComponent } from 'src/app/components/news/news.component';
import { AnnouceComponent } from 'src/app/components/annouce/annouce.component';
import { ContentCreatorComponent } from 'src/app/components/content-creator/content-creator.component';
import { OwnerNamePipe } from 'src/app/pipes/owner-name.pipe';
import { QuillModule } from 'ngx-quill'
import { ContentComponent } from 'src/app/components/content/content.component';
import { GroupNamePipe } from 'src/app/pipes/group-name.pipe';
import { GroupService } from 'src/app/services/group.service';
import { FileNamePipe } from 'src/app/pipes/file-name.pipe';
import { GroupPanelComponent } from 'src/app/components/group-panel/group-panel.component';
import { NewsEditorComponent } from 'src/app/components/news-editor/news-editor.component';
import { AdminService } from 'src/app/services/admin.service';
import { AdminComponent } from 'src/app/components/admin/admin.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AnnouceEditorComponent } from 'src/app/components/annouce-editor/annouce-editor.component';
import { GroupSettingComponent } from 'src/app/components/group-setting/group-setting.component';
import { SubscriberListComponent } from 'src/app/components/subscriber-list/subscriber-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    QuillModule.forRoot(),
    HomePageRoutingModule
  ],
  entryComponents: [ProfileEditorComponent, GroupPanelComponent, NewsEditorComponent],
  // exports: [ProfileEditorComponent],
  declarations: [HomePage,
    SideMenuComponent,
    ProfileEditorComponent,
    GroupComponent,
    GroupCreatorComponent,
    GroupListComponent,
    DateFormatPipe,
    ContentCreatorComponent,
    ContentComponent,
    NewsComponent,
    OwnerNamePipe,
    AnnouceComponent,
    GroupNamePipe,
    FileNamePipe,
    GroupPanelComponent,
    NewsEditorComponent,
    AdminComponent,
    AnnouceEditorComponent, GroupSettingComponent, SubscriberListComponent
  ],
  exports: [DateFormatPipe, OwnerNamePipe, GroupNamePipe, FileNamePipe],
  providers: [UserService, GroupService, AdminService, AuthGuard],
  schemas:      [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomePageModule {}
