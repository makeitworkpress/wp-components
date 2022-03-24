import { SlideToggle, ToggleClass } from "../other/utils";
import Component from "../types/component";

/**
 * Defines the custom menu scripts
 */
const Menu: Component = {
    elements: document.getElementsByClassName('atom-menu') as HTMLCollectionOf<HTMLElement>,
    init(): void {
        
        if( ! this.elements || this.elements.length < 1) {
            return;
        }

        for(const menu of this.elements) {
            this.setupHamburgerMenu(menu);
            this.setupCollapsedMenu(menu)
        }
    },

    /**
     * Sets the click handler for the hamburger menu
     * @param menu The given menu element
     */
    setupHamburgerMenu(menu: HTMLElement): void {

        const hamburgerMenu = menu.querySelector('.atom-menu-hamburger') as HTMLAnchorElement;
        const menuWrapper = menu.querySelector('.menu') as HTMLElement;

        if( ! hamburgerMenu ) {
            return;
        }

        hamburgerMenu.addEventListener('click', (event) => {
            event.preventDefault();
            menu.classList.toggle('atom-menu-expanded');
            hamburgerMenu.classList.toggle('active');
            menuWrapper.classList.toggle('active');
        });

    },

    /**
     * Sets up the handlers for collapsed menus
     * @param menu The given menu element
     */
    setupCollapsedMenu(menu: HTMLElement): void {
        
        if( ! menu.classList.contains('atom-menu-collapse') ) {
            return;
        }

        const menuItemsWithChildren = menu.querySelectorAll('.menu-item-has-children > a') as NodeListOf<HTMLAnchorElement>

        for(const menuItemAnchor of menuItemsWithChildren) {

            const subMenu = menuItemAnchor.parentElement?.querySelector('.sub-menu') as HTMLElement;

            menuItemAnchor.addEventListener('click', (event) => {
                event.preventDefault();
                ToggleClass(menuItemAnchor, 'active');
                SlideToggle(subMenu);
            });
        }
    }    
};

export default Menu;