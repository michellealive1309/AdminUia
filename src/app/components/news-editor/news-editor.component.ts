import { Component, OnInit, Input } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-news-editor',
  templateUrl: './news-editor.component.html',
  styleUrls: ['./news-editor.component.scss'],
})
export class NewsEditorComponent implements OnInit {

  @Input() news: any
  @Input() groupId: any

  newsForm: FormGroup
  newsError: boolean = false
  isWorking: boolean = false
  
  editorStyle = {
    height: '400px'
  }

  constructor(private groupService: GroupService,
    private modalController: ModalController,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.newsForm = this.formBuilder.group({
      subject: [this.news.subject, [Validators.required, Validators.maxLength(100)]],
      content: [this.news.content, [Validators.required]]
    })
  }

  back() {
    this.modalController.dismiss()
  }

  editNews() {
    this.isWorking = true
    let data = {
      subject: this.newsForm.get('subject').value,
      content: this.newsForm.get('content').value
    }

    this.groupService.updateNews(data, this.news.id)
    .then(res => this.newsError = res)
    .then(async () => {
      this.isWorking = await false
      this.back()
    })
    .catch(err => console.error(err))

  }

}
