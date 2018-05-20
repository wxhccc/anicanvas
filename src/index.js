import {Event, Stage, Sprite, Painter, ImagePainter, SheetPainter, Behavior, AnimationTimer, MediaLoader} from './core';
import {isType, isNumeric, objKeySort, errWarn} from './utils';

const EventNames = Object.keys(Event.eventMap);

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
  get $elemSize(){
    let {width, height} = this._options
    return {width, height};
  }
  stageInit() {
    if(this._elem){
      this.eventListening();
      let {width, height} = this._options;
      this.createStage('MAIN', {width, height, zIndex: 1000}, {left: 0, top: 0});
      this.$stage = this.$stages.MAIN;
    }
    else {
      errWarn('no accessable root element!');
    }
  }
  eventListening(){
    EventNames.forEach(item => {
      this._elem.addEventListener(item, this.eventHandle);
    })
  }
  eventHandle = (event) =>{
    let spriteEvents = Event.eventMap[event.type]
    if(spriteEvents){
      let {_stages} = this;
      // search the target sprite
      Event.eventCapture(_stages, event);
      // bubbling and get all callbacks those need to be excute;
      let fnQueue = Event.eventBubbling(event, spriteEvents);
      fnQueue.forEach(item => item());
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
  get frameRate(){
    return this._aniTimer.frameRate;
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
  append = (...child) => {
    child.forEach(item => {
      !this.$layers[item.name] && (this.$layers[item.name] = item);
    });
    this.$stage.append(...child);
  }  

  resize(size) {
    isType(size, 'object') && Object.assign(this._elem, size);
  }

  
  static Sprite = Sprite;
  static Painter = Painter;
  static ImagePainter = ImagePainter;
  static SheetPainter = SheetPainter;
  static Behavior = Behavior;
}