import Event from './Event';
import Media from './Media';
import {isType, jsonEqual, isNumeric, objKeySort, getUniqueTime} from '../utils';
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
export default class Sprite extends Event {
  _startTime = 0;
  _autoRP = true;
  needUpdate = false;
  $data = {};
  $media = new Media;
  children = [];
  constructor(name='',args={}, painter=null, behaviors={}){
    super();
    this.name = name;
    this._id = 's' + getUniqueTime();
    this._painter = painter;
    this.behaviors = Array.isArray(behaviors) ? behaviors : [];
    this.injectRelevantProps();
    this.initArgs(args);
  }
  initArgs(args) {
    Object.assign(this, args);
    !this.needAutoRP && (this.rotatePoint = this._spriteRP())
  }
  get $path(){
    return this._path;
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
          _this.needAutoRP && _this._checkAutoRp(name, newValue);
          if(newValue === oldValue || jsonEqual(newValue, oldValue)){
            return;
          }
          oldValue = newValue;
          _this.needAutoRP && _this._autoRotatePoint(name);
          _this.needUpdate = true;
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
    if(!this.needAutoRP)
      return;
    if(!this._autoRP)
      return;
    if(['left', 'top', 'width', 'height'].indexOf(name) >=0){
      this.rotatePoint = this._spriteRP(true);
    }
  }
  _spriteRP(auto){
    let point = {x: this.left + this.width / 2, y: this.top + this.height / 2};
    auto && (point.auto = true);
    return point;
  }
  /* 设置精灵路径 */
  setPath(fn){
    isType(fn, 'function') && (this._path = fn);
  }
  /* 检测左边是否在精灵路径内 */
  isPointInpath = (positon = {}, context)=>{
    let result = false;
    let {x, y} = positon;
    if(isNumeric(x) && isNumeric(y)) {
      if(this._path && context) {
        this._path(context);
        result = context.isPointInPath(x, y);
      }
      else {
        let {left, top, width, height} = this;
        if(this.$parent) {
          let {left: pleft, top: ptop} = this.$parent;
          left += pleft;
          top += ptop;
        }
        result = (x >= left && x <= left + width && y >= top && y <= top + height);
      }
    }
    return result;
  }
  paint(context, time, fdelta, data) {
    if(this._painter && this._painter.paint && this.visible){
      let {left, top} = this.$parent || {left: 0, top: 0};
      context.save();
      context.translate(left, top);
      this._painter.paint(this, context, time, fdelta, data);
      context.restore();
    }
    this.children.length && this.children.forEach(i => (i.paint &&　i.paint(context, time, fdelta)));
    this.needUpdate = false;
  }
  update(time, fdelta, data, context) {
    !this._startTime && (this._startTime = time);
    this._runBehaviors(time, fdelta, data, context);
    this.children.length && this.children.forEach((i, index, arr) => {
      i.destroy ? arr.splice(index, 1) : i.update(time, fdelta, data, context);
    });
    this.needUpdate && (context.isStatic = false);
  }

  /* 添加子元素，精灵或层 */
  append(...child){
    let { children } = this;
    children.push(...child);
    child.forEach(item => (item.$parent = this))
    objKeySort(children, 'zindex');
  }

  addBehaviors(...behaviors) {
    this._behaviorsSigned(behaviors);
    this.behaviors.push(...behaviors);
  }

  _behaviorsSigned(behaviors) {
    behaviors.forEach(item => {
      !item._bid && (item._bid = +new Date());
    })
  }

  _runBehaviors(time, fdelta, data, context) {
    let {behaviors, _startTime} = this;
    for(let behavior of behaviors){
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