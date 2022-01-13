/**
 * Defines the custom header scripts
 */
import Component from "../types/component";
import { SlideToggle, FadeToggle } from "../other/utils";

const Header: Component = {

    elements: document.getElementsByClassName('molecule-header') as HTMLCollectionOf<HTMLElement>,
    carts: document.querySelectorAll('.molecule-header .atom-cart-icon') as NodeListOf<HTMLElement>,
    position: window.scrollY,

    init() {
        
        if( ! this.elements || this.elements.length < 1 ) {
            return;
        }
        for(const header of this.elements) {
            this.cssHandler(header);   
            this.scrollHandler(header); 
        }

        if( ! this.carts || this.carts.length < 1 ) {
            return;
        }        
        for(const cart of this.carts) {
            this.cartHandler(cart);
        }        
    },

    /**
     * Set-up necessary css adjustments
     * 
     * @param header HTML Element The passed header
     */
    cssHandler(header: HTMLElement): void {

        /** 
         * Adapts the top-padding for the main section that follows the header, so it won't overlap
         */
        if( header.classList.contains('molecule-header-fixed') ) {
            const height: number = header.clientHeight;
            const mainElement = header.nextElementSibling as HTMLElement;
            
            if( mainElement.tagName === 'main') {
                mainElement.style.paddingTop = height + 'px';
            }

        }
    },

    /**
     * Handles any scroll-related events to the selected header
     * @param header HTMLElement The given header
     */
    scrollHandler(header: HTMLElement): void {

        let up: boolean = false;

        window.addEventListener('scroll', () => {
            let positionFromTop:number = window.scrollY;

            if( header.classList.contains('molecule-header-fixed') ) {
                if( positionFromTop > 5 ) {
                    header.classList.add('molecule-header-scrolled');
                    header.classList.remove('molecule-header-top');
                } else {
                    header.classList.remove('molecule-header-scrolled');
                    header.classList.add('molecule-header-top');
                }
            }

            if( header.classList.contains('molecule-header-headroom') ) {
                if( positionFromTop > this.position && ! up ) {
                    up = ! up;
                    SlideToggle(header);
                } else if( positionFromTop < this.position && up ) {
                    up = ! up;
                    SlideToggle(header);
                }

                this.position = positionFromTop;
            }
        });
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

};   



export default Header;