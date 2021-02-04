import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular'
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss'],
})
export class ProfileEditorComponent implements OnInit {

  editProfileForm: FormGroup
  valid: boolean = false
  updateError: boolean = false

  constructor(private modalController: ModalController,
    private formBuilder: FormBuilder,
    private userService: UserService) {
      this.editProfileForm = this.formBuilder.group({
        firstName: [{value: '', disabled: true}],
        lastName: [{value: '', disabled: true}],
        tag: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(5)]]
      }, { updateOn: 'change' })
  }

  ngOnInit() {}

  updateProfile() {
    let tag = this.editProfileForm.get('tag').value
    if (tag) {
      this.userService.updateUserProfile(tag).then(res => res ? this.modalController.dismiss() : this.updateError = true)
    }
    else {
      this.valid = true
    }
  }

  cancelEdit() {
    this.modalController.dismiss()
  }

}
