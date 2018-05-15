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
  constructor(name='',args={}, painter=null, behaviors={}){
    this.name = name;
    this.painter = painter;
    this.behaviors = isType(behaviors, 'object') ? behaviors : {};
    this.injectRelevantProps();
    this.data = {};
    this.media = {};
    this._startTime = 0;
    this.initArgs(args);
    this.updated = false;
    this.rotatePoint = {x: this.left+this.width/2, y:this.top+this.height/2};
  }
  initArgs(args) {
    Object.assign(this, relevantProps, args);
    Object.assign(this.media, this.initMedia());
  }
  injectRelevantProps(){
    Object.keys(relevantProps).forEach(name => {
      let oldValue;
      let _this = this;
      Object.defineProperty(this, name, {
        enumerable: true,
        configurable: true,
        get: function(){
          return oldValue;
        },
        set: function(newValue) {
          if(newValue === oldValue || jsonEqual(newValue, oldValue)){
            return;
          }
          oldValue = newValue;
          _this.updated = true;
        }
      })
    })
  }
  initMedia() {
    return {
      play: function(name) {
        this[name].play && this[name].play();
      },
      pause: function(name) {
        this[name].pause && this[name].pause();
      }
    }
  }
  /*设置精灵路径*/
  setPath(fn){
    isType(fn, 'function') && (this.path = fn);
  }
  paint(context, time, fdelta, data) {
    if(this.painter && this.painter.paint && this.visible){
      this.painter.paint(this, context, time, fdelta, data);
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