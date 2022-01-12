/**
 * Defines the scripts slider
 */
import Module from "../types/module";
declare var tns;

const Slider: Module = {
    elements: document.getElementsByClassName('molecule-slider'),
    instances: {},
    init(): void {
        for( let key in this.elements ) {
            this.createInstance(this.elements[key]);
        }
    },

    /**
     * Creates a slider instance from a HTMLElemenmt
     * @param slider The slider wrapper
     */
    createInstance(slider: HTMLElement): void {

        if (typeof globalThis.tns === "undefined") {
            return;
        }

        const id: string = slider.dataset.id;
        const options = globalThis['slider' + id];

        if (typeof options === "undefined") {
            return;
        }        

        this.instances[id] = tns(options);

    }

}

export default Slider;