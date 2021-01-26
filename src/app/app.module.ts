import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaymentComponent } from './payment/payment.component';
import { HomeComponent } from './home/home.component';
import {
  ToastrModule,
  ToastNoAnimation,
  ToastNoAnimationModule
} from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { PostComponent } from './post/post.component';
import { HttpClientModule } from '@angular/common/http';
 
// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}
 

@NgModule({
  declarations: [
    AppComponent,
    PaymentComponent,
    HomeComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LottieModule.forRoot({ player: playerFactory }),
    HttpClientModule,
    ToastNoAnimationModule.forRoot({
      timeOut: 2000,
      maxOpened: 1,
      autoDismiss: true,
      newestOnTop: true,
      preventDuplicates: true,
      positionClass: 'toast-bottom-center',
      easeTime: 0,
      extendedTimeOut: 0
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
