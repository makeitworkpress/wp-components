/**
 * All front-end modules are bundled into one application
 */
import Header from "./molecules/header";
import Slider from "./molecules/slider";
import Module from "./types/module";

declare var ScrollReveal: any;

class WPC_App {

  private modules: Module[];

  constructor() {
    this.modules = [
      Header, Slider
    ];
    this.initialize();
  }

  /**
   * Executes all code after the DOM has loaded
   */
  private initialize() {
    document.addEventListener('DOMContentLoaded', () => {
      for( const key in this.modules ) {
        this.modules[key].init();
      }

      this.initScrollReveal();
      this.initParallax();   
    });
  }

  /**
   * Initializes our scroll-reveal functionality
   */
  private initScrollReveal() {
    if( typeof globalThis.ScrollReveal !== "undefined" ) {
 
      globalThis.sr = ScrollReveal();

      globalThis.sr.reveal( '.components-bottom-appear', { origin: 'bottom'}, 50 );
      globalThis.sr.reveal( '.components-left-appear', { origin: 'left'}, 50 );
      globalThis.sr.reveal( '.components-right-appear', { origin: 'right'}, 50 );
      globalThis.sr.reveal( '.components-top-appear', { origin: 'top'}, 50 );
    }
  }

  /**
   * Initializes the parallax functionality
   */
  private initParallax() {
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

};

new WPC_App();