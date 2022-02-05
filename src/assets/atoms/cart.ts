import { FadeToggle } from "../other/utils";
import Component from "../types/component";

/**
 * Defines a social share element
 */
const Cart: Component = {
  elements: document.getElementsByClassName('atom-cart-icon') as HTMLCollectionOf<HTMLElement>,
  init(): void {
    if( ! this.elements || this.elements.length < 1) {
        return;
    }
            
    for(const cartElement of this.elements) {
      this.cartHandler(cartElement);
    }   
  },

  /**
   * Handles any cart related actions
   * 
   * @param cart HTMLElement The passed cart element
   */
  cartHandler(cart: HTMLElement): void {
    cart.addEventListener('click', (event) => {
      event.preventDefault();
      const cartContent = cart.nextElementSibling as HTMLElement;
      FadeToggle(cartContent);
    });
  }

}

export default Cart;