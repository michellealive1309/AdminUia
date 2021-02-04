import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit {

  groups: Observable<Group[]>

  constructor(private groupService: GroupService,
    private navController: NavController,
    private router: Router) {
    this.groups = this.groupService.getGroup()
  }

  ngOnInit() {}

  openGroupPage(group) {
    this.navController.navigateForward('home/group/' + group.id, {state: {group: group}})
  }

}
