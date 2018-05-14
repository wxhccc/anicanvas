import { isType } from '../utils';
/*
* 动画时间控制器类，用于提供与动画时间播放相关的功能
* 
*/
export default class AnimationTimer {
  constructor(animation){
    this._animation = isType(animation, 'function') ? animation : function(){};
    this.startTime = 0;
    this.lastTime = 0;
    this.running = false;
    this._playing = false;
    this.time = 0;
    this.elapsed = 0;
    this._animHandle = null;
  }
  start() {
    this.startTime = +new Date();
    this.running = true;
    this.play();
    let animation = (time) => {
      if(this._playing){
        if(!this.lastTime){
          this.lastTime = time;
        }
        else{
          this.time = time - this.lastTime;
          this.elapsed += this.time;
          this.lastTime = time;
          this._animation(this.elapsed, this.time);
        }
        this._animHandle = window.requestAnimationFrame(animation);
      }
    }
    this._animHandle = window.requestAnimationFrame(animation);
    
  }
  play() {
    this._playing = true;
  }
  pause() {
    this.lastTime = 0;
    this._playing = false;
  }
  stop() {
    this.elapsed = (+new Date()) - this.startTime;
    this.running = false;
    window.cancelAnimationFrame(this._animHandle);
  }
  getElapsedTime(){
    if(this.running){
      return (+new Date()) - this.startTime;
    }
    else{
      return this.elapsed;
    }
  }
  getRuningTime(){
    return this.time;
  }
  getNextTime() {
    let trueTime = this.time,
        percentComplete = trueTime / this.duration;
    if(!this.running) return undefined;
    if(this.timeWrap == undefined) return elapsedTime;
    return elapsedTime * (this.timeWarp(percentComplete) / percentComplete);
  }
  isRunning() {
    return this.running;
  }
  reset(){
    this.elapsed = 0;
  }
  static getWarpTime(warp_fn,time,duration){
    if(typeof warp_fn == 'function'){
      let percent = time/duration;
      return time * warp_fn(percent)/percent;
    }
  }
  /*基础事件控制函数*/
  static easeIn(strength){
    return function(percent_complete){
      return Math.pow(percent_complete,strength*2);
    }
  }
  static easeOut(strength){
    return function(percent_complete){
      return 1 - Math.pow(1 - percent_complete,strength*2);
    }
  }
  static easeInOut(){
    return function(percent_complete){
      return percent_complete - Math.sin(percent_complete*2*Math.PI) / (2*Math.PI);
    }
  }
  static elastic(passes) {
    passes = passes || this.def_opts.elastic_passes;
    return function (percent_complete){
      return ((1-Math.cos(percent_complete*Math.PI*passes)) * (1 - percent_complete))+percent_complete;
    }
  }
  static bounce(bounces) {
    let fn = AnimationTimer.elastic(bounces);
    return function() {
      percent_complete = fn(percent_complete);
      return percent_complete <= 1 ? percent_complete : 2 - percent_complete;
    }
  }
  static linear() {
    return function(percent_complete){
      return percent_complete;
    }
  }
  static step() {
    return function(percent_complete){
      return percent_complete;
    }
  }
}