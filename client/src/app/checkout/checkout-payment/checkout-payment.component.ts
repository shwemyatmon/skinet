import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { BasketService } from 'src/app/basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder } from 'src/app/shared/models/order';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
@Input() checkoutForm: FormGroup;

  constructor(private checkoutService: CheckoutService,
              private basketService: BasketService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    const createToOrder = this.getOrderToCreate(basket);

    this.checkoutService.createOrder(createToOrder).subscribe((order: IOrder) => {
      this.toastr.success('Order created successfully');
      this.basketService.deleteLocalBasket(basket.id);
      const navigationExtras: NavigationExtras = {state : order};
      this.router.navigate(['checkout/success'], navigationExtras);
    }, error => {
      console.log(error);
    });
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
