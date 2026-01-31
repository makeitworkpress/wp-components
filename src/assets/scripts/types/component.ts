interface Component {
  properties?: object;
  elements: HTMLCollectionOf<HTMLElement>;
  init(): void;
  [key: string]: any;
}

export default Component;