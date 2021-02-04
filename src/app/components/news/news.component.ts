import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular'

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {

  news: any

  constructor(private router: Router,
    private navController: NavController) {
    this.news = this.router.getCurrentNavigation().extras.state.news
  }

  ngOnInit() {}

  back() {
    this.navController.pop()
  }

}
