interface Module {
  properties?: object;
  init(): void;
  [key: string]: any;
}

export default Module;