import * as firebase from 'firebase'
export interface Group {
    id: string
    name: string
    owner: string
    privacy: string
    password: string
    modified: firebase.firestore.Timestamp
    created: firebase.firestore.Timestamp
    subscriber: string[]
}
