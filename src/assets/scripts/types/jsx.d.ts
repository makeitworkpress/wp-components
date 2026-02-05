/**
 * JSX type definitions for WordPress (wp.element)
 * This provides JSX support without requiring @types/react
 */

declare global {
  namespace JSX {
    type Element = any;

    interface IntrinsicElements {
      [elemName: string]: any;
    }

    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

export {};
