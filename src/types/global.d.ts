export {};

declare module 'web-worker' {
  class WebpackWorker extends Worker {
      constructor();
  }
  export = WebpackWorker;
}
