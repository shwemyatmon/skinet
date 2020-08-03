import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order';
import { OrdersService } from '../orders/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: IOrder[];

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.getOrdersForUser();
  }

  // tslint:disable-next-line: typedef
  getOrdersForUser() {
  this.ordersService.getOrderForUser().subscribe((orders: IOrder[]) => {
     this.orders = orders;
  }, error => [
    console.log(error)
  ]);
  }

}
