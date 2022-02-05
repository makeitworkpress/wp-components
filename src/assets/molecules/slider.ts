/**
 * Defines the scripts slider
 */
import Component from "../types/component";

const Slider: Component = {
    elements: document.getElementsByClassName('molecule-slider') as HTMLCollectionOf<HTMLElement>,
    instances: {},
    init(): void {

        if( ! this.elements || this.elements.length < 1 ) {
            return;
        }
        
        for( const elements of this.elements ) {
            this.createInstance(elements);
        }

    },

    /**
     * Creates a slider instance from a HTMLElemenmt
     * @param slider The slider wrapper
     */
    createInstance(slider: HTMLElement): void {

        if (typeof window.tns === "undefined") {
            return;
        }

        const id = slider.dataset.id as string;

        if( ! id ) {
            return;
        }

        const options = window['slider' + id];

        if (typeof options === "undefined") {
            return;
        }        

        this.instances[id] = tns(options);

    }

}

export default Slider;