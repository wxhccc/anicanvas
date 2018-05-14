import {Sprite, Layer, Painter, ImagePainter, SheetPainter, Behavior, AnimationTimer, MediaLoader} from './core';
import {BaseLayer} from './core/Layer';
import {isType, isNumeric} from './utils';

export default class Anicanvas {
  constructor(canvas, opts) {
    this.canvas = this.elemInit(canvas);
    this._options = Object.assign({}, opts);
    this.media = new MediaLoader();
    this._raf = 0;
    this._stage = new BaseLayer();
    this.stageInit();
    let animation = this.animation.bind(this);
    this._aniTimer = new AnimationTimer(animation);
    this.layers = {};
  }
  elemInit(canvas) {
    let canvasEle = isType(canvas, 'string') ? document.getElementById(canvas) : canvas;
    return isType(canvasEle, 'HTMLCanvasElement') ? canvasEle : null;
  }
  stageInit() {
    if(this.canvas){
      this._ctx = this.canvas.getContext('2d');
      this.setCanvasSize();
    }
    else {
      this.errWarn('no accessable canvas element!');
    }
  }
  animation(elapsed, fdelta) {
    let ctx = this._ctx;
    this._stage.update(elapsed, fdelta, null, ctx);
    this._stage.paint(ctx, elapsed, fdelta);
  }
  start(){
    this._aniTimer.start();
  }
  play(){
    this._aniTimer.play();
  }
  pause() {
    this._aniTimer.pause();
  }
  stop() {
    this._aniTimer.stop();
  }
  setCanvasSize() {
    let {width, height} = this._options;
    if(isNumeric(width) && isNumeric(height)) {
      Object.assign(this.canvas, {width, height});
    }
  }
  loadingMedia(mediaMap, callback) {
    if(mediaMap.images || mediaMap.audios){
      this.media.loadingMedia(mediaMap, callback);
    }
  }
  createPainter(type, ...options){
    switch(type) {
      case 'image':
        return new ImagePainter([...options]);
        break;
      case 'sheet':
        return new SheetPainter([...options]);
        break;
      default:
        return new Painter(type);
        break;
    }
  }
  createLayer = (name, options, painter) => {
    if(isType(name, 'string')) {
      let opts = null
      if(isType(options, 'function')) {
        painter = options;
      }
      else{
        opts = options === 'fullpage' ? {width: this._options.width, height: this._options.height} : options;
      }
      this.layers[name] = new Layer(name, opts, painter);
      return this.layers[name];
    }
  }
  addLayer = (layer) => {
    this._stage.addLayer(layer);
  }
  resize() {
  }
  errWarn(msg) {
    console.log(msg);
  }

  
  static Sprite = Sprite;
  static Layer = Layer;
  static Painter = Painter;
  static ImagePainter = ImagePainter;
  static SheetPainter = SheetPainter;
  static Behavior = Behavior;
}