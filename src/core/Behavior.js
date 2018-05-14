import AnimationTimer from './AnimationTimer';
import {isType, jsonCopy, isNumeric} from '../utils';
/*
* 动画时间控制器类，用于提供与动画时间播放相关的功能
* 
*/
export default class Behavior {
  constructor(args, execute){
    let defArgs = {
      firstFn : null,  //行为首次运行时运行的函数
      animation : null,   //动画行为对象
      iteration : 1,  //行为运行次数
      timing : null,   //时间函数,
      fillMode: null  //时间结束后样式
    };
    Object.assign(this, defArgs, args);
    /*此部分为精灵行为基础属性*/
    // 确认行为执行函数
    this.executeFn = isType(execute, 'function') ? execute : ( this.animation ? this._attrChange : function(){});
    // 确定时间轴函数
    this.timing = isType(this.timing, 'function') ? this.timing : (isType(AnimationTimer[this.timing], 'function') ? AnimationTimer[this.timing](this.timingArgs) : null);
    this.firstFn = isType(this.firstFn, 'function') ? this.firstFn : ()=>{}; // 行为首次运行函数
    this._firstRun = false;      // 精灵行为首次运行标记
    this._iterationCount = 0;    // 行为已重复运行次数
    this._spriteAttrs = {};      // 精灵初始属性记录对象
    /*以下为精灵动画行为专属属性*/
    this._animaProps = this._animaInitProps();  
    this._animaRuntime = null;   //动画运行环境数据
    /*初始化函数*/
    
  }
  _animaInitProps(){
    return {         //动画初始属性
      velocity : {left:0, top:0, rotate:0, width:0, height:0, opacity:0, rotate:0},  //支持的动画属性
      lastFrame : 0,             //上一帧时间点
      frameDuration : 0,         //关键帧间隔
      framesTime :[]             //运行中的帧时间点
    };
  }
  execute(sprite, time, fdelta, data, context){
    /*单次执行，用于计算初始值*/
    if(!this._firstRun){
      this._remeberAttrs(sprite);
      this._animationPrepare(sprite);
      this.firstFn();
      this._iterationCount ++;
      this._firstRun = true;
    }
    
    /*行为逻辑*/
    let repeatCount = Math.floor(time / this.duration);
    if(repeatCount === this._iterationCount){
      if(this._checkIterationCount(repeatCount)) {
        this._iterationCount ++;
        this._animationPrepare(sprite);
      }
      (this.fillMode !== 'forward') && this._remeberAttrs(sprite, true);
    }
    if(this._checkIterationCount(repeatCount)){
      time %= this.duration;
      /*动画执行流程*/
      if(this.animation){
        let {_animaRuntime: runtime, animation} = this,
            curFrame = runtime.framesTime[0];
        if(time >= this._countFrameDuration(curFrame)){
          let lastFrame = runtime.lastFrame = runtime.framesTime.shift();
          curFrame = runtime.framesTime[0];
          runtime.frameDuration = this._countFrameDuration(curFrame - lastFrame);
          runtime.velocity = this._attrChangeInit(sprite, animation[curFrame], runtime.frameDuration);
        }
        //let animaTime = time - runtime.lastFrame;
        if(this.timing && runtime.frameDuration){
          let newTime = this._warpTime(time, runtime.frameDuration);
          time = newTime[0];
          fdelta = newTime[1];
        }
        /*行为逻辑函数*/
        this.executeFn(sprite, time, fdelta, data, context);
      }
      else{
        /*时间轴扭曲逻辑*/
        if(this.timing && this.duration){
          let newTime = this._warpTime(time, this.duration);
          time = newTime[0];
          fdelta = newTime[1];
        }
        /*行为逻辑函数*/
        this.executeFn(sprite, time, fdelta, data, context);
      }
    }
    else{
      isType(this.animateCallback, 'function') && this.animateCallback(sprite, context);
      delete sprite.behaviors[this.name]; //行为执行完销毁自身W
    }
    
  }
  _countFrameDuration(percent) {
    return percent * this.duration / 100;
  }
  _checkIterationCount(repeatCount) {
    return this.iteration === 'infinite' ? true : (repeatCount < this.iteration);
  }
  /*重置行为动画运行数据*/
  _animationPrepare(sprite) {
    if(this.animation){
      this._setAnimaData();
      (!this.animation['0'] && !this.animation['100']) && (this.animation = {0: {}, 100: this.animation}); //处理单层数据
      let {animation, _animaRuntime} = this;
      
      for(let i in animation){
        (i == 0 ) && this._spriteAttrSet(sprite, animation[0], true);
        _animaRuntime['framesTime'].push(i); 
      }
      _animaRuntime['framesTime'].sort((a, b)=>(a - b));
    }
  }
  /*重置行为动画运行数据*/
  _setAnimaData() {
    this._animaRuntime = this._animaInitProps();  //重置动画运行环境数据
  }
  /* 时间轴扭曲函数
  * @param time 行为运行时间
  */
  _warpTime(time,duration){
    let percent = time/duration;
    let warpTime = this.timing(percent)/percent*time;
    !this.lastTime && (this.lastTime = warpTime);
    let warp_fdelta = warpTime - this.lastTime;
    this.lastTime = warpTime;
    this.orgTime = [warpTime,warp_fdelta];
    return this.orgTime;
  }
  /*属性变换初始化函数*/
  _attrChangeInit(sprite, animaArgs, duration){
    let animaVel = {};
    for(let i in animaArgs){
      let arg = animaArgs[i],
          relativeVal = 0;
      if(typeof arg === 'string'){
        relativeVal = this._handleRelativeValue(arg);
      }
      else{
        relativeVal = arg - sprite[i];
      }
      animaVel[i] = relativeVal / duration;
    }
    return animaVel;
  }
  
  /*属性变换函数*/
  _attrChange(sprite, time, fdelta, data, context){
    let { velocity } = this._animaRuntime;
    for(let i in velocity){
      sprite[i] += velocity[i] * fdelta;
    }
  }
  /*属性设置函数*/
  _spriteAttrSet(sprite, attrs, checkRel){
    for(let i in attrs){
      sprite[i] = checkRel ? this._handleRelativeValue(attrs[i], sprite[i]) : attrs[i];
    }
  }
  _handleRelativeValue(relVal, value){
    let result = 0;
    if(typeof relVal === 'string' && relVal.indexOf('=') > 0){
      let relValArr = relVal.split('=');
      switch(relValArr[0]){
        case '+':
          result = relValArr[1] - 0;
          break;
        case '-':
          result = -relValArr[1];
          break;
      }
    }
    isNumeric(value) && (result += value);
    return result;
  }
  /* 精灵属性记录/恢复函数 */
  _remeberAttrs(sprite, restore){
    if(Object.keys(sprite.behaviors).length === 1 && (this.iteration > 1 || this.iteration === 'infinite')){
      let {_spriteAttrs, _animaProps: {velocity}} = this;
      if(Object.keys(_spriteAttrs).length === 0 && !restore){
        for(let i in velocity){
          _spriteAttrs[i] = sprite[i];
        }
      }
      if(restore && _spriteAttrs){
        this._spriteAttrSet(sprite, _spriteAttrs);
      }
    }
  }
}