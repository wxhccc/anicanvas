import Sprite from './sprite';
import {isType, objKeySort} from '../utils';
/*
* 图层类，用于提供多层容器
* 
*/
export default class Layer extends Sprite {
  constructor(name='', args={}, painter=null, behaviors={}){
    super(name, args, painter, behaviors);
    this.layers = [];
    this.sprites = [];
  }
  paint(context, time, fdelta, data) {
    super.paint(context, time, fdelta, data);
    let paintFn = i => i.paint &&　i.paint(context, time, fdelta);
    this.sprites.forEach(paintFn);
    this.layers.forEach(paintFn);
  }
  update(time, fdelta, data, context) {
    super.update(time, fdelta, data, context);
    let updateFn = (i, index, arr) => {
      i.destroy && arr.splice(index, 1);
      i.update &&　i.update(time, fdelta, data, context);
    }
    this.sprites.forEach(updateFn);
    this.layers.forEach(updateFn);
  }
  /*添加精灵*/
  addLayer(...layer){
    let { layers } = this;
    layers.push(...layer);
    layer.forEach(item => (item.$parent = this))
    objKeySort(layers, 'zindex');
  }
  /*添加精灵*/
  addSprite(...sprite){
    let { sprites } = this;
    sprites.push(...sprite);
    sprite.forEach(item => (item.$parent = this))
    objKeySort(sprites, 'zindex');
  }
}

export class BaseLayer extends Layer {
  constructor(name='', args={}){
    super(`BASELAYER-${name}`, args);
  }
  update(time, fdelta, data, context) {
    context.isStatic = true;
    super.update(time, fdelta, data, context);
  }
  paint(context, time, fdelta, data){
    if(!context.isStatic) {
      let {width, height} = this;
      context.clearRect(0, 0, width, height);
      super.paint(context, time, fdelta, data);
    }
  }
}