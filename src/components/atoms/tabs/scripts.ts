import Component from '../types/component';

const Tabs: Component = {
    elements: document.getElementsByClassName('atom-tabs') as HTMLCollectionOf<HTMLElement>,
    init() {
        if( ! this.elements || this.elements.length < 1) {
            return;
        }
        for( const element of this.elements ) {
            this.setupTabs(element);
        }        
    },

    /**
     * Setups the tabs for each element existing on a page
     * @param element The tab element
     */    
    setupTabs(element: HTMLElement): void {
        const buttons    = element.querySelectorAll('.atom-tabs-navigation a') as NodeListOf<HTMLAnchorElement>;

        for( const button of buttons ) {
            button.addEventListener('click', (event) => {
                this.clickHandler(event, buttons, element)
            }); 
        }
    },

    /**
     * Handles clicking a tab
     * 
     * @param event The event for the click
     * @param buttons The list of all buttons
     * @param element The parent element
     */
    clickHandler(event: MouseEvent, buttons: NodeListOf<HTMLAnchorElement>, element: HTMLElement): void {

        const clickedButton = event.currentTarget as HTMLAnchorElement;
        
        // The tab links to a regular url
        if( clickedButton.href.slice(-1) !== '#' ) {
            return;
        }

        event.preventDefault();

        const sections = element.querySelectorAll('.atom-tabs-content section') as NodeListOf<HTMLElement>;
        const targetSection = element.querySelector('.atom-tabs-content section[data-id="' + clickedButton.dataset.target + '"]') as HTMLElement;

        // Reset other buttons and classes
        for( const section of sections ) {
            section.classList.remove('active');
        }

        for( const button of buttons ) {
            button.classList.remove('active');
        }

        // Make our targets active
        clickedButton.classList.add('active');
        targetSection.classList.add('active');

    }
};

export default Tabs;