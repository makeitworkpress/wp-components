declare let ScrollReveal: any;

export function InitScrollReveal() {
  if( typeof ScrollReveal !== "undefined" ) {
 
    window.sr = ScrollReveal();

    window.sr.reveal( '.components-bottom-appear', { origin: 'bottom'}, 50 );
    window.sr.reveal( '.components-left-appear', { origin: 'left'}, 50 );
    window.sr.reveal( '.components-right-appear', { origin: 'right'}, 50 );
    window.sr.reveal( '.components-top-appear', { origin: 'top'}, 50 );
  }
}

export function InitParallax() {
  window.addEventListener('scroll', () => {
    let scrollPosition: number = window.scrollY;
    const parallaxSections = document.getElementsByClassName('components-parallax') as HTMLCollectionOf<HTMLElement>;
    
    if( parallaxSections.length > 0 ) {
        for( let section of parallaxSections ) {
          section.style.backgroundPosition = 'calc(50%) ' + 'calc(50% + ' + (scrollPosition/5) + "px" + ')';
        }
    }

  });
}

/**
 * Adds custom overlays to any section that has one defined
 * This function deprecates once attr is sufficiently supported by CSS
 */
export function InitOverlays() {
  const overlayedElements = document.getElementsByClassName('components-custom-overlay') as HTMLCollectionOf<HTMLElement>;

  if( overlayedElements.length < 1 ) {
    return;
  }

  for( let element of overlayedElements ) {
    const { color = '#000', opacity = '0.5' } = element.dataset;
    const overlay = document.createElement('div');
    
    overlay.classList.add('components-overlay-background');
    overlay.style.backgroundColor = color;
    overlay.style.opacity = opacity;

    element.append(overlay);
  }

}