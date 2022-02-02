export function InitScrollReveal() {
  if( typeof window.ScrollReveal !== "undefined" ) {
 
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
        for( let key in parallaxSections ) {
            parallaxSections[key].style.backgroundPosition = 'calc(50%) ' + 'calc(50% + ' + (scrollPosition/5) + "px" + ')';
        }
    }

  });
}