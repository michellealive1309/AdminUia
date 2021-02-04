import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { GroupService } from 'src/app/services/group.service';
import * as firebase from 'firebase'

@Component({
  selector: 'app-group-creator',
  templateUrl: './group-creator.component.html',
  styleUrls: ['./group-creator.component.scss'],
})
export class GroupCreatorComponent implements OnInit {
  
  groupCreatorForm: FormGroup
  creatorError: boolean = false
  expandCreator = {
    display: "none"
  }
  idleCreator = {
    display: "block"
  }

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private groupService: GroupService
  ) { 
    this.groupCreatorForm = this.formBuilder.group({
      groupName: ['', Validators.required],
      privacy: ['', Validators.required],
      password: [{ value: '', disabled: true }, Validators.required],
    }, { updateOn: "change" })
  }

  ngOnInit() {}

  expandElement() {
    this.expandCreator.display = "block"
    this.idleCreator.display = "none"
  }

  collapseElement() {
    this.expandCreator.display = "none"
    this.idleCreator.display = "block"
  }

  enablePassword(value: boolean) {
    value ? this.groupCreatorForm.get('password').disable() : this.groupCreatorForm.get('password').enable()
  }

  createGroup() {
    let value = {
      name: this.groupCreatorForm.get('groupName').value,
      privacy: this.groupCreatorForm.get('privacy').value,
      password: this.groupCreatorForm.get('password').value,
      owner: this.userService.user.uid,
      modified: firebase.firestore.FieldValue.serverTimestamp(),
      created: firebase.firestore.FieldValue.serverTimestamp()
    }
    this.groupService.addGroup(value)
    .then(result => {
      return typeof result === 'string' ? this.userService.addGroup(result)
      .then(result => result ? this.creatorError = false : this.creatorError = true ) : this.creatorError = true
    })
    .then(() => {
      if (!this.creatorError) {this.collapseElement()}
    })
    this.groupCreatorForm.reset()
  }

}
