import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ModalController } from '@ionic/angular';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group-panel',
  templateUrl: './group-panel.component.html',
  styleUrls: ['./group-panel.component.scss'],
})
export class GroupPanelComponent implements OnInit {

  @Input() groupId: string
  @Input() request: string

  passwordForm: FormGroup
  groupNameForm: FormGroup
  passwordError: boolean = false
  groupNameError: boolean = false
  isSubmit: boolean = false

  constructor(private formBuilder: FormBuilder,
    private groupService: GroupService,
    private modalController: ModalController) {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(8)]]
    })
    this.groupNameForm = this.formBuilder.group({
      groupName: ['', [Validators.required]]
    })
  }

  ngOnInit() {}

  public submitUpdatePassword() {
    let data = { password: this.passwordForm.get('password').value}
    this.isSubmit = true
    this.groupService.updateGroup(this.groupId, data)
    .then(res => {
      if (!res) { this.modalController.dismiss() }
      else { this.passwordError = res }
    })
    .catch(err => console.error(err))
  }

  public submitUpdateGroupName() {
    let data = { name: this.groupNameForm.get('groupName').value}
    this.isSubmit = true
    this.groupService.updateGroup(this.groupId, data)
    .then(res => {
      if (!res) { this.modalController.dismiss() }
      else { this.groupNameError = res }
    })
    .catch(err => console.error(err))
  }

  public cancel() {
    this.modalController.dismiss()
  }

}
