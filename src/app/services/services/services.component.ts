import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  services: Array<any>;

  constructor(
    public userService: UserService,
    public db: AngularFirestore,
    public activatedRoute: ActivatedRoute,
    public router: Router) {}

    get isLogged(): boolean{
      return this.userService? this.userService.isLogged : false;
    }
  
    get isAdmin(): boolean{
      return this.userService? this.userService.isAdmin : false;
    }

    
  ngOnInit(): void { 
    this.getData();
  }

  getData(){
    this.getServices()
    .subscribe(result => {
      this.services = result ;      
    })
  }

  getServices(){
    return this.db.collection('services').snapshotChanges();
  }

  deleteServiceHandler(serviceId){
    this.deleteDevice(serviceId)
    .then(
      res => {
        this.router.navigate(['/services']);
      },
      err => {
        console.log(err);
      }
    )
  }

  deleteDevice(serviceKey){
    return this.db.collection('services').doc(serviceKey).delete();
  }
}