import { FadeIn, FadeOut } from '../other/utils';
import Component from '../types/component';

const Scroll: Component = {
    elements: document.getElementsByClassName('atom-scroll') as HTMLCollectionOf<HTMLAnchorElement>,
    init() {
        if( ! this.elements || this.elements.length < 1) {
            return;
        }

        for( const element of this.elements ) {
            this.setupScrollHandler(element);
        } 
        
        this.setupwindowHandler();
    },
    
    /**
     * Setup our scroll button
     * @param element The scroll element
     */
    setupScrollHandler(element: HTMLAnchorElement): void {
        const parent = element.parentElement as HTMLElement;
        let destination: number;

        element.addEventListener('click', (event) => {
            event.preventDefault();

            if( element.classList.contains('atom-scroll-top') ) {
                destination = 0;
            } else {
                destination = parent?.clientHeight + parent.getBoundingClientRect().top + window.scrollY;
            }

            window.scrollTo({ top: destination, behavior: 'smooth'});

        });
    },

    /**
     * Setup the handler for the window functions
     */
    setupwindowHandler() {
        window.addEventListener('scroll', () => {
            let scrollPosition = window.scrollY;
            

            for( const element of this.elements ) {
                if( element.classList.contains('atom-scroll-top') ) {
                    if( scrollPosition > window.innerHeight) {
                        FadeIn(element);
                    } else {
                        FadeOut(element);
                    }
                } else {
                    let buttonPosition = element.getBoundingClientRect().top + scrollPosition;
                    if( scrollPosition > buttonPosition ) {
                        FadeOut(element);
                    } else {
                        FadeIn(element);    
                    }
                }
            }
        });
    }
}

export default Scroll;