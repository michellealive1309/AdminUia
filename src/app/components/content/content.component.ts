import { Component, OnInit, Input } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { NewsEditorComponent } from '../news-editor/news-editor.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  @Input('group')
  group: any

  contents: Observable<any>

  constructor(private groupService: GroupService,
    private alertController: AlertController,
    private modalController: ModalController,
    private navController: NavController) {
    // this.contents = this.groupService.getContent(this.group.id).pipe(map(feeds => {
    //   return feeds.map(feed => {
    //     return {
    //       id: feed.payload.doc.id,
    //       data: feed.payload.doc.data()
    //     }
    //   })
    // }))
  }

  ngOnInit() {
    this.contents = this.groupService.getContent(this.group.id).pipe(map(feeds => {
      return feeds.map(feed => {
        let data = feed.payload.doc.data()
        return data.type === 'news' ? 
        {
          id: feed.payload.doc.id,
          subject: data.subject,
          content: data.content,
          group: data.group,
          type: 'news',
          created: data.created
        } : {
          id: feed.payload.doc.id,
          content: data.content,
          group: data.group,
          files: data.files,
          filesRef: data.filesRef,
          images: data.images,
          imagesRef: data.imagesRef,
          type: 'announce',
          created: data.created
        }
      })
    }))
  }

  openNews(content: any) {

    this.navController.navigateForward('home/news/' + content.id, {state: {news:content}})

  }

  // openAnnounce(content: any) {

  // }

  deleteContent(content: any) {
    const alert = this.alertController.create({
      header: "Please confirm!",
      message: "<strong>Delete content</strong>",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {console.log('cancel')}
        },
        {
          text: "Confirm",
          handler: () => {this.groupService.deleteContent(content).then(res => {
            if (res) {console.log('Error, deleting content.')}
          })}
        }
      ]
    })
    alert.then(value => value.present())

  }

  editContent(content: any) {
    const modal = this.modalController.create({
      component: NewsEditorComponent,
      componentProps: {
        news: content,
        groupId: this.group.id
      },
      cssClass: 'news-editor_modal',
      backdropDismiss: false
    })

    modal.then(mdl => mdl.present())
  }

}
