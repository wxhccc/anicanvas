/*
* 媒体文件类，用于处理媒体对象的行为
* 
*/

export default class Media {
  constructor(){

  }
  play(name) {
    this[name] && this[name].play && this[name].play();
  }
  pause(name) {
    this[name] && this[name].pause && this[name].pause();
  }
}