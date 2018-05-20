import Sprite from './sprite';
/*
* 基础图层类，提供舞台内根精灵
* 
*/
export default class BaseLayer extends Sprite {
  constructor(name='', args={}){
    super(`BASELAYER-${name}`, args);
  }
  paint(context, time, fdelta, data){
    if(!context.isStatic) {
      let {width, height} = this;
      context.clearRect(0, 0, width, height);
      super.paint(context, time, fdelta, data);
    }
  }
}