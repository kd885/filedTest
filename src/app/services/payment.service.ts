import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StorageMap } from '@ngx-pwa/local-storage';
import { ApiService } from './api.service';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  cartType: any;
  cardNumber: any;
  cardExpiry: any;
  cardcvv: any;
  cardName: any;
  amount: any;
  userData: any;
  fakeUserData: any;
  body:any;
  title:any;

  constructor(private toastr: ToastrService,private storage: StorageMap,public api:ApiService) { }
//show toast method 
  showToast(type:any, message?: any, title?: any, options?: any) {
    let msg = message ? message : "";
    switch (type) {
      case "success":
        this.toastr.success(title, msg, options);
        break;
      case "error":
        this.toastr.error(title, msg, options);
        break;
      case "warning":
        this.toastr.warning(title, msg, options);
        break;
      case "info":
        this.toastr.info(title, msg, options);
        break;
    }
  }
  //Save data to local stoage for state management method 
  saveToDb(key:any, data:any) {
    return new Promise((resolve, reject) => {
      console.log("called");
      this.storage.set(key, data).subscribe(() => {
        let dataSaved = {
          [key]: data,
        };
        resolve(dataSaved);
      });
    });
  }
  getData(){
    this.api.getWithAbsoluteUrl('https://jsonplaceholder.typicode.com/posts').subscribe((res:any)=>{
      console.log(res); 
      this.fakeUserData= res;
    }, (err)=>{
      console.log(err);
    });
    
  }
  setUserData(){
    if(this.title){
      if(this.body){
        let body={
          title: this.title,
          body: this.body,
          userId: 1,
        }
       let headers = {
          'Content-type': 'application/json; charset=UTF-8',
        }
        this.api.postWithAbsoluteUrl('https://jsonplaceholder.typicode.com/posts',body,headers).subscribe((res:any)=>{
          console.log(res); 
          this.getData();
          this.showToast("success","successfully submitted");
          $('#postfake').modal('hide');
          this.title = '';
          this.body = '';
          
        }, (err)=>{
          console.log(err);
        });
      }
      else{
        this.showToast("error","please enter body");
        return 0;
      }
    }else{
      this.showToast("error","please enter title");
      return 0;
    }
  }
}
