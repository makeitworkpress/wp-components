import { FadeOut } from "../other/utils";
import Component from "../types/component";

/**
 * Defines the custom header scripts
 */
const Modal: Component = {
    elements: document.getElementsByClassName('atom-modal') as HTMLCollectionOf<HTMLElement>,
    init(): void {
        
        if( ! this.elements || this.elements.length < 1) {
            return;
        }

        for(const modal of this.elements) {
            this.setupClickHandler(modal);
        }
    },
    /**
     * Setup the click handler for closing modal
     * 
     * @param modal The modal element
     */
    setupClickHandler(modal: HTMLElement): void {
        const closeModal = modal.querySelector('.atom-modal-close') as HTMLAnchorElement;

        closeModal.addEventListener('click', (event) => {
            event.preventDefault()
            FadeOut(modal);
        });
    }
};

export default Modal;
