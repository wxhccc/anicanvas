import {BaseLayer} from './Layer';
import {isType, isNumeric, createHtmlElement, objectFilter, errWarn} from '../utils';

export default class Stage {
  _playing = true;
  constructor(name, options) {
    this.$canvas = this.elemInit(name, options);
    this.resetOptions(options, true);
    this.stageInit(name);
    this.$layers = {};
  }
  resetOptions(options, fresh){
    (fresh || !this._options) ? (this._options = Object.assign({}, options)) : Object.assign(this._options, options);
  }
  elemInit(name, options) {
    let attrs = objectFilter(options, ['width', 'height']);
    let styles = Object.assign({}, options, {position: 'absolute'});
    let canvasEle = isType(name, 'string') ? createHtmlElement('canvas', attrs, styles) : name;
    canvasEle = isType(canvasEle, 'HTMLCanvasElement') ? canvasEle : null;
    canvasEle && (canvasEle.id = 'AC_' + name);
    return canvasEle;
  }
  stageInit(name) {
    let args = objectFilter(this._options, ['width', 'height']);
    this._stage = new BaseLayer(name, args);
    if(this.$canvas){
      this._ctx = this.$canvas.getContext('2d');
    }
    else {
      errWarn('no accessable canvas element!');
    }
  }
  update = (elapsed, fdelta, data) => {
    if(this._playing) {
      let context = this._ctx;
      this._stage.update(elapsed, fdelta, data, context);
      this._stage.paint(context, elapsed, fdelta, data);
    }
  }
  play(){
    this._playing = true;
  }
  pause() {
    this._playing = false;
  }
  setCanvasSize() {
    let {width, height} = this._options;
    if(isNumeric(width) && isNumeric(height)) {
      Object.assign(this.$canvas, {width, height});
    }
  }
  
  append = (...child) => {
    this._stage.append(...child);
  }
  resize() {
    this.setCanvasSize();
  }

}