/**
 * All front-end modules are bundled into one application
 */
import Cart from "../../components/atoms/cart/scripts";
import CustomMap from "../../components/atoms/map/scripts";
import Menu from "../../components/atoms/menu/scripts";
import Modal from "../../components/atoms/modal/scripts";
import Rate from "../../components/atoms/rate/scripts";
import Scroll from "../../components/atoms/scroll/scripts";
import Search from "../../components/atoms/search/scripts";
import Share from "../../components/atoms/share/scripts";
import Tabs from "../../components/atoms/tabs/scripts";
import Header from "../../components/molecules/header/scripts";
import Posts from "../../components/molecules/posts/scripts";
import Slider from "../../components/molecules/slider/scripts";
import { InitParallax, InitScrollReveal, InitOverlays } from "./helpers/modules";
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
