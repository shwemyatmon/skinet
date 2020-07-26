import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Skinet';

  constructor(private basketService: BasketService,
              private accountServcie: AccountService){}

  ngOnInit(): void {
  this.loadBasket();
  this.loadCurrentUser();
  }

  // tslint:disable-next-line: typedef
  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
        this.basketService.getBasket(basketId).subscribe(() => {
          console.log('initialized basket');
        }, error => {
          console.log(error);
        });
      }
  }

  // tslint:disable-next-line: typedef
  loadCurrentUser() {
    const token = localStorage.getItem('token');
    this.accountServcie.loadCurrentUser(token).subscribe(
            () => {
              console.log('loaded user');
            }, error => {
              console.log(error);
            }
          );
  }
}
