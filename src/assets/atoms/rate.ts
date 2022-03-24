import { AjaxApi, FadeIn, FadeOut } from "../other/utils";
import Component from "../types/component";

/**
 * Defines the custom header scripts
 */
const Rate: Component = {
    elements: document.getElementsByClassName('atom-rate') as HTMLCollectionOf<HTMLElement>,
    init() {

        if( ! this.elements || this.elements.length < 1) {
            return;
        }

        for( const element of this.elements ) {
            this.setupClickHandler(element); 
        }
    },

    /**
     * Setup the click handler for sending rating requests to the back-end
     * @param element The specific rating element
     */
    setupClickHandler(element: HTMLElement): void {
        let isRating = false;
        const ratingAnchor = element.querySelector('.atom-rate-can .atom-rate-anchor') as HTMLAnchorElement;

        ratingAnchor.addEventListener('click', async (event) => {
            event.preventDefault();

            if( isRating ) {
                return;
            }

            const { id = '', max = 5, min = 1 } = element.dataset;
            const starElements = ratingAnchor.querySelectorAll('.atom-rate-star');
            let rating: number = 0;
            
            for( const starElement of starElements ) {
                if( getComputedStyle(starElement).fontWeight === '900' ) {
                    rating++;
                }
            }
          
            const loadingSpinner = element.querySelector('.atom-rate-can .fa-circle-notch') as HTMLAnchorElement;
            FadeIn(loadingSpinner, 'inline-block');

            // Actual rating functions
            isRating = true;

            const response = await AjaxApi<{ success: boolean, data: { rating: number, count: number } }>({
                action: 'public_rate',
                id: id,
                max: +max,
                min: +min,
                rating: rating
            });

            // Modify our stars according to the rating
            if( response.success && response.data.rating ) {
                this.updateStarElementClasses(starElements, response.data.rating);
            }

            setTimeout( () => {
                FadeOut(loadingSpinner);
                isRating = false;
            }, 1500)

        });

    },

    /**
     * Updates the star element classes according to the new rating, without needing to replace the element
     */
    updateStarElementClasses(starElements: NodeListOf<Element>, rating: number) {
        
        let starKey = 0;
        let newRating = Math.ceil(rating);

        for( const starElement of starElements ) {
            starKey++;      
            if( starKey < newRating ) {
                starElement.classList.add('fas');
                starElement.classList.remove('far');
            } else if( starKey === newRating ) {
                const fraction = rating - Math.floor(rating) 
                if( fraction > 0.25 && fraction < 0.75 ) {
                    starElement.classList.add('fas', 'fa-star-half');
                    starElement.classList.remove('far', 'fa-star');                            
                } else if( fraction > 0.75 ) {
                    starElement.classList.remove('far', 'fa-star-half');
                    starElement.classList.add('fas');
                }
            } else {
                starElement.classList.add('far', 'fa-star');
                starElement.classList.remove('fas', 'fa-star-half');                      
            }

        }

    }
};

export default Rate;