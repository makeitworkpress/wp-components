import { AjaxApi, GetElementSiblings, ToggleClass } from "../other/utils";
import Component from "../types/component";
import { SiblingTypes } from "../types/sibling-types";

/**
 * Defines the custom header scripts
 */
const Rate: Component = {
    elements: document.getElementsByClassName('.atom-rate') as HTMLCollectionOf<HTMLElement>,
    init() {
        this.setupMouseHandlers();
        for( const element in this.elements ) {
            this.setupClickHandler(element); 
        }
    },

    /**
     * Setups the handlers for mouseenter and mouseleave events
     */
    setupMouseHandlers() {

        /**
         * Entering one fo the stars in the element responsible for the rating
         */
        document.body.addEventListener('mouseenter', (event) => {

            const starElement = event.currentTarget as HTMLElement;

            if( ! starElement.classList.contains('atom-rate-star') ) {
                return;
            }

            // Attems at the left side of the mouse
            ToggleClass(starElement, ['fa-star', 'fa-star-o']);

            const previousStarElements = GetElementSiblings(starElement, SiblingTypes.Previous);
            for( let previousStarElement of previousStarElements ) {
                ToggleClass(previousStarElement, ['fa-star', 'fa-star-o'])
            }

            // Right side
            const nextStarElements = GetElementSiblings(starElement, SiblingTypes.Next);
            for( let nextStarElement of nextStarElements ) {
                nextStarElement.classList.add('fa-star-o');
                nextStarElement.classList.remove('fa-star');
            }         

        }, true);

        /**
         * Leaving the Anchor element responsible for the rating
         */
        document.body.addEventListener('mouseleave', (event) => {

            const ratingElement = event.currentTarget as HTMLAnchorElement;
            const starElements = ratingElement.getElementsByTagName('i');

            if( ratingElement.className !== 'atom-rate-rate') {
                return;
            }

            for(const star of starElements) {
                ToggleClass(star, ['fa-star-o', 'fa-star']);
            }          

        }, true);
    },

    /**
     * Setup the click handler for sending rating requests to the back-end
     * @param element The specific rating element
     */
    setupClickHandler(element: HTMLElement): void {
        let isRating = false;
        const ratingAnchor = element.querySelector('.atom-rate-anchor') as HTMLAnchorElement;

        ratingAnchor.addEventListener('click', async (event) => {
            event.preventDefault();

            if( isRating ) {
                return;
            }

            const { id = '', max = 5, min = 1 } = ratingAnchor.dataset;
            const rating: number = ratingAnchor.querySelectorAll('.fa-star').length;
            const loadingSpinner = document.createElement('<i class="fa fa-spin fa-circle-o-notch"></i>');

            // Actual rating functions
            isRating = true;
            element.append(loadingSpinner);

            const response = await AjaxApi<{ success: boolean, data: { output: string, rating: number, count: number } }>({
                action: 'public_rate',
                id: id,
                max: +max,
                min: +min,
                rating: rating
            });

            if( response.success && response.data.output ) {
                element.outerHTML = response.data.output;
                this.setupClickHandler(element); // Re-assign click-handler as DOM is updated
            }

            setTimeout( () => {
                element.querySelector('.fa-circle-o-notch')?.remove();
                isRating = false;
            }, 500)

        });

    }
};

export default Rate;