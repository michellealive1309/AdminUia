import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import * as firebase from 'firebase'
import { Observable } from 'rxjs';

export class StudentRecord {
  public email: string;
  public identityNumber: string;
  public name: string;
  public faculty: string;
  public majority: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {

  //announcers: Observable<any> #future function

  selectedOfficialGroup: boolean = true
  selectedAddAnnouncer: boolean = true
  selectedAddStudents: boolean = false

  addAnnouncerForm: FormGroup
  addAnnouncerError: boolean = false
  addAnnouncerErrorMessage: string = 'Default error message.'
  isSubmitAddAnnouncer: boolean = false

  isStudentAdding: boolean = false

  public records: any[] = [];

  constructor(private navController: NavController,
    private userService: UserService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    //this.announcers = this.userService.getAnnouncerUser() #future function
    this.addAnnouncerForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: [{value:'',disabled:true}, [Validators.required]],
      name: ['', [Validators.required]],
      tag: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]],
      department: ['', [Validators.required]]
    })
  }

  back() {
    this.navController.back()
  }

  selectOfficialGroup() {
    this.selectedOfficialGroup = true
    this.selectedAddAnnouncer = false
    this.selectedAddStudents = false
  }

  selectAddAnnouncer() {
    this.selectedOfficialGroup = false
    this.selectedAddAnnouncer = true
    this.selectedAddStudents = false
  }

  selectAddStudents() {
    this.selectedOfficialGroup = false
    this.selectedAddAnnouncer = false
    this.selectedAddStudents = true
  }

  /**
   * Incomplete function
   */
  createAnnouncer() { //There is an issue that cannot be solve now.
    let data = {
      email: this.addAnnouncerForm.get('email').value,
      name: this.addAnnouncerForm.get('name').value,
      tag: this.addAnnouncerForm.get('tag').value,
      department: this.addAnnouncerForm.get('department').value,
      isAdmin: false,
      isStudent: false,
      isRegister: false,
      created: firebase.firestore.FieldValue.serverTimestamp()
    }
    let user = {
      email: this.addAnnouncerForm.get('email').value,
      password: 'DE9726v75S1eF'
    }
    this.userService.addUser(user, data).then(res => {
      if (!res.error) {
        this.addAnnouncerError = false
        this.addAnnouncerForm.reset()
        console.log('Create success')
      }
      else {
        this.addAnnouncerError = true
        console.log(res.code)
        switch (res.code) {
          case "fail":
            this.addAnnouncerErrorMessage = "Failed to add data to firestore database."
            break
          case "reset/auth/invalid-email":
            this.addAnnouncerErrorMessage = "Invalid email."
            break
          case "reset/auth/missing-android-pkg-name" :
            this.addAnnouncerErrorMessage = "An Android package name must be provided if the Android app is required to be installed."
            break
          case "reset/auth/missing-continue-uri" :
            this.addAnnouncerErrorMessage = "A continue URL must be provided in the request."
            break
          case "reset/auth/missing-ios-bundle-id" :
            this.addAnnouncerErrorMessage = "An iOS Bundle ID must be provided if an App Store ID is provided."
            break
          case "reset/auth/invalid-continue-uri" :
            this.addAnnouncerErrorMessage = "The continue URL provided in the request is invalid."
            break
          case "reset/auth/unauthorized-continue-uri" :
            this.addAnnouncerErrorMessage = "The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console."
            break
          case "reset/auth/user-not-found" :
            this.addAnnouncerErrorMessage = "User not found."
            break
          case "create/auth/email-already-in-use" :
            this.addAnnouncerErrorMessage = "This email has been registered."
            break
          case "create/auth/invalid-email" :
            this.addAnnouncerErrorMessage = "Invalid email."
            break
          case "create/auth/operation-not-allowed" :
            this.addAnnouncerErrorMessage = "Register via Email/Password accounts are not enabled."
            break
          case "create/auth/weak-password" :
            this.addAnnouncerErrorMessage = "The password is not strong enough."
            break
        }
      }
    }).catch(err => {
      console.log(err)
    })
  }

  deleteAnnouncer() {
    //future function
  }

  resetPasswortd() {
    //future function
  }

  getCSVData(event: FileList) {

    const csv = event.item(0)
    
    if (!csv.name.endsWith('.csv')) {
      console.log('This is not csv.')
      return
    }

    let reader = new FileReader()
    reader.readAsText(csv)

    reader.onload = () => {

      let csvData = reader.result
      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/)

      let headerRow = this.getHeaderArrays(csvRecordsArray)
      
      this.records = this.getDataRecordsArray(csvRecordsArray, headerRow.length)

    }

  }

  getDataRecordsArray(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    console.log(csvRecordsArray)
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: StudentRecord = new StudentRecord();
        csvRecord.email = curruntRecord[0].trim();
        csvRecord.identityNumber = curruntRecord[1].trim();
        csvRecord.name = curruntRecord[2].trim();
        csvRecord.faculty = curruntRecord[3].trim();
        csvRecord.majority = curruntRecord[4].trim();
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  getHeaderArrays(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.records = [];
  }

  async addAllStudent() {
    this.isStudentAdding = true
    let failStudentAdded = []

    for (let student of this.records) {
      let followGroup = this.getSubscribeGroup(student.faculty, student.majority)
      let data = {
        email: student.email,
        identityNumber: student.identityNumber,
        name: student.name,
        faculty: student.faculty,
        majority: student.majority,
        isStudent: true,
        group: followGroup,
        created: firebase.firestore.FieldValue.serverTimestamp()
      }

      this.userService.addStudentUser(data).then(res => {
        console.log(res)
        if (res) {
          failStudentAdded.push(data)
        }
      })

    }

    this.records = failStudentAdded
    this.isStudentAdding = false

  }

  private getSubscribeGroup(faculty, majority) {
    let subscribeGroup = []

    if (faculty === "Science and Technology") {
      subscribeGroup.push('101')
      if (majority === "Analytical Science") {subscribeGroup.push('1011')}
      else if (majority === "Chemistry") {subscribeGroup.push('1012')}
      else if (majority === "Computer Science") {subscribeGroup.push('1013')}
      else if (majority === "Food Safety Management and Technology") {subscribeGroup.push('1014')}
      else if (majority === "Television and Radio Broadcast Technology") {subscribeGroup.push('1015')}
      else if (majority === "Photography and Cinematography") {subscribeGroup.push('1016')}
      else if (majority === "Printing Technology") {subscribeGroup.push('1017')}
      else if (majority === "Furniture Technology and Design") {subscribeGroup.push('1018')}
      else if (majority === "Industrial Product Design") {subscribeGroup.push('1019')}
    }
    else if (faculty === "Liberal Art") {
      subscribeGroup.push('102')
      if (majority === "Tourism") {subscribeGroup.push('1021')}
      else if (majority === "Hotel") {subscribeGroup.push('1022')}
      else if (majority === "English for Communication") {subscribeGroup.push('1023')}
      else if (majority === "Japanese") {subscribeGroup.push('1024')}
      else if (majority === "Chinese for Communication") {subscribeGroup.push('1025')}
      else if (majority === "Product Development and Thai Local Wisdom") {subscribeGroup.push('1026')}
    }
    else if (faculty === "Technical Education and Industrial Science") {
      subscribeGroup.push('103')
      if (majority === "Industrial Engineering") {subscribeGroup.push('1031')}
      else if (majority === "Mechanical Engineering") {subscribeGroup.push('1032')}
      else if (majority === "Computer Technology") {subscribeGroup.push('1033')}
      else if (majority === "Industrial Technology") {subscribeGroup.push('1034')}
    }
    else if (faculty === "Engineering") {
      subscribeGroup.push('104')
      if (majority === "Quality Management") {subscribeGroup.push('1041')}
      else if (majority === "Civil Engineering") {subscribeGroup.push('1042')}
      else if (majority === "Surveying Engineering") {subscribeGroup.push('1043')}
      else if (majority === "Mechanical Engineering") {subscribeGroup.push('1044')}
      else if (majority === "Industrial Engineering") {subscribeGroup.push('1045')}
      else if (majority === "Chemical Engineering") {subscribeGroup.push('1046')}
      else if (majority === "Electrical Engineering") {subscribeGroup.push('1047')}
      else if (majority === "Electronics and Telecommunication Engineering") {subscribeGroup.push('1048')}
    }
    else if (faculty === "Business Administration") {
      subscribeGroup.push('105')
      if (majority === "Finance") {subscribeGroup.push('1051')}
      else if (majority === "Business English") {subscribeGroup.push('1052')}
      else if (majority === "Property Valuation") {subscribeGroup.push('1053')}
      else if (majority === "Information Technology and Computer Science") {subscribeGroup.push('1054')}
      else if (majority === "Management") {subscribeGroup.push('1055')}
      else if (majority === "Marketing") {subscribeGroup.push('1056')}
      else if (majority === "Information Technology: Business Information Technology") {subscribeGroup.push('1057')}
      else if (majority === "Accounting") {subscribeGroup.push('1058')}
    }
    else if (faculty === "Home Economics Technology") {
      subscribeGroup.push('106')
      if (majority === "Food and Nutrition") {subscribeGroup.push('1061')}
      else if (majority === "Industrial Textiles and Patterns") {subscribeGroup.push('1062')}
      else if (majority === "Food Business") {subscribeGroup.push('1063')}
      else if (majority === "Fashion Design") {subscribeGroup.push('1064')}
      else if (majority === "Food Science Technology") {subscribeGroup.push('1065')}
      else if (majority === "Food Product Development") {subscribeGroup.push('1066')}
      else if (majority === "Home Economics") {subscribeGroup.push('1067')}
    }
    else if (faculty === "Textile Industry") {
      subscribeGroup.push('107')
      if (majority === "Textile and Clothing") {subscribeGroup.push('1071')}
      else if (majority === "Textile and Fashion Design") {subscribeGroup.push('1072')}
      else if (majority === "Textile Engineering") {subscribeGroup.push('1073')}
      else if (majority === "Chemical Engineering") {subscribeGroup.push('1074')}
    }
    else if (faculty === "International Collage") {
      subscribeGroup.push('108')
      if (majority === "Marketing") {subscribeGroup.push('1081')}
      else if (majority === "Information Systems") {subscribeGroup.push('1082')}
      else if (majority === "International Business Management") {subscribeGroup.push('1083')}
      else if (majority === "Accounting") {subscribeGroup.push('1084')}
      else if (majority === "Tourism and Hospitality") {subscribeGroup.push('1085')}
      else if (majority === "The Management of local and international businesses, Marketing and International Marketing") {subscribeGroup.push('1086')}
      else if (majority === "Hotel or public relations staff") {subscribeGroup.push('1087')}
      else if (majority === "Information Officer in the public or private sector") {subscribeGroup.push('1088')}
      else if (majority === "Staff in the tourism industry") {subscribeGroup.push('1089')}
    }
    return subscribeGroup
  }

}