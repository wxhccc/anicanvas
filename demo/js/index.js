/*全局变量，用于存rem单位*/

$(function(){
  
	let t,
      app = new Invitation('#J-wrap');
  $(window).resize(function(){
    clearTimeout(t);
    t = setTimeout(function(){
      app.resize();
    },500)
    
  });  
});


function getPageSize(){
  return {width: $(window).width(), height: $(window).height()};
}

/*页面逻辑类*/
class Invitation{
  constructor(elem){
    this.envInit();
    this.AC = new Anicanvas(elem, {...this.fullPageSize}); 
    this.pageInit();
  }
  envInit() {
  	this.fullPageSize = getPageSize();
  	this.rem = this.fullPageSize.width / 15;
  }
  resize(){
  	this.envInit();
  	this.AC.resize();
  }
  pageInit(){
    /*
    * 业务逻辑部分
    */
    //创建背景层
    this.AC.createStage('background', {zIndex: 100});
    this.AC.start();
    //this.AC.$stage.pause();
    //this.AC.$stages['background'].pause();
    this.loadingMedia();
    //this.test();
  }
  /*预加载资源*/
  loadingMedia(){
  	let preload_media = {
      'images': {'bg1':'./img/bg.jpg','music':'./img/music.png','p1_01':'./img/p1_01.png','p1_02_01':'./img/p1_02_01.png','p1_02_02':'./img/p1_02_02.png','arrow':'./img/arrow.png','p1_03_01':'./img/p1_03_01.png','p1_03_02':'./img/p1_03_02.png','p1_03_03':'./img/p1_03_03.png'},
      'audios':{'m1':'./media/bgm.mp3'}
    };
  	this.AC.loadingMedia(preload_media, this.drawPage);
    this.drawLoadinProgress();
  }
  /*绘制进度条*/
  drawLoadinProgress(){
  	let rem = this.rem;
  	let {height} = this.fullPageSize;
  	let bgPainter = new Anicanvas.Painter( function(sprite, ctx, time, fdelta, data){
  		let {left, top, width, height} = sprite;
  		ctx.save();
  		ctx.fillStyle = '#efefef';
  		ctx.fillRect(left, top, width, height);
  		ctx.restore();
  	});
  	let layer = this.AC.createLayer('progLayer', 'fullpage', bgPainter);

  	let progbarPaniter = new Anicanvas.Painter( (sprite, ctx, time, fdelta, data) => {
  		let {left, top, width, height, $data: {percent}} = sprite;
  		ctx.save();
  		ctx.fillStyle = '#aeaeae';
  		ctx.fillRect(left, top, width, height);
  		ctx.fillStyle = '#999999';
  		ctx.fillRect(left, top, width * percent / 100, height);
  		ctx.restore();
  	});
    let progresUpdate = {
      'update': {
        execute: (sprite, time)=>{
          let mediaload = this.AC.$media.getImageProgress();
          let percent = mediaload[2];
          sprite.$data.percent = percent;
          sprite.updated = true;
          (percent === 100) && (layer.destroy = true);
        }
      }
    }
  	let progressBar = new Anicanvas.Sprite('progbar', {left: 1*rem, top: height-40, width: 13*rem, height: 20}, progbarPaniter, progresUpdate);
  	layer.append(progressBar);
  	this.AC.$stages['background'].append(layer);
  }

  drawPage = () => {
    let rem = this.rem,
    		canvasSize = this.fullPageSize,
    		{ $media: {images, audios}, createLayer, append } = this.AC,
    		pageLayer = createLayer('page', 'fullpage', new Anicanvas.ImagePainter(images['bg1']));
    
    /*音乐播放按钮*/
    let musicIcoPainter = new Anicanvas.ImagePainter(images['music']);
    musicIcoPainter.addQueueFn('rotate');
    let musicIco = new Anicanvas.Sprite('music', {
	    	top: 0.5 * rem, 
	    	left: 0.865 * 15 * rem,
	    	width: 1.2 * rem,
	    	height: 1.2 * rem,
	    	rotateVelocity: -45,
	    },
    	musicIcoPainter, {
      	'rotate': {
        	execute : function(sprite, time, fdelta, data, context){
          	sprite.rotate = (sprite.rotate + fdelta/1000 * sprite.rotateVelocity ) % 360;
        	}
      	}
    });
    musicIco.$media.music = audios['m1'];
    musicIco.setPath(function(context){
      context.arc(this.left+this.width/2, this.top+this.height/2, 0, 2*Math.PI);
    });
    musicIco.$media.play('music');
    
    
      
    /*对话框*/
    let dailogPainter = new Anicanvas.Painter((sprite,context,time,fdelta,data) => {
      if(sprite.$data.photo){
        dailogPainter.putPhoto(sprite, context);
      }
      else{
        let dailog = images['p1_01'];
        context.save();
        if(sprite.opacity < 1){
          context.globalAlpha = sprite.opacity > 0 ? sprite.opacity : 0;
        }
        context.drawImage(dailog, 0, 0, dailog.width, 398, sprite.left, sprite.top, sprite.width, sprite.height);
        if(time > 2500){  
        	context.drawImage(dailog, 0, 400, dailog.width, 129, sprite.left, sprite.top+sprite.height*0.2513, sprite.width, sprite.height*0.3241);
          dailogPainter.getPhoto(sprite, context);
        }
        context.restore();
      }
    });
    let dailog = new Anicanvas.Sprite('dailog', {
    		top: -20, 
    		left: 2.64*rem, 
    		opacity: 0, 
    		width: 8.8*rem, 
    		height: 6.76*rem
    	},
    	dailogPainter, {
      	'slideFadeDown' : new Anicanvas.Behavior({
      		name: 'slideFadeDown',
      		timing: 'ease',
      		duration: 800,
      		delay: 700, 
      		fillMode: 'forward', 
      		animation:{ top:'+=20', opacity: 1}
      	})
    	}
    );
    
      
    /*箭头动画*/
    let arrowSlide = new Anicanvas.Behavior({
    	name: 'slideUpRepeat',
    	duration:2500,
    	delay: 100,
    	iteration: 'infinite',
    	animation: {
    		0: {top: '+=8', opacity: 0},
    		30: {top: '-=3', opacity:1},
    		100: {top: '-=10', opacity:0}
    	}
    });
    let arrow = new Anicanvas.Sprite('arrow',{top:canvasSize.height-2*rem+8,left:6.92*rem,width:1.16*rem,opacity:0,height:1.16*rem},new Anicanvas.ImagePainter(images['arrow']),{'slideUpRepeat':arrowSlide})
    

      
    /*背景*/
    let midBgPanter = {
      paint:(sprite,context,time,data)=>{
        let midbg = sprite.$data.img;
        if(midbg) {
        	context.save();
	        if(sprite.opacity < 1){
	          context.globalAlpha = sprite.opacity > 0 ? sprite.opacity : 0;
	        }
	        sprite.top += sprite.velocityY * data;  
	        context.drawImage(midbg,0,0,midbg.width,midbg.height,sprite.left,sprite.top + 20,sprite.width,sprite.height);
	        context.restore();
        }
      }
    };
    let midBgBehaviors = {
      'slideUp':{
      	distance: -20, duration:800, delay:2500,
        execute : function(sprite, time){
          sprite.$data.img = images['p1_02_01'];
          let deltat = time - sprite._startTime - this.delay;
          if(deltat > 0){
            sprite.velocityY = this.distance / this.duration;
            let opacity = deltat / this.duration;
            if(deltat >= 800){
              sprite.velocityY = 0;
              opacity = 1;
              delete sprite.behaviors.slideUp;
            }
            sprite.opacity = opacity > 1 ? 1 : opacity;
          }
        }
      },
      'bgswitch':{
      	delay: 3500,
        execute : function(sprite, time){
          let deltat = time - sprite._startTime - this.delay;
          if(deltat > 0){
            let skipt = deltat % 1000;
            if(skipt < 500){
              sprite.$data.img = images['p1_02_01'];
            }
            else{
              sprite.$data.img = images['p1_02_02'];
            }
          }
        }
      }
    };

    let midBgLayer = new Anicanvas.Layer('midbg', {top: 6.96*rem+20, left:0.52*rem, width:13.52*rem, opacity:0, height:12.7*rem, data: {img:null}}, midBgPanter, midBgBehaviors);
    /*人物*/
    let peopleCell = [{x:0,y:0,w:268,h:384},{x:270,y:0,w:268,h:384},{x:540,y:0,w:268,h:384},{x:810,y:0,w:268,h:384}],
        peoplePainter = new Anicanvas.SheetPainter(images['p1_03_01'], peopleCell, {interval:500, autoruning:true, iteration:'infinite'})
    let people = new Anicanvas.Sprite('people', {left:2.2*rem,top:6.27*rem, width:10.72*rem,opacity:0,height:15.36*rem}, peoplePainter);

    /*固定图片*/
    let customPainter = {
      paint:function(sprite,context,time,data){
        let img = sprite.$data.img;
        img && context.drawImage(img, 0, 0, img.width, img.height, sprite.left, sprite.top, sprite.width, sprite.height);
      }
    };
    let floor = new Anicanvas.Sprite('floor', {top:19.31*rem, left:2.745*rem, width:10.56*rem, height:2.88*rem, $data:{ img: images['p1_03_03']}}, customPainter);
    let desc = new Anicanvas.Sprite('desc', {top:14.275*rem, left:3.84*rem, width:7.02*rem, height:5.12*rem, $data:{img: images['p1_03_02']}}, customPainter);



    this.AC.append(musicIco, midBgLayer, arrow, people, desc);

    pageLayer.append(dailog);
    pageLayer.append(floor);
    this.AC.$stages['background'].append(pageLayer);
      
  }
  test(){
    let {rem} = this;

    /*测试代码*/
    let ballRoll = {
      execute: (sprite, time)=>{
        let {left, top, width, height} = sprite;
        let {left: pleft, top: ptop, width: pwidth, height: pheight} = sprite.$parent;
        if(left < pleft || left > pleft + pwidth - width) {
          sprite.left = left < pleft? pleft : pleft + pwidth - width;
          sprite.velocityX = -sprite.velocityX;
        }
        else if( top < ptop || top > ptop + pheight -height) {
          sprite.top = top < ptop ? ptop : ptop + pheight -height;
          sprite.velocityY = -sprite.velocityY;
        }
        sprite.left += sprite.velocityX;
        sprite.top += sprite.velocityY;
        sprite.rotatePoint = {x: sprite.left + sprite.width/2, y: sprite.top + sprite.height / 2};
      }
    };
    let {width: swidth, height: sheight} = this.AC.$stage._stage;
    for(let i = 0; i< 1; i++){
      let width = 10 + Math.random() * 30;
      let left = Math.random() * swidth - width;
      let top = Math.random() * swidth - width;
      let velocityX = Math.random() * 20;
      let velocityY = Math.random() * 20;
      let opacity = 0.2 + Math.random() * 0.8;
      let ballPainter = new Anicanvas.Painter((sprite, context, time, fdelta)=>{
        console.log(this.AC.frameRate);
        let { rotatePoint: {x, y}} = sprite; //
        context.save();
        context.beginPath();
        context.globalAlpha = sprite.opacity;
        context.fillStyle = "red";
        context.arc(x, y, width / 2, 0, Math.PI*2);
        context.fill();
        context.restore();
      })
      let ball = new Anicanvas.Sprite('ball'+i, {left, top, width, height: width, opacity, velocityX, velocityY}, ballPainter, {ballRoll})
      this.AC.append(ball);
    }

  }
  
}



