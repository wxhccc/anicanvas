import {isType} from '../utils';
/*
* 精灵类，用于处理各种精灵对象的绘制和行为
* 
*/
export default class Sprite {
  constructor(name='',args={}, painter=null, behaviors={}){
    this.name = name;
    this.painter = painter;
    this.behaviors = behaviors;
    this.top = 0; 
    this.left = 0;
    this.width = 10; 
    this.height = 10;
    this.velocityX = 0;
    this.velocityY = 0;
    this.rotateVelocity = 0;
    this.rotate = 0;
    this.opacity = 1;
    this.visible = true;
    this.animating = false;
    this.zindex = 0;
    this.destroy = false;
    this.data = {};
    this.media = {};
    this.initArgs(args);
    this.rotatePoint = {x:this.left+this.width/2,y:this.top+this.height/2};
    return this;
  }
  initArgs(args) {
    Object.assign(this, args);
    Object.assign(this.media, this.initMedia());
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
    this._runBehaviors(time, fdelta, data, context);
  }

  _runBehaviors(time, fdelta, data, context) {
    let behaviors = this.behaviors;
    for(let i of Object.keys(behaviors)){
      let behavior = behaviors[i];
      if(behavior.delay){
        if(time - behavior.delay < 0){
          continue;
        }
        time = time - behavior.delay;
      }
      isType(behavior.execute, 'function') && behavior.execute(this, time, fdelta, data, context);
    }
  }

}