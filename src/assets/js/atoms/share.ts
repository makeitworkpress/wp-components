import { FadeIn, FadeOut } from "../other/utils";
import Component from "../types/component";

/**
 * Defines a social share element
 */
const share: Component = {
    elements: document.getElementsByClassName('atom-share-fixed') as HTMLCollectionOf<HTMLElement>,
    init(): void {
        if( ! this.elements || this.elements.length < 1) {
            return;
        }
        
        this.setupShare();
    },

    /**
     * Setup our sharing functionalities
     */
    setupShare(): void {

        if( document.documentElement.scrollHeight < window.innerHeight ) {
            return;
        }

        let scrolled = false;

        window.addEventListener('scroll', () => {
            let scrollPosition = window.scrollY;
            
            if( scrolled ) {
                return;
            }

            if( scrollPosition > 5 ) {
                for( const element of this.elements ) {
                    FadeIn(element);
                }
                scrolled = true;
            } else {
                scrolled = false;
                for( const element of this.elements ) {
                    FadeOut(element);
                }                
            }
        });

    }

}