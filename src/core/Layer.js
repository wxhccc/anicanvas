import Sprite from './sprite';
import {isType, objKeySort} from '../utils';
/*
* 图层类，用于提供多层容器
* 
*/
export default class Layer extends Sprite {
  TYPE = 'layer';
  constructor(name='', args={}, painter=null, behaviors={}){
    super(name, args, painter, behaviors);
    this.children = [];
  }
  paint(context, time, fdelta, data) {
    super.paint(context, time, fdelta, data);
    this.children.forEach(i => (i.paint &&　i.paint(context, time, fdelta)));
  }
  update(time, fdelta, data, context) {
    super.update(time, fdelta, data, context);
    this.children.forEach((i, index, arr) => {
      i.destroy && arr.splice(index, 1);
      i.update &&　i.update(time, fdelta, data, context);
    });
  }
  /* 添加子元素，精灵或层 */
  append(...child){
    let { children } = this;
    children.push(...child);
    child.forEach(item => (item.$parent = this))
    objKeySort(children, 'zindex');
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