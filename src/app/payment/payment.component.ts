import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';
declare var $: any;
declare var Cleave: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  cardImage: string = "/assets/payment-logos/15.png";
  cleave: any;
  constructor(public paymentService:PaymentService,public router: Router,) { }

  ngOnInit() {
    this.cleave = new Cleave("input#cardNumber", {
      creditCard: true,
      onCreditCardTypeChanged: (type:any) => {
        console.log(type);
        this.paymentService.cartType = type;
        if (type == "mastercard") {
          this.cardImage = "/assets/payment-logos/16.png";
        } else if (type == "visa") {
          this.cardImage = "/assets/payment-logos/2.png";
        } else if (type == "unionPay") {
          this.cardImage = "/assets/payment-logos/3.png";
        } else if (type == "mir") {
          this.cardImage = "/assets/payment-logos/4.png";
        } else if (type == "amex") {
          this.cardImage = "/assets/payment-logos/5.png";
        } else if (type == "dankort") {
          this.cardImage = "/assets/payment-logos/6.png";
        } else if (type == "diners") {
          this.cardImage = "/assets/payment-logos/7.png";
        } else if (type == "maestro") {
          this.cardImage = "/assets/payment-logos/8.png";
        } else if (type == "uatp") {
          this.cardImage = "/assets/payment-logos/9.png";
        } else if (type == "jcb") {
          this.cardImage = "/assets/payment-logos/10.png";
        } else if (type == "jcb15") {
          this.cardImage = "/assets/payment-logos/10.png";
        } else if (type == "discover") {
          this.cardImage = "/assets/payment-logos/11.png";
        } else if (type == "instapayment") {
          this.cardImage = "/assets/payment-logos/12.png";
        } else if (type == "unknown") {
          this.cardImage = "/assets/payment-logos/15.png";
        }
      },
    });
    $(document).on("keyup", "input#cardExpiry", (e:any) => {
      var p = $("input#cardExpiry").val();
      console.log("22", p.length == 2, p.length, p);
      if (p.length == 2) {
        console.log("22");
        if (e.keyCode == 8) {
          console.log("backspace");
        } else {
          $("input#cardExpiry").val(p + "/");
        }
      }
      console.log("cardExpiry", p);
    });
    $(document).on("keyup", "input#cardcvv", (e:any) => {
      if (this.paymentService.cartType == "amex") {
        $("input#cardcvv").attr("maxlength", "4");
      } else {
        $("input#cardcvv").attr("maxlength", "3");
      }
    });
    
  }
  onSubmit(){
    this.paymentService.cardNumber = this.cleave.getRawValue();
    var type = this.paymentService.cartType;
    console.log(this.paymentService.cardNumber,this.paymentService.cardName,this.paymentService.cardExpiry,this.paymentService.cardcvv,this.paymentService.amount);
    const carddate = this.paymentService.cardExpiry ? this.paymentService.cardExpiry.split("/") :'';
    var dat = new Date();
    var startyear = dat.getFullYear();
    var mon = dat.getMonth();
    var newYear = startyear.toString().slice(2, 4);
    var currentMonth = mon+1;
    console.log(mon,currentMonth,startyear, parseInt(newYear));
    if(this.paymentService.cardName){
      if(this.validateCard(type)){
        if (carddate && carddate.length == 2) {
          if (parseInt(carddate[0]) <= 12 && parseInt(carddate[1]) >= parseInt(newYear)) {
            if(parseInt(carddate[1]) == parseInt(newYear)){
              if(parseInt(carddate[0]) >= currentMonth){
                if(this.paymentService.amount){
                  this.saveData();
                }else{
                  this.paymentService.showToast("error","","Please enter amount you pay!");
                  return 0;
                }
  
              }else{
                this.paymentService.showToast("error","","Please enter correct card expiry month and year");
                return 0;
              }
            }else{
              if(this.paymentService.amount){
                this.saveData();
              }else{
                this.paymentService.showToast("error","","Please enter amount you pay!");
                return 0;
              }
            }

          }else{
            this.paymentService.showToast("error","","Please enter correct card expiry month and year");
            return 0;
          }
        }else{
          this.paymentService.showToast("error","","Please enter correct card expiry month and year");
          return 0;
        }
  
      }else{
        this.paymentService.showToast("error", "", "Please enter 16 digits card number");
        return 0;
      }
    }else{
      this.paymentService.showToast("error",'','Please enter your name');
    }
  }

  saveData(){
    const carddate = this.paymentService.cardExpiry ? this.paymentService.cardExpiry.split("/") :'';
    let userData = {
      cardName:this.paymentService.cardName,
      cardNumber: this.paymentService.cardNumber,
      "expiration-year": carddate[1],
      "expiration-month": carddate[0],
      cvv: parseInt(this.paymentService.cardcvv),
      amount: this.paymentService.amount,
    };
    this.paymentService.saveToDb("userData",userData);
    this.paymentService.showToast("success","Your payment is successful paid");
    this.router.navigate(["/home"]);
  }

  validateCard(type:any){
    if (type == "mastercard") {
      if (
        /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
          this.paymentService.cardNumber
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else if (type == "visa") {
      if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(this.paymentService.cardNumber)) {
        return true;
      } else {
        return false;
      }
    } else if (type == "unionPay") {
      if (/^(62[0-9]{14,17})$/.test(this.paymentService.cardNumber)) {
        return true;
      } else {
        return false;
      }
    } else if (type == "mir") {
      if(this.paymentService.cardNumber && this.paymentService.cardNumber.length <= 16 && this.paymentService.cardNumber.length > 12){
        return true;
      }else{
        return false;
      }
    } else if (type == "amex") {
      if (/^3[47][0-9]{13}$/.test(this.paymentService.cardNumber)) {
        return true;
      } else {
        return false;
      }
    } else if (type == "dankort") {
      if(this.paymentService.cardNumber && this.paymentService.cardNumber.length <= 16 && this.paymentService.cardNumber.length > 12){
        return true;
      }else{
        return false;
      }
    } else if (type == "diners") {
      if (/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(this.paymentService.cardNumber)) {
        return true;
      } else {
        
        return false;
      }
    } else if (type == "maestro") {
      if (
        /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/.test(
          this.paymentService.cardNumber
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else if (type == "uatp") {
      if(this.paymentService.cardNumber && this.paymentService.cardNumber.length <= 16 && this.paymentService.cardNumber.length > 12){
        return true;
      }else{
        return false;
      }
    } else if (type == "jcb") {
      if (/^(?:2131|1800|35\d{3})\d{11}$/.test(this.paymentService.cardNumber)) {
        return true;
      } else {
        
        return false;
      }
    } else if (type == "jcb15") {
      if (/^(?:2131|1800|35\d{3})\d{11}$/.test(this.paymentService.cardNumber)) {
        return true;
      } else {
        
        return false;
      }
    } else if (type == "discover") {
      if (
        /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/.test(
          this.paymentService.cardNumber
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else if (type == "instapayment") {
      if (/^63[7-9][0-9]{13}$/.test(this.paymentService.cardNumber)) {
        return true;
      } else {
        return false;
      }
    } else if (type == "unknown") {
      return false;
    }
    else{
      return false;
    }
  }

}