import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-annouce-editor',
  templateUrl: './annouce-editor.component.html',
  styleUrls: ['./annouce-editor.component.scss'],
})
/**
 * Incomplete component due to no logic to make solution
 */
export class AnnouceEditorComponent implements OnInit {
  @Input() announce: any
  @Input() groupId: any

  announceForm: FormGroup

  isImageUploading: boolean = false
  isImageUploaded: boolean = false
  imageSnapshot: Observable<any>
  imagePercentage: Observable<any>
  imageTask: AngularFireUploadTask
  uploadedImageURL: Observable<string>

  isFileUploading: boolean = false
  isFileUploaded: boolean = false
  fileSnapshot: Observable<any>
  filePercentage: Observable<any>
  fileTask: AngularFireUploadTask
  uploadedFileURL: Observable<string>
  
  imageName: string
  imageSize: number
  fileName: string
  fileSize: number

  announceError: boolean = false

  constructor(private formBuilder: FormBuilder,
    private modalController: ModalController,
    private afStorage: AngularFireStorage) { }

  ngOnInit() {
    this.announceForm = this.formBuilder.group({
      content: [this.announce.content, [Validators.required, Validators.maxLength(500)]]
    }, { updateOn: 'change' })
  }

  back() {
    this.modalController.dismiss()
  }

  editAnnounce() {

  }

  uploadImage(event: FileList) {

    const file = event.item(0)

    if (file.type.split('/')[0] !== 'application') {
      console.log('This file is not application')
      return
    }

    this.isImageUploading = true;
    this.isImageUploaded = false;

    this.imageName = file.name

    //Storage path
    const path = 'group/' + this.groupId + '/' + new Date().getTime() + file.name
    //const customMetadata = { app: 'Freaky Image Upload Demo' }; Metadata
    //File reference
    const fileRef = this.afStorage.ref(path)
    //Main task
    this.fileTask = this.afStorage.upload(path, file, {customMetadata: {name:file.name}})

    //Get file progress percentage
    this.imagePercentage = this.imageTask.percentageChanges()
    this.imageSnapshot = this.imageTask.snapshotChanges().pipe(finalize(() => {
      //Get uploaded file storage path
      this.uploadedImageURL = fileRef.getDownloadURL()

      this.uploadedImageURL.subscribe(resp => {
        this.announce.images.push(resp)
        this.announce.imagesRef.push(path)
      })
      this.isImageUploading = false;
      this.isImageUploaded = true;

    }), tap(snap => this.imageSize = snap.totalBytes))

  }

  deleteImage(fileRef, filePath) {

    const storageRef = this.afStorage.ref(fileRef)
    this.announce.images = this.announce.images.filter(value => value !== filePath)
    this.announce.imagesRef = this.announce.imagesRef.filter(value => value !== fileRef)
    const deleted = storageRef.delete().toPromise()
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
    const path = 'group/' + this.groupId + '/' + new Date().getTime() + file.name
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
        this.announce.files.push(resp)
        this.announce.filesRef.push(path)
      })
      this.isFileUploading = false;
      this.isFileUploaded = true;

    }), tap(snap => this.fileSize = snap.totalBytes))

  }

  deleteFile(fileRef, filePath) {

    const storageRef = this.afStorage.ref(fileRef)
    this.announce.files = this.announce.files.filter(value => value !== filePath)
    this.announce.filesRef = this.announce.filesRef.filter(value => value !== fileRef)
    const deleted = storageRef.delete().toPromise()
    deleted.then(() => console.log('Deleted file')).catch(err => console.error(err))

  }

}
