import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { AdminService } from '../admin.service';


@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['../../../form-style.css', './add-device.component.css']
})
export class AddDeviceComponent implements OnInit {

  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  errorMessage: string = '';
  successMessage: string = '';
  imageUrl: string = '';

  constructor(
    private router: Router,
    private storage: AngularFireStorage,
    private adminService: AdminService
    ) { }

  ngOnInit(): void {
  }

  onFileSelected(event) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `DeviceImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`DeviceImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  addDeviceHandler(formData){
    formData['imageUrl']= this.fb;
    this.adminService.addDevice(formData)
    .then(res => {
      this.errorMessage = "";
      this.successMessage = "Device has been added successfully!";
      this.router.navigate(['/devices']);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = "";
    })
  }
}