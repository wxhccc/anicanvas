import {isType, getUniqueTime} from '../utils';
/*
* 事件类
* 
*/
export default class Event {
  static eventMap = {
    click: {},
    mouseenter: {},
    mouseover: {},
    mousemove: {},
    mousedown: {},
    mouseup: {},
    click: {},
    dblclick: {},
    contextmenu: {},
    wheel: {},
    touchstart: {},
    touchmove: {},
    touchend: {}
  };
  constructor(){
    this._isBindEvent = false;
  }
  on(eventName, childNames, listener) {
    // if three arguments provided but childNames is not array ,not handle it
    if(!Array.isArray(childNames) && listener) {
      return;
    }
    let eventMap = Event.eventMap;
    if(isType(childNames, 'function')){
      listener = childNames;
      childNames = null;
    }
    if(eventMap.hasOwnProperty(eventName) && isType(listener, 'function')){
      !eventMap[eventName][this._id] && (eventMap[eventName][this._id] = {self: [], children: {}});
      let callbacks = eventMap[eventName][this._id];
      !listener._cbid && (listener._cbid = 'e' + getUniqueTime());

      if(!childNames) {
        let cbself = callbacks.self;
        !cbself.find(item => (item._cbid === listener._cbid)) && cbself.push(listener);
      }
      else{
        let cbchild = callbacks.children;
        childNames.forEach(item =>{
          if(!cbchild[item]) {
            cbchild[item] = [listener];
          }
          else {
            !cbchild[item].find(item =>(item._cbid === listener._cbid)) && cbchild[item].push(listener);
          }
        });
      }
      
    }
  }
  off(eventName, childNames, listener) {
    if(!Array.isArray(childNames) && listener) {
      return;
    }
    let eventMap = Event.eventMap;
    if(isType(childNames, 'function')){
      listener = childNames;
      childNames = null;
    }
    if(!eventMap.hasOwnProperty(eventName)){
      return;
    }
    // if only eventName provide, remove all callbacks on this sprite
    if(childNames === undefined && listener === undefined){
      delete Event.eventMap[eventName][this._id];
      return;
    }
    let callbacks = Event.eventMap[eventName][this._id];
    if(!callbacks || !listener._cbid || (childNames !== null || !Array.isArray(childNames))){
      return;
    }
    if(!childNames) {
      let cbself = callbacks.self;
      if(listener === undefined) {
        cbself.self = [];
      }
      else if(listener && listener._cbid) {
        let cbindex = cbself.findIndex(item => (item._cbid === listener._cbid));
        cbindex >=0 && cbself.splice(cbindex, 1);
      }
    }
    else{
      let cbchild = callbacks.children;
      if(listener === undefined) {
        childNames.forEach(item => (delete cbchild[item]));
      }
      else if(listener && listener._cbid){
        childNames.forEach(item =>{
          let cbarr = cbchild[item];
          if(cbarr && cbarr.length > 0) {
            let cbindex = cbarr.findIndex(citem => (citem._cbid === listener._cbid));
            cbindex >=0 && cbarr.splice(cbindex, 1);
          }
        });
      }
      
    }



    
  }


  // event capture, return the target sprite;
  static eventCapture(stages, event){
    for(let i = stages.length - 1; i >= 0; i--){
      let {_stage, _ctx: context} = stages[i];
      if(Event.searchTargetSprite(_stage, {event, context})){
        break;
      }
    }
  }
  static searchTargetSprite(sprite, data){
    let {children, _id}  = sprite,
        {event, event: {offsetX: x, offsetY: y}, context} = data,
        childLen = children.length;
    if(sprite.isPointInpath({x, y}, context)) {
      event.targetSprite = sprite;
      if(childLen == 0) {
        return true;
      }
      for(let i = childLen -1; i >= 0; i--){
        if(Event.searchTargetSprite(children[i], data)){
          return true;
        }
      }
    }
  }

  static eventBubbling(event, spriteEvents){
    let fnQueue = [],
        {targetSprite} = event,
        {_id, name, $parent} = targetSprite || {};
    if(spriteEvents[_id] && spriteEvents[_id].self.length) {
      fnQueue.push(...Event.runtimeBinding(spriteEvents[_id].self, targetSprite, event));
    }
    let parentSprite = $parent;
    while(parentSprite){
      if(!parentSprite._isBindEvent || spriteEvents[parentSprite._id]) {
        parentSprite = parentSprite.$parent;
        continue;
      }
      let spriteEvent = spriteEvents[parentSprite._id];
      spriteEvent.self.length && fnQueue.push(...Event.runtimeBinding(spriteEvent.self, parentSprite, event));
      let children = spriteEvent.children;
      children && children[name] && fnQueue.push(...Event.runtimeBinding(children[name], parentSprite, event));
      parentSprite = parentSprite.$parent;
    }
    return fnQueue;
  }

  static runtimeBinding(fns, sprite, event){
    return fns.map(item => (item.bind(sprite, event)))
  }

}
