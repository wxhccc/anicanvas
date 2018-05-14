/*
* 资源加载模块类，用于加载资源
* 
*/
export default class MediaLoader {
  constructor(){
    this.imagesInfo = this._mediaInfoObj();
    this.images = {};
    this.audiosInfo = this._mediaInfoObj();
    this.audios = {};
  }
  _mediaInfoObj(){
    return {
      total : {s:0, f:0, t:0},
      queue : {s:0, f:0, t:0},
      urls : []
    };
  }
  /*加载资源*/
  loadingMedia(mediaObj, callback) {
    this.loadingImages(mediaObj.images || {}, callback, true);
    this.loadingAudios(mediaObj.audios || {}, callback, true);
    return this;
  }
  loadingMediaList(type, mediaList={},callback=null,checkall = false){
    let isArray = Array.isArray(mediaList) ? true : false;
    let mediaInfo = this[type + 'Info'];
    let loadingFn = null;
    if(type === 'images') {
      loadingFn = this.loadImage;
    }
    else if(type === 'audios') {
      loadingFn = this.loadAudio;
    }
    if(mediaList && mediaInfo && loadingFn){
      mediaInfo.queue = {s: 0, f: 0, t: 0};
      for(let i in mediaList){
        let key = isArray ? mediaList[i] : i;
        loadingFn(key, mediaList[i], callback, checkall);
      }
    }
    return this;
  }
  /*加载图片,返回对象实例*/
  loadingImages(imageList={},callback=null,checkall = false){
    return this.loadingMediaList('images', imageList, callback, checkall);
  }
  loadMedias(type, key, mediaUrl, callback, checkall){
    let mediaInfo = this[type + 'Info'];
    if(Array.indexOf(mediaInfo['urls'], mediaUrl) < 0){
      mediaInfo.total.t++;
      mediaInfo.queue.t++;
      mediaInfo['urls'].push(mediaUrl);
      let checkFn = checkall && this.getMediaProgress;
      let mediaEle = null;
      let loadEventName = 'load';
      let loadedFn = () => {
        mediaInfo.total.s++;
        mediaInfo.queue.s++;
        if(checkFn()[2] == 100){
          callback();
        }
      };
      let errorFn = () => {
        mediaInfo.total.f++;
        mediaInfo.queue.f++;
        if(checkFn()[2] == 100){
          callback();
        }
      }
      if(type === 'images') {
        mediaEle = new Image();
        !checkall && (checkFn = this.getImageProgress);
      }
      else if(type === 'audios') {
        mediaEle = new Audio();
        !checkall && (checkFn = this.getAudioProgress);
        loadEventName = 'loadedmetadata';
      }
      if(mediaEle) {
        mediaEle.addEventListener(loadEventName,loadedFn);
        mediaEle.addEventListener('error',errorFn)
        mediaEle.src = mediaUrl;
        this[type][key] = mediaEle;
      }
      
    }
  }
  loadImage = (key, imgUrl, callback, checkall) =>{
    this.loadMedias('images', key, imgUrl, callback, checkall)
  }
  /*获取图片加载进度，输出为[加载数，总数，百分比]的数组格式*/
  getImageProgress = () => {
    return this.getProgress('images');
  }
  /*加载音频资源,返回对象实例*/
  loadingAudios(audioList={}, callback=null, checkall = false){
    return this.loadingMediaList('audios', audioList, callback, checkall);
  }
  loadAudio = (key, audioUrl, callback, checkall) => {
    this.loadMedias('audios', key, audioUrl, callback, checkall)
  }
  getAudioProgress = () => {
    return this.getProgress('audios');
  }
  getProgress(type){
    let { queue } = this[type + 'Info'],
        loaded = queue.s + queue.f,
        percent = Math.round(loaded / queue.t * 100);
    return [loaded,queue.t,percent];
  }
  /*获取总资源加载进度*/
  getMediaProgress = () => {
    let images = this.imagesInfo.queue,
        audios = this.audiosInfo.queue,
        loaded = audios.s + audios.f + images.s + images.f,
        total = audios.t + images.t,
        percent = Math.round(loaded / total * 100);
    return [loaded,total,percent];
  }
  
}