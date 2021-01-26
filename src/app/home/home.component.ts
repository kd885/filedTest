import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { PaymentService } from '../services/payment.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userData: any;
  public options: AnimationOptions = {
    path: 'assets/animation.json',
  };


  constructor(private paymentService:PaymentService,private storage: StorageMap) { }

  ngOnInit(): void {
    this.storage.get('userData').subscribe((user) => {
      this.userData = user;
    });

  }
  clear(){
    this.storage.delete('userData').subscribe(() => {
      this.userData = undefined;
    });
  }
  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

}
