import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular'
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ProfileEditorComponent } from '../profile-editor/profile-editor.component';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  userProfile: Observable<any>

  constructor(private userService: UserService,
    private router: Router,
    private navController: NavController,
    private modalController: ModalController) {
    this.userProfile = this.userService.getUserProfile()
  }

  ngOnInit() {}

  editProfile() {
    this.modalController.create({
      component: ProfileEditorComponent,
      cssClass: "uia_admin_modal-profile-editor",
      backdropDismiss: false
    }).then(modal => modal.present())
  }

  goToAdmin() {
    this.navController.navigateForward('/home/admin')
  }

  logout() {
    this.userService.signOutUser().then(() => this.router.navigate(['login']))
  }

}
