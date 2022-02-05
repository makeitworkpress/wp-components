import { InitScrollReveal } from "../other/modules";
import { ToggleClass, FadeToggle, FadeOut, AjaxApi, FadeIn } from "../other/utils";
import Component from "../types/component";

declare let sr: any;

/**
 * Custom scripts for a search element
 * If enabled, the script will loads results through ajax
 */
const Search: Component = {
    elements: document.getElementsByClassName('atom-search') as HTMLCollectionOf<HTMLElement>,
    init() {
        if( ! this.elements || this.elements.length < 1) {
            return;
        }
        for( const element of this.elements ) {
            this.setupSearch(element);
        }        
    },

    /**
     * Setups the tabs for each element existing on a page
     * @param element The search element
     */    
    setupSearch(element: HTMLElement): void {  
        
        if( element.classList.contains('atom-search-ajax') ) {
            this.setupAjaxSearch(element)
        }

        this.setupToggleSearch(element);

    },

    /**
     * Setups the ajax search functionality for the given element
     * @param element The search element
     */    
    setupAjaxSearch(element: HTMLElement): void {  
        const { appear = 'bottom', delay = 300, length = 3, none = '', number = 5, types = '' } = element.dataset; 
        const searchForm = element.querySelector('.search-form') as HTMLElement;
        const searchField = element.querySelector('.search-field') as HTMLInputElement;
        const moreAnchor = element.querySelector('.atom-search-all') as HTMLAnchorElement;
        const results = element.querySelector('.atom-search-results') as HTMLElement;
        const loadingIcon = element.querySelector('.fa-circle-notch') as HTMLElement;

        let timer: NodeJS.Timeout;
        let value: string;

        if( ! element.classList.contains('atom-search-ajax') ) {
            FadeOut(results);
            return;
        }

        searchField.addEventListener('keyup', (event) => {

            clearTimeout(timer);
            const currentSearchField = event.currentTarget as HTMLInputElement;

            if( currentSearchField.value.length <= length || value === currentSearchField.value ) {
                return;
            }

            timer = setTimeout( async () => {
                value = currentSearchField.value;
                moreAnchor.href = moreAnchor.href + encodeURI(value);

                results.classList.add('components-loading');
                results.querySelector('.atom-search-all')?.remove();

                const response = await AjaxApi<{ success: boolean; data: string }>({
                    action: 'public_search', 
                    appear: appear, 
                    none: none,
                    number: number,
                    search: value,
                    types: types
                });

                if( response.success ) {
                    FadeIn(results);
                    results.innerHTML = response.data;
                    results.append(moreAnchor);

                    if( typeof sr !== 'undefined') {
                        if( sr.initialized === false ) {
                            InitScrollReveal();
                        }
                        sr.sync();
                    }
                }

                setTimeout( () => {
                    FadeOut(loadingIcon);
                    results.classList.remove('components-loading');
                }, 500);

            }, +delay);

        });    
                    
    }, 
    
    /**
     * Allows the search-form to be toggled
     * @param element The search element
     */
    setupToggleSearch(element: HTMLElement): void {

        const searchExpandElement = element.querySelector('.atom-search-expand');

        if( ! searchExpandElement ) {
            return;
        }

        const searchForm = element.querySelector('.atom-search-form') as HTMLElement; 
        const searchField = searchForm.querySelector('.search-field') as HTMLInputElement;

        searchExpandElement.addEventListener('click', (event) => {
            event.preventDefault();

            ToggleClass(element, 'atom-search-expanded');
            ToggleClass(searchExpandElement.querySelector('.fas'), ['fa-search', 'fa-times']);

            FadeToggle(searchForm);
            searchField.focus();

        });

    }

};

export default Search;