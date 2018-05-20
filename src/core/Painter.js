import {isType, deg2rad} from '../utils';
/*
* 绘制器基础类，用于提供基础的绘制器逻辑方便扩展
* 
*/
export default class Painter {
  constructor(paint){
    this.image = null;
    this.paint_queue = [];
    this.photo = null;
    isType(paint, 'function') && (this.paint = paint.bind(this));
  }
  paint(sprite,context,time,fdelta,data) {
    
  }
  addQueueFn(fn){
    let add_fn = isType(fn, 'function') ? fn : (isType(this[fn], 'function') ? this[fn] : null);
    add_fn && this.paint_queue.push(add_fn);
  }
  clearQueue(){
    this.paint_queue = [];
  }
  runQueue(sprite,context,time,fdelta,data){
    let queue = this.paint_queue;
    for(let i=0; i < queue.length; i++){
      queue[i](sprite,context,time,fdelta,data);
    }
  }
  _setSelfStyles(sprite,context) {
    if(sprite.opacity < 1){
      context.globalAlpha = sprite.opacity > 0 ? sprite.opacity : 0;
    }
  }
  rotate(sprite,context,time,fdelta,data){
    context.translate(sprite.rotatePoint.x, sprite.rotatePoint.y);
    context.rotate(deg2rad(sprite.rotate));
    sprite.left = - sprite.width / 2;
    sprite.top = - sprite.height / 2;
  }
  getPhoto(sprite,context) {
    sprite.$data.photo = context.getImageData(sprite.left, sprite.top, sprite.width, sprite.height);
  }
  putPhoto(sprite,context) {
    context.putImageData(sprite.$data.photo, sprite.left, sprite.top);
  }
}
