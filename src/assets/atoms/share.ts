import { FadeIn, FadeOut } from "../other/utils";
import Component from "../types/component";

/**
 * Defines a social share element
 */
const Share: Component = {
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

            if( scrollPosition > 5 && ! scrolled ) {
                for( const element of this.elements ) {
                    FadeIn(element);
                }
                scrolled = true;
            } else if(scrollPosition < 5 && scrolled) {
                scrolled = false;
                for( const element of this.elements ) {
                    FadeOut(element);
                }                
            }
                     
        });

    }

}

export default Share;