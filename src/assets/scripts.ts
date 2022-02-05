/**
 * All front-end modules are bundled into one application
 */
import Cart from "./atoms/cart";
import CustomMap from "./atoms/map";
import Menu from "./atoms/menu";
import Modal from "./atoms/modal";
import Rate from "./atoms/rate";
import Scroll from "./atoms/scroll";
import Search from "./atoms/search";
import Share from "./atoms/share";
import Tabs from "./atoms/tabs";
import Header from "./molecules/header";
import Posts from "./molecules/posts";
import Slider from "./molecules/slider";
import { InitParallax, InitScrollReveal, InitOverlays } from "./other/modules";
import Component from "./types/component";

/**
 * Core class responsible for booting the application
 */
class WPC_App {

  private modules: Component[];

  constructor() {
    this.modules = [
      Header, Slider, Posts, Tabs, Search, Scroll, Rate, Modal, Menu, CustomMap, Share, Cart
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

      InitOverlays();
      InitParallax();
      InitScrollReveal(); 
    });
  }

};

new WPC_App();