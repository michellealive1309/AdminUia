import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { GroupService } from 'src/app/services/group.service';
import { GroupPanelComponent } from '../group-panel/group-panel.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {

  group: any

  constructor(private router: Router,
    private groupService: GroupService,
    private alertController: AlertController,
    private modalController: ModalController,
    private navController: NavController) {
    this.group = this.router.getCurrentNavigation().extras.state.group
  }

  ngOnInit() {}

  back() {
    this.navController.pop()
  }

  async requestPassword() {
    let groupObs = this.groupService.getSingleGroup(this.group.id)
    let groupSubscription = groupObs.subscribe(async group => {
      const alert = await this.alertController.create({
        header: "Your password:",
        message: group.password,
        buttons: [
          {
            text: 'Okay',
            role: 'cancel',
            handler: () => {groupSubscription.unsubscribe()}
          }
        ]
      })
      alert.present()
    })
  }

  async updatePassword() {
    const modal = await this.modalController.create({
      component: GroupPanelComponent,
      componentProps: {
        groupId: this.group.id,
        request: 'password'
      },
      cssClass: "panel_utility",
    })
    modal.present()
  }

  async updateGroupName() {
    const modal = await this.modalController.create({
      component: GroupPanelComponent,
      componentProps: {
        groupId: this.group.id,
        request: 'group_name'
      },
      cssClass: "panel_utility",
    })
    modal.present()
  }

  async deleteGroup() {
    const alert = await this.alertController.create({
      header: "Are you sure to delete GROUP?",
      message: "<strong style='color: red;'>Type \"DELETE GROUP\" to delete your GROUP</strong><br><span>If text is incorrect, GROUP will be remains</span>",
      inputs: [
        {
          name: "deleteGroup",
          type: "text",
          placeholder: "DELETE GROUP"
        }
      ],
      buttons: [
        {
          text: 'Okay',
          handler: async (params) => {
            if (params.deleteGroup !== 'DELETE GROUP') { return console.log('Group not delete') }
            else { 
              await this.groupService.deleteGroup(this.group.id).then(val => {val.unsubscribe()}).catch(err => console.error(err))
              this.back()
            }
          }
        }
      ]
    })
    alert.present()
  }

}
