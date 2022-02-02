/**
 * Contains utility functions
 */
import AjaxData from "../types/ajax-data";
import { SiblingTypes } from "../types/sibling-types";

/**
 * Sends a post request to the default WordPress Ajax API endpoint
 * 
 * @param data The data that needs to passed to the ajax endpoint
 * @returns Promise The json response from the fetched resource
 */
export async function AjaxApi<T>(data: AjaxData): Promise<T> {

    if( typeof data.nonce === 'undefined' ) {
        data.nonce = window.wpc.nonce;
    }

    // Non-rest api calls using admin-ajax use FormData.
    const body = new FormData();

    for( const key in data ) {
        body.append(key, data[key]);    
    }

    const response = await fetch(window.wpc.ajaxUrl, {
        method: 'POST',
        credentials: 'same-origin',
        body
    });

    const jsonResponse = response.json();

    if( window.wpc.debug ) {
        console.log(jsonResponse);
    }
    
    return jsonResponse;
}

/**
 * Toggles the display of an HTML Element by sliding its height
 * 
 * @param element An HTML Element that needs to slide
 */
export function SlideToggle(element: HTMLElement | Element | null): void {

    if( ! element ) {
        return;
    }    

    const defaultHeight: number = element.clientHeight;

    if( ! element.classList.contains('wpc-slide-toggle-hidden') ) {
        element.classList.add('wpc-slide-toggle-hidden');
        element.style.height = '0px';
    } else {
        element.style.height = defaultHeight + 'px';
        setTimeout( () => {
            element.classList.remove('wpc-slide-toggle-hidden');
        }, 250);  
    }
}

/**
 * Toggles the display of an HTML Element by adjusting it's opacity
 * 
 * @param element An HTML Element that needs to slide
 */
export function FadeToggle(element: HTMLElement | Element | null): void {

    if( ! element ) {
        return;
    }    

    const defaultHeight: number = element.clientHeight;

    if( ! element.classList.contains('wpc-fade-toggle-hidden') ) {
        element.classList.add('wpc-fade-toggle-hidden');
        element.style.opacity = "0";
        setTimeout( () => {
            element.style.display = "none";
        }, 250);
    } else {
        element.style.opacity = "1";
        element.style.display = "block";
        setTimeout( () => {
            element.classList.remove('wpc-fade-toggle-hidden');
        }, 250);  
    }
}

/**
 * Toggles the display of an HTML Element by fading out
 * 
 * @param element An HTML Element that needs to slide
 */
export function FadeOut(element: HTMLElement | Element | null): void {
    
    if( ! element ) {
        return;
    }

    if( ! element.classList.contains('wpc-fade-toggle-hidden') ) {
        element.classList.add('wpc-fade-toggle-hidden');
        element.style.opacity = "0";
        setTimeout( () => {
            element.style.display = "none";
        }, 250);
    }

}

/**
 * Toggles the display of an HTML Element by fading in
 * The element should previously be faded out.
 * 
 * @param element An HTML Element that needs to slide
 */
export function FadeIn(element: HTMLElement | Element | null): void {
    
    if( ! element ) {
        return;
    }

    if( element.classList.contains('wpc-fade-toggle-hidden') ) {
        element.style.opacity = "1";
        element.style.display = "block";
        setTimeout( () => {
            element.classList.remove('wpc-fade-toggle-hidden');
        }, 250);  
    }

}

/**
 * Toggles the class(es) for a given HTML element
 * @param element The element for which the class should be toggled
 * @param className The name of the given class, or array of names
 */
export function ToggleClass(element: HTMLElement | Element | null, className: string | string[]): void {

    if( ! element ) {
        return;
    }

    if( Array.isArray(className) ) {
        className.forEach(name => {
            element.classList.toggle(name);            
        });
    } else {
        element.classList.toggle(className);
    }
    
}

/**
 * Get all siblings for a given element
 * 
 * @param element The element to look for siblings
 * @param mode The type of siblings to look for (previous or next)
 */
export function GetElementSiblings(element: HTMLElement | Element | null, mode: SiblingTypes = SiblingTypes.Next): Element[] {

    if( ! element) {
        return [];
    }

    const siblings = [];

    if(mode === SiblingTypes.Previous) {
        while (element = element.previousElementSibling) {
            siblings.push(element);
        }
    } else if(mode === SiblingTypes.Next) {
        while (element = element.nextElementSibling) {
            siblings.push(element);
        }        
    }

    return siblings;
}