import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage'
import * as firebase from 'firebase'
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-content-creator',
  templateUrl: './content-creator.component.html',
  styleUrls: ['./content-creator.component.scss'],
})
export class ContentCreatorComponent implements OnInit {
  @Input('group')
  group: any

  newsForm: FormGroup
  announceForm: FormGroup
  newsError: boolean = false
  announceError: boolean = false
  selectStyles = {
    selectNews: { '--background': '#13e013' },
    selectAnnounce: { '--background': '#13e013' },
    selectedNews: { display: 'none' },
    selectedAnnounce: { display: 'none' },
    newsDisabled: false,
    announceDisabled: false
  }

  editorStyle = {
    height: '400px'
  }

  images: any[] = []
  imagesDetail: { name:string, filePath:string, size:number, pathRef:string }[] = []
  files: any[] = []
  filesDetail: { name:string, filePath:string, size:number, pathRef:string }[] = []

  //Upload task
  imageTask: AngularFireUploadTask
  fileTask: AngularFireUploadTask
  //Progress in percentage
  imagePercentage: Observable<number>
  filePercentage: Observable<number>
  //Snapshot of uploading file
  imageSnapshot: Observable<any>
  fileSnapshot: Observable<any>
  //Uploaded file url
  uploadedImageURL: Observable<string>
  uploadedFileURL: Observable<string>
  //Uploaded Image List
  // imageList: Observable<any[]>
  // fileList: Observable<any[]>
  //File details
  imageName: string
  imageSize: number
  fileName: string
  fileSize: number
  //Status check
  isImageUploading: boolean = false
  isImageUploaded: boolean = false
  isFileUploading: boolean = false
  isFileUploaded: boolean = false

  constructor(private formBuilder: FormBuilder,
    private afStorage: AngularFireStorage,
    private groupService: GroupService) { }

  ngOnInit() {
    this.announceForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    }, { updateOn: 'change' })
    this.newsForm = this.formBuilder.group({
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required]]
    })
  }

  selectCreateNews() {
    this.selectStyles.newsDisabled = !this.selectStyles.newsDisabled
    this.selectStyles.announceDisabled = false
    this.selectStyles.selectNews["--background"] = '#989aa2'
    this.selectStyles.selectAnnounce["--background"] = '#13e013'
    this.selectStyles.selectedNews.display = 'block'
    this.selectStyles.selectedAnnounce.display = 'none'
  }

  selectCreateAnnounce() {
    this.selectStyles.announceDisabled = !this.selectStyles.announceDisabled
    this.selectStyles.newsDisabled = false
    this.selectStyles.selectAnnounce["--background"] = '#989aa2'
    this.selectStyles.selectNews["--background"] = '#13e013'
    this.selectStyles.selectedAnnounce.display = 'block'
    this.selectStyles.selectedNews.display = 'none'
  }

  resetSelected() {
    this.selectStyles.newsDisabled = false
    this.selectStyles.announceDisabled = false
    this.selectStyles.selectNews["--background"] = '#13e013'
    this.selectStyles.selectAnnounce["--background"] = '#13e013'
    this.selectStyles.selectedNews.display = 'none'
    this.selectStyles.selectedAnnounce.display = 'none'
  }

  createNews() {
    
    let data = {
      subject: this.newsForm.get('subject').value,
      content: this.newsForm.get('content').value,
      group: this.group.id,
      type: "news",
      created: firebase.firestore.FieldValue.serverTimestamp()
    }

    this.groupService.addNews(data)
    .then(res => this.newsError = res)
    .then(() => {
      if (!this.newsError) {
        this.resetNewsCreator()
        this.resetSelected()
      }
    })
    .catch(err => console.error(err))

  }

  resetNewsCreator() {

    this.newsForm.reset()

  }

  createAnnounce() {

    let data = {
      content: this.announceForm.get('content').value,
      group: this.group.id,
      images: this.imagesDetail.map(value => value.filePath),
      imagesRef: this.images,
      files: this.filesDetail.map(value => value.filePath),
      filesRef: this.files,
      type: "announce",
      created: firebase.firestore.FieldValue.serverTimestamp()
    }

    this.groupService.addAnnounce(data)
    .then(res => this.announceError = res)
    .then(() => {
      if (!this.announceError) {
        this.resetAnnounceCreator()
        this.resetSelected()
      }
    })
    .catch(err => console.error(err))

  }

  resetAnnounceCreator() {

    this.announceForm.reset()
    this.images.filter(() => false)
    this.imagesDetail.filter(() => false)
    this.isImageUploading = false
    this.isImageUploaded = false
    this.isFileUploading = false
    this.isFileUploaded = false

  }

  uploadImage(event: FileList) {

    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') {
      console.log('This file is not image')
      return
    }

    this.isImageUploading = true;
    this.isImageUploaded = false;

    this.imageName = file.name

    //Storage path
    const path = 'group/' + this.group.id + '/' + new Date().getTime() + file.name
    //const customMetadata = { app: 'Freaky Image Upload Demo' }; Metadata
    //File reference
    const fileRef = this.afStorage.ref(path)
    //Main task
    this.imageTask = this.afStorage.upload(path, file, {customMetadata: {name:file.name}})

    //Get file progress percentage
    this.imagePercentage = this.imageTask.percentageChanges()
    this.imageSnapshot = this.imageTask.snapshotChanges().pipe(finalize(() => {
      //Get uploaded file storage path
      this.uploadedImageURL = fileRef.getDownloadURL()

      this.uploadedImageURL.subscribe(resp => {
        this.images.push(path)
        this.imagesDetail.push({name:file.name, filePath:resp, size:this.imageSize, pathRef:path})
      })
      this.isImageUploading = false;
      this.isImageUploaded = true;

    }), tap(snap => this.imageSize = snap.totalBytes))

  }

  deleteImage(name: string, pathRef: string) {
    
    const path = 'group/' + this.group.id + '/' + name
    const fileRef = this.afStorage.ref(path)
    this.images = this.images.filter(value => value !== pathRef)
    this.imagesDetail = this.imagesDetail.filter(value => value.name !== name)
    const deleted = fileRef.delete().toPromise()
    deleted.then(() => console.log('Deleted image')).catch(err => console.error(err))

  }

  uploadFile(event: FileList) {

    const file = event.item(0)

    if (file.type.split('/')[0] !== 'application') {
      console.log('This file is not application')
      return
    }

    this.isFileUploading = true;
    this.isFileUploaded = false;

    this.fileName = file.name

    //Storage path
    const path = 'group/' + this.group.id + '/' + new Date().getTime() + file.name
    //const customMetadata = { app: 'Freaky Image Upload Demo' }; Metadata
    //File reference
    const fileRef = this.afStorage.ref(path)
    //Main task
    this.fileTask = this.afStorage.upload(path, file, {customMetadata: {name:file.name}})

    //Get file progress percentage
    this.filePercentage = this.fileTask.percentageChanges()
    this.fileSnapshot = this.fileTask.snapshotChanges().pipe(finalize(() => {
      //Get uploaded file storage path
      this.uploadedFileURL = fileRef.getDownloadURL()

      this.uploadedFileURL.subscribe(resp => {
        this.files.push(path)
        this.filesDetail.push({name:file.name, filePath:resp, size:this.fileSize, pathRef:path})
      })
      this.isFileUploading = false;
      this.isFileUploaded = true;

    }), tap(snap => this.fileSize = snap.totalBytes))

  }

  deleteFile(name: string, pathRef: string) {

    const path = 'group/' + this.group.id + '/' + name
    const fileRef = this.afStorage.ref(path)
    this.files = this.files.filter(value => value !== pathRef)
    this.filesDetail = this.filesDetail.filter(value => value.name !== name)
    const deleted = fileRef.delete().toPromise()
    deleted.then(() => console.log('Deleted file')).catch(err => console.error(err))

  }

}
