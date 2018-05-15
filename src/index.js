import {Stage, Sprite, Layer, Painter, ImagePainter, SheetPainter, Behavior, AnimationTimer, MediaLoader} from './core';
import {BaseLayer} from './core/Layer';
import {isType, isNumeric, objKeySort, errWarn} from './utils';

export default class Anicanvas {
  _RAF = 0;
  _stages = [];
  $stages = {};
  $stage = null;
  $layers = {};
  $media = new MediaLoader();
  constructor(elem, opts) {
    this._elem = this.elemInit(elem);
    this._options = Object.assign({}, opts);
    this._aniTimer = new AnimationTimer(this.animation);
    this.stageInit();
  }
  elemInit(elem) {
    return isType(elem, 'string') ? document.querySelector(elem) : null;
  }
  stageInit() {
    if(this._elem){
      let {width, height} = this._options;
      this.createStage('MAIN', {width, height, zIndex: 1000});
      this.$stage = this.$stages.MAIN;
    }
    else {
      errWarn('no accessable root element!');
    }
  }
  createStage(name, options){
    if(isType(name, 'string') && !this.$stages[name]){
      let {width, height} = this._options;
      !options.width && (options.width = width);
      !options.height && (options.height = height);
      let stage = new Stage(name, options);
      this.$stages[name] = stage;
      this._stages.push(stage);
      objKeySort(this._stages, 'zIndex');
      this._elem.appendChild(stage.$canvas);
    }
  }
  animation = (elapsed, fdelta) => {
    this._stages.forEach(stage => (stage.update(elapsed, fdelta)));
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
      this.$media.loadingMedia(mediaMap, callback);
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
      this.$layers[name] = new Layer(name, opts, painter);
      return this.$layers[name];
    }
  }
  addLayer = (...layer) => {
    this.$stage.addLayer(...layer);
  }  
  addSprite = (...sprite) => {
    this.$stage.addSprite(...sprite);
  }
  resize(sizes) {
    isType(size, 'object') && Object.assign(this._elem, sizes);
  }

  
  static Sprite = Sprite;
  static Layer = Layer;
  static Painter = Painter;
  static ImagePainter = ImagePainter;
  static SheetPainter = SheetPainter;
  static Behavior = Behavior;
}