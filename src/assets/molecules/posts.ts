/**
 * Defines the custom posts scripts
 */
import Component from '../types/component';
declare let sr: any;

const Posts: Component = {
    parser: new DOMParser,
    elements: document.getElementsByClassName('molecule-posts') as HTMLCollectionOf<HTMLElement>,
    init() {

        if( ! this.elements || this.elements.length < 1) {
            return;
        }
        
        for( const element of this.elements ) {
            this.setupInfiniteScroll(element);
            this.setupPagination(element);
        }
        
    },

    /**
     * Setups infinite scroll for the posts element
     * @param element The post wrapper element
     */
    setupInfiniteScroll(element: HTMLElement): void {

        if( ! element.classList.contains('molecule-posts-infinite') ) {
            return;
        }

        const pagination = element.querySelector('.atom-pagination') as HTMLElement;
        if( pagination ) {
            pagination.style.display = "none";
        }

        const paginationNumberElements = element.querySelectorAll('.atom-pagination .page-numbers') as NodeListOf<HTMLAnchorElement>;
        const containerId = element.dataset.id;
        const containerPosition = element.getBoundingClientRect().top;

        let pageNumber = 1;
        let loading = false; // Determines if we are loading or when all pages are load.
        
        window.addEventListener('scroll', () => {

            let url = '';

            if( loading ) {
                return;
            }

            let windowPosition = window.innerHeight + window.scrollY;
            let postsPosition = element.clientHeight + containerPosition;

            if( windowPosition < postsPosition || paginationNumberElements.length < 1 ) {
                return;
            }

            pageNumber++;

            for(let key in paginationNumberElements ) {

                if( ! paginationNumberElements[key].textContent ) {
                    continue;
                }

                const paginationNumber = paginationNumberElements[key].textContent as string;
                if( parseInt(paginationNumber) === pageNumber ) {
                    url = paginationNumberElements[key].href;
                    loading = true;
                }

            }

            if( ! url.includes(window.location.origin) ) {
                return;
            }

            // No more pages to load
            if( ! url ) {
                loading = true;
                return;
            }

            fetch(url, {})
                .then( (response) => {
                    return response.text();
                })
                .then( (response) => {

                    const posts = this.parser.parseFromString(response, 'text/html').querySelectorAll('.molecule-posts[data-id="' + containerId + '"] .molecule-post');
                    const postsWrapper = element.querySelector('.molecule-posts-wrapper') as HTMLElement;

                    for( let post of posts ) {
                        postsWrapper.appendChild(post);
                    }

                    loading = false;

                    if( typeof sr !== 'undefined' ) {
                        sr.sync();
                    }

                });
            
        });

    },

    /**
     * Setup regular, dynamic pagination for the post wrapper element
     * @param element The post wrapper element
     */    
    setupPagination(element: HTMLElement): void {

        if( ! element.classList.contains('molecule-posts-ajax') ) {
            return;
        }

        const paginationAnchors = element.querySelectorAll('.atom-pagination a') as NodeListOf<HTMLAnchorElement>;
        
        if( paginationAnchors.length < 1 ) {
            return;
        }

        for( let anchorElement of paginationAnchors ) {
            anchorElement.addEventListener('click', (event) => {
                event.preventDefault();
                this.paginationClickHandler(element, anchorElement);
            });
        }

    },

    /**
     * Adds the click handler to any generated content
     * @param element The parent element to which the button belongs
     * @param anchor The button that is clicked
     */
    paginationClickHandler(element: HTMLElement, anchor: HTMLAnchorElement): void {
        
        const target = anchor.href;

        if( ! target.includes(window.location.origin) ) {
            return;
        }        

        element.classList.add('components-loading');

        // Fetch the target page
        fetch(target)
            .then( (response) => {
                return response.text();
            })
            .then( (response) => {
                const responseDom = this.parser.parseFromString(response, 'text/html');
                const oldPagination = element.querySelector('.atom-pagination');
                const oldPosts = element.querySelector('.molecule-posts-wrapper');
                const newPagination = responseDom.querySelector('.molecule-posts[data-id="' + element.dataset.id + '"] .atom-pagination');
                const newPosts = responseDom.querySelector('.molecule-posts[data-id="' + element.dataset.id + '"] .molecule-posts-wrapper');

                element.classList.remove('components-loading');

                // Older Posts
                if(oldPosts && newPosts) {
                    oldPosts.remove();
                    element.append(newPosts);
                }
                
                if(oldPagination && newPagination) {
                    oldPagination.remove();
                    element.append(newPagination);
                }

                // Jquery animate alternative
                setTimeout( () => {
                    window.scrollBy({
                        top: element.getBoundingClientRect().top,
                        behavior: 'smooth'
                    })            
                }, 500);

                // Sync our scroll-reveal from the global object
                if( typeof sr !== "undefined" ) {
                    sr.sync();
                }

                // Because our dom is reconstructed, we need to setup pagination again for the given element
                this.setupPagination(element);
                
            });

    }

}

export default Posts;