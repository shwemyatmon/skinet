import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IBasket, IBasketItem, Basket, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
baseUrl = environment.apiUrl;
private basketSource = new BehaviorSubject<IBasket>(null);
basket$ = this.basketSource.asObservable();
private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
basketTotal$ = this.basketTotalSource.asObservable();


  constructor(private http: HttpClient) {

  }

  // tslint:disable-next-line: typedef
  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id)
    .pipe(
      map((basket: IBasket) => {
         this.basketSource.next(basket);
         this.calculateTotals();
      })
     );
  }

  // tslint:disable-next-line: typedef
  setBasket(basket: IBasket) {
     return this.http.post(this.baseUrl + 'basket', basket).subscribe(
          (response: IBasket) => {
                this.basketSource.next(response);
                this.calculateTotals();
          }, error => {
            console.log(error);
          }
        );
  }

  // tslint:disable-next-line: typedef
  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  // tslint:disable-next-line: typedef
  addItemToBasket(item: IProduct, quantity = 1) {
    console.log(item);
    const itemTotAdd: IBasketItem = this.mapProuctItemToBasketItem(item, quantity);
    console.log(itemTotAdd);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrupdateitem(basket.items, itemTotAdd, quantity);
    this.setBasket(basket);
  }

  // tslint:disable-next-line: typedef
  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }


  // tslint:disable-next-line: typedef
  decrementItemQuantity(item: IBasketItem) {
    console.log(item);
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
          basket.items[foundItemIndex].quantity--;
          this.setBasket(basket);
    }
    else {
        this.removeItemFromBasket(item);
    }
  }

  // tslint:disable-next-line: typedef
  removeItemFromBasket(item: IBasketItem) {
   const basket = this.getCurrentBasketValue();
   if (basket.items.some(x => x.id === item.id)) {
       basket.items = basket.items.filter(i => i.id !== item.id);
       if (basket.items.length > 0) {
         this.setBasket(basket);
       }
       else {
         this.deleteBasket(basket);
       }
   }
  }
  // tslint:disable-next-line: typedef
  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(
      () => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
      }, error => {
        console.log(error);
      }
    );
  }

  // tslint:disable-next-line: typedef
  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subtotal = basket.items.reduce((a, b) => (b.quantity * b.price) + a, 0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping, subtotal, total});
  }
  private addOrupdateitem(items: IBasketItem[], itemTotAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemTotAdd.id);
    if (index === -1){
      itemTotAdd.quantity = quantity;
      items.push(itemTotAdd);
    }
    else {
      items[index].quantity = quantity;
    }
    return items;
  }
  private createBasket(): IBasket {
    const baseket = new Basket();
    localStorage.setItem('basket_id', baseket.id);
    return baseket;
  }
  private mapProuctItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price : item.price,
      pictureUrl : item.pictureUrl,
      quantity ,
      brand : item.productBrand,
      type : item.productType
    };
  }
}


