import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { BasketService } from 'src/app/basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder } from 'src/app/shared/models/order';
import { Router, NavigationExtras } from '@angular/router';

declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
@Input() checkoutForm: FormGroup;
@ViewChild('cardNumber', {static: true}) cardNumberElement: ElementRef;
@ViewChild('cardExpiry', {static: true}) cardExpiryElement: ElementRef;
@ViewChild('cardCvc', {static: true}) cardCvcElement: ElementRef;
stripe: any;
cardNumber: any;
cardExpiry: any;
cardCvc: any;
cardErrors: any;
cardHandler = this.onChange.bind(this);
loading = false;
cardNumberValid = false;
cardExpiryValid = false;
cardCvcValid = false;


  constructor(private checkoutService: CheckoutService,
              private basketService: BasketService,
              private toastr: ToastrService,
              private router: Router) { }

  ngAfterViewInit(): void {
    this.stripe = Stripe('pk_test_51HBYk8LMJhWoiMLa8djl90CEFt8yZUk98njGtfIKHhvomtYg2u9JUyGwICHQn4NllZJnlaNPIf5e1y36XPuOUo9K00uph4WbIr');
    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }

  // tslint:disable-next-line: typedef
  ngOnDestroy() {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  // tslint:disable-next-line: typedef
  onChange(event) {

    if (event.error) {
        this.cardErrors = event.error.message;
    }
    else {
      this.cardErrors = null;
    }
    console.log(event.elementType);
    switch (event.elementType) {
      case 'cardNumber':
               this.cardNumberValid = event.complete;
               console.log(this.cardNumberValid);
               break;
      case 'cardExpiry' :
               this.cardExpiryValid = event.complete;
               console.log(this.cardExpiryValid);
               break;
      case 'cardCvc' :
              this.cardCvcValid = event.complete;
              console.log(this.cardCvcValid);
              break;
    }
  }

  // tslint:disable-next-line: typedef
  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();

    try{
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);
      if (paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = {state : createdOrder};
        this.router.navigate(['checkout/success'], navigationExtras);
          }
          else {
            this.toastr.error(paymentResult.error.message);
          }
      this.loading = false;
     }
     catch (error) {
        console.log(error);
        this.loading = false;
     }

   }


  // tslint:disable-next-line: typedef
  private async confirmPaymentWithStripe(basket: IBasket) {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method : {
        card : this.cardNumber,
        billing_details : {
          name : this.checkoutForm.get('paymentForm').get('nameOnCard').value
        }
      }
    });
  }


  // tslint:disable-next-line: typedef
  private async createOrder(basket: IBasket) {
    const createToOrder = this.getOrderToCreate(basket);
    return this.checkoutService.createOrder(createToOrder).toPromise();
  }
  // tslint:disable-next-line: typedef
  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };

  }

}
