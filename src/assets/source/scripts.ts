/**
 * All front-end modules are bundled into one application
 */
import CustomMap from "./atoms/map";
import Menu from "./atoms/menu";
import Modal from "./atoms/modal";
import Rate from "./atoms/rate";
import Scroll from "./atoms/scroll";
import Search from "./atoms/search";
import Tabs from "./atoms/tabs";
import Header from "./molecules/header";
import Posts from "./molecules/posts";
import Slider from "./molecules/slider";
import { InitParallax, InitScrollReveal } from "./other/modules";
import Component from "./types/component";

/**
 * Core class responsible for booting the application
 */
class WPC_App {

  private modules: Component[];

  constructor() {
    this.modules = [
      Header, Slider, Posts, Tabs, Search, Scroll, Rate, Modal, Menu, CustomMap
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
    InitScrollReveal();
  }

  /**
   * Initializes the parallax functionality
   */
  private initParallax() {
    InitParallax();
  }

};

new WPC_App();