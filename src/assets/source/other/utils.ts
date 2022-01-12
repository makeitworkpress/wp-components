/**
 * Contains utility functions
 */
import AjaxData from "../types/ajax-data";

/**
 * Sends a post request to the default WordPress Ajax API endpoint
 * 
 * @param data The data that needs to passed to the ajax endpoint
 * @returns Promise The json response for the fetched resource
 */
export async function AjaxApi<T>(data: AjaxData): Promise<T> {

    if( typeof data.nonce === 'undefined' ) {
        data.nonce = globalThis.wpc.nonce;
    }

    // Non-rest api calls using admin-ajax use FormData.
    const body = new FormData();

    for( const key in data ) {
        body.append(key, data[key]);    
    }

    const response = await fetch(globalThis.wpc.ajaxUrl, {
        method: 'POST',
        credentials: 'same-origin',
        body
    });
    
    return response.json();
}

/**
 * Toggles the display of an HTML Element by sliding its height
 * 
 * @param element An HTML Element that needs to slide
 */
export function SlideToggle(element: HTMLElement): void {

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
 export function FadeToggle(element: HTMLElement): void {

    const defaultHeight: number = element.clientHeight;

    if( ! element.classList.contains('wpc-fade-toggle-hidden') ) {
        element.classList.add('wpc-fade-toggle-hidden');
        element.style.opacity = "0";
        setTimeout( () => {
            element.style.display = "none";
        });
    } else {
        element.style.opacity = "1";
        element.style.display = "block";
        setTimeout( () => {
            element.classList.remove('wpc-fade-toggle-hidden');
        }, 250);  
    }
}