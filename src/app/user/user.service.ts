import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import { IUser } from '../shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: IUser | null;

  get isLogged(): boolean { return !!this.currentUser }
  get isAdmin(): boolean { return !!this.currentUser? this.currentUser.isAdmin : false}

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore) { }

  doRegister(value){
    return new Promise<any>((resolve, reject) => {      
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {      
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        this.currentUser = {email: res.user.email, isAdmin: false};  
        this.getData(); 
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogout(){
    return new Promise<any>((resolve, reject) => {
      if(this.currentUser){
        this.currentUser = null
        resolve();
      }
      else{
        reject();
      }
    });
  }

  createUser(value){
    return this.db.collection('users').add({
      email: value.email,
      isAdmin: false
    });
  }


  getData(): void{
    this.getUsers()
    .subscribe(users => { 
      const result = users.filter(user => user['email']===this.currentUser.email)[0];
      this.currentUser = { email: result['email'], isAdmin: result['isAdmin']}
                           })
  }


  getUsers(){
    return this.db.collection('users').valueChanges();
  }
}
