import Media from './Media';
import {isType, jsonEqual} from '../utils';
/*
* 精灵类，用于处理各种精灵对象的绘制和行为
* 
*/
const relevantProps = {
  top: 0, 
  left: 0,
  width: 0, 
  height: 0,
  velocityX: 0,
  velocityY: 0,
  rotateVelocity: 0,
  rotate: 0,
  opacity: 1,
  visible: true,
  animating: false,
  zindex: 0,
  destroy: false,
  rotatePoint: {x: 0, y: 0}
};
export default class Sprite {
  _startTime = 0;
  _autoRP = true;
  _updated = false;
  $data = {};
  $media = new Media;
  TYPE = 'sprite';
  constructor(name='',args={}, painter=null, behaviors={}){
    this.name = name;
    this._painter = painter;
    this.behaviors = isType(behaviors, 'object') ? behaviors : {};
    this.injectRelevantProps();
    this.initArgs(args);
  }
  initArgs(args) {
    Object.assign(this, args);
  }
  injectRelevantProps(){
    Object.keys(relevantProps).forEach(name => {
      let oldValue = relevantProps[name];
      let _this = this;
      Object.defineProperty(this, name, {
        enumerable: true,
        configurable: true,
        get: function(){
          return oldValue;
        },
        set: function(newValue) {
          _this._checkAutoRp(name, newValue);
          if(newValue === oldValue || jsonEqual(newValue, oldValue)){
            return;
          }
          oldValue = newValue;
          _this._autoRotatePoint(name);
          _this.updated = true;
        }
      })
    })
  }
  _checkAutoRp(name, newValue) {
    if(name === 'rotatePoint' && isType(newValue, 'object')) {
      !newValue.auto ? (this._autoRP = false) : delete newValue['auto'];
    }
  }
  _autoRotatePoint(name){
    if(!this._autoRP)
      return;
    if(['left', 'top', 'width', 'height'].indexOf(name) >=0){
      this.rotatePoint = this._spriteRP();
    }
  }
  _spriteRP(){
    return {x: this.left + this.width / 2, y: this.top + this.height / 2, auto: true};
  }
  /*设置精灵路径*/
  setPath(fn){
    isType(fn, 'function') && (this.path = fn);
  }
  paint(context, time, fdelta, data) {
    if(this._painter && this._painter.paint && this.visible){
      let {left, top} = this.$parent || {left: 0, top: 0};
      context.save();
      context.translate(left, top);
      this._painter.paint(this, context, time, fdelta, data);
      context.restore();
    }
  }
  update(time, fdelta, data, context) {
    !this._startTime && (this._startTime = time);
    this._runBehaviors(time, fdelta, data, context);
    this.updated && (context.isStatic = false);
    this.updated = false;
  }

  _runBehaviors(time, fdelta, data, context) {
    let {behaviors, _startTime} = this;
    for(let i of Object.keys(behaviors)){
      let behavior = behaviors[i];
      if(behavior.delay){
        if(time - _startTime - behavior.delay < 0){
          continue;
        }
        time = time - _startTime - behavior.delay;
      }
      isType(behavior.execute, 'function') && behavior.execute(this, time, fdelta, data, context);
    }
  }

}