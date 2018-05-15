import Sprite from './sprite';
import {isType, objKeySort} from '../utils';
/*
* 图层类，用于提供多层容器
* 
*/
export default class Layer extends Sprite {
  constructor(name='', args={}, painter=null, behaviors={}){
    super();
    this.layers = [];
    this.sprites = [];
    this.name = name;
    this.painter = painter;
    this.behaviors = isType(behaviors, 'object') ? behaviors : {};
    Object.assign(this, args);
  }
  paint(context,time,fdelta,data) {
    if(this.painter && this.painter.paint){
      this.painter.paint(this,context,time,fdelta);
    }
    let paintFn = i => i.paint &&　i.paint(context, time, fdelta);
    this.sprites.forEach(paintFn);
    this.layers.forEach(paintFn);
  }
  update(time, fdelta, data, context) {
    this._runBehaviors(time, fdelta, data, context);
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
    objKeySort(layers, 'zindex');
  }
  /*添加精灵*/
  addSprite(...sprite){
    let { sprites } = this;
    sprites.push(...sprite);
    objKeySort(sprites, 'zindex');
  }
}

export class BaseLayer extends Layer {
  isStatic = false;
  constructor(name='', args={}, painter=null, behaviors={}){
    super(`BASELAYER-${name}`, args, painter, behaviors);

  }
  paint(context, time, fdelta, data){
    if(!this.isStatic) {
      let {width, height} = this;
      context.clearRect(0, 0, width, height);
      super.paint(context, time, fdelta, data);
    }
  }
}