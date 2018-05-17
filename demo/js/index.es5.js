(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  /*全局变量，用于存rem单位*/

  $(function () {

    var t = void 0,
        app = new Invitation('#J-wrap');
    $(window).resize(function () {
      clearTimeout(t);
      t = setTimeout(function () {
        app.resize();
      }, 500);
    });
  });

  function getPageSize() {
    return { width: $(window).width(), height: $(window).height() };
  }

  /*页面逻辑类*/

  var Invitation = function () {
    function Invitation(elem) {
      var _this = this;

      classCallCheck(this, Invitation);

      this.drawPage = function () {
        var rem = _this.rem,
            canvasSize = _this.fullPageSize,
            _AC = _this.AC,
            _AC$$media = _AC.$media,
            images = _AC$$media.images,
            audios = _AC$$media.audios,
            createLayer = _AC.createLayer,
            append = _AC.append,
            pageLayer = createLayer('page', 'fullpage', new Anicanvas.ImagePainter(images['bg1']));

        /*音乐播放按钮*/
        var musicIcoPainter = new Anicanvas.ImagePainter(images['music']);
        musicIcoPainter.addQueueFn('rotate');
        var musicIco = new Anicanvas.Sprite('music', {
          top: 0.5 * rem,
          left: 0.865 * 15 * rem,
          width: 1.2 * rem,
          height: 1.2 * rem,
          rotateVelocity: -45
        }, musicIcoPainter, {
          'rotate': {
            execute: function execute(sprite, time, fdelta, data, context) {
              sprite.rotate = (sprite.rotate + fdelta / 1000 * sprite.rotateVelocity) % 360;
            }
          }
        });
        musicIco.$media.music = audios['m1'];
        musicIco.setPath(function (context) {
          context.arc(this.left + this.width / 2, this.top + this.height / 2, 0, 2 * Math.PI);
        });
        musicIco.$media.play('music');

        /*对话框*/
        var dailogPainter = new Anicanvas.Painter(function (sprite, context, time, fdelta, data) {
          if (sprite.$data.photo) {
            dailogPainter.putPhoto(sprite, context);
          } else {
            var _dailog = images['p1_01'];
            context.save();
            if (sprite.opacity < 1) {
              context.globalAlpha = sprite.opacity > 0 ? sprite.opacity : 0;
            }
            context.drawImage(_dailog, 0, 0, _dailog.width, 398, sprite.left, sprite.top, sprite.width, sprite.height);
            if (time > 2500) {
              context.drawImage(_dailog, 0, 400, _dailog.width, 129, sprite.left, sprite.top + sprite.height * 0.2513, sprite.width, sprite.height * 0.3241);
              dailogPainter.getPhoto(sprite, context);
            }
            context.restore();
          }
        });
        var dailog = new Anicanvas.Sprite('dailog', {
          top: -20,
          left: 2.64 * rem,
          opacity: 0,
          width: 8.8 * rem,
          height: 6.76 * rem
        }, dailogPainter, {
          'slideFadeDown': new Anicanvas.Behavior({
            name: 'slideFadeDown',
            timing: 'ease',
            duration: 800,
            delay: 700,
            fillMode: 'forward',
            animation: { top: '+=20', opacity: 1 }
          })
        });

        /*箭头动画*/
        var arrowSlide = new Anicanvas.Behavior({
          name: 'slideUpRepeat',
          duration: 2500,
          delay: 100,
          iteration: 'infinite',
          animation: {
            0: { top: '+=8', opacity: 0 },
            30: { top: '-=3', opacity: 1 },
            100: { top: '-=10', opacity: 0 }
          }
        });
        var arrow = new Anicanvas.Sprite('arrow', { top: canvasSize.height - 2 * rem + 8, left: 6.92 * rem, width: 1.16 * rem, opacity: 0, height: 1.16 * rem }, new Anicanvas.ImagePainter(images['arrow']), { 'slideUpRepeat': arrowSlide });

        /*背景*/
        var midBgPanter = {
          paint: function paint(sprite, context, time, data) {
            var midbg = sprite.$data.img;
            if (midbg) {
              context.save();
              if (sprite.opacity < 1) {
                context.globalAlpha = sprite.opacity > 0 ? sprite.opacity : 0;
              }
              sprite.top += sprite.velocityY * data;
              context.drawImage(midbg, 0, 0, midbg.width, midbg.height, sprite.left, sprite.top + 20, sprite.width, sprite.height);
              context.restore();
            }
          }
        };
        var midBgBehaviors = {
          'slideUp': {
            distance: -20, duration: 800, delay: 2500,
            execute: function execute(sprite, time) {
              sprite.$data.img = images['p1_02_01'];
              var deltat = time - sprite._startTime - this.delay;
              if (deltat > 0) {
                sprite.velocityY = this.distance / this.duration;
                var opacity = deltat / this.duration;
                if (deltat >= 800) {
                  sprite.velocityY = 0;
                  opacity = 1;
                  delete sprite.behaviors.slideUp;
                }
                sprite.opacity = opacity > 1 ? 1 : opacity;
              }
            }
          },
          'bgswitch': {
            delay: 3500,
            execute: function execute(sprite, time) {
              var deltat = time - sprite._startTime - this.delay;
              if (deltat > 0) {
                var skipt = deltat % 1000;
                if (skipt < 500) {
                  sprite.$data.img = images['p1_02_01'];
                } else {
                  sprite.$data.img = images['p1_02_02'];
                }
              }
            }
          }
        };

        var midBgLayer = new Anicanvas.Layer('midbg', { top: 6.96 * rem + 20, left: 0.52 * rem, width: 13.52 * rem, opacity: 0, height: 12.7 * rem, data: { img: null } }, midBgPanter, midBgBehaviors);
        /*人物*/
        var peopleCell = [{ x: 0, y: 0, w: 268, h: 384 }, { x: 270, y: 0, w: 268, h: 384 }, { x: 540, y: 0, w: 268, h: 384 }, { x: 810, y: 0, w: 268, h: 384 }],
            peoplePainter = new Anicanvas.SheetPainter(images['p1_03_01'], peopleCell, { interval: 500, autoruning: true, iteration: 'infinite' });
        var people = new Anicanvas.Sprite('people', { left: 2.2 * rem, top: 6.27 * rem, width: 10.72 * rem, opacity: 0, height: 15.36 * rem }, peoplePainter);

        /*固定图片*/
        var customPainter = {
          paint: function paint(sprite, context, time, data) {
            var img = sprite.$data.img;
            img && context.drawImage(img, 0, 0, img.width, img.height, sprite.left, sprite.top, sprite.width, sprite.height);
          }
        };
        var floor = new Anicanvas.Sprite('floor', { top: 19.31 * rem, left: 2.745 * rem, width: 10.56 * rem, height: 2.88 * rem, $data: { img: images['p1_03_03'] } }, customPainter);
        var desc = new Anicanvas.Sprite('desc', { top: 14.275 * rem, left: 3.84 * rem, width: 7.02 * rem, height: 5.12 * rem, $data: { img: images['p1_03_02'] } }, customPainter);

        _this.AC.append(musicIco, midBgLayer, arrow, people, desc);

        pageLayer.append(dailog);
        pageLayer.append(floor);
        _this.AC.$stages['background'].append(pageLayer);
      };

      this.envInit();
      this.AC = new Anicanvas(elem, _extends({}, this.fullPageSize));
      this.pageInit();
    }

    createClass(Invitation, [{
      key: 'envInit',
      value: function envInit() {
        this.fullPageSize = getPageSize();
        this.rem = this.fullPageSize.width / 15;
      }
    }, {
      key: 'resize',
      value: function resize() {
        this.envInit();
        this.AC.resize();
      }
    }, {
      key: 'pageInit',
      value: function pageInit() {
        /*
        * 业务逻辑部分
        */
        //创建背景层
        this.AC.createStage('background', { zIndex: 100 });
        this.AC.start();
        //this.AC.$stage.pause();
        //this.AC.$stages['background'].pause();
        this.loadingMedia();
        //this.test();
      }
      /*预加载资源*/

    }, {
      key: 'loadingMedia',
      value: function loadingMedia() {
        var preload_media = {
          'images': { 'bg1': './img/bg.jpg', 'music': './img/music.png', 'p1_01': './img/p1_01.png', 'p1_02_01': './img/p1_02_01.png', 'p1_02_02': './img/p1_02_02.png', 'arrow': './img/arrow.png', 'p1_03_01': './img/p1_03_01.png', 'p1_03_02': './img/p1_03_02.png', 'p1_03_03': './img/p1_03_03.png' },
          'audios': { 'm1': './media/bgm.mp3' }
        };
        this.AC.loadingMedia(preload_media, this.drawPage);
        this.drawLoadinProgress();
      }
      /*绘制进度条*/

    }, {
      key: 'drawLoadinProgress',
      value: function drawLoadinProgress() {
        var _this2 = this;

        var rem = this.rem;
        var height = this.fullPageSize.height;

        var bgPainter = new Anicanvas.Painter(function (sprite, ctx, time, fdelta, data) {
          var left = sprite.left,
              top = sprite.top,
              width = sprite.width,
              height = sprite.height;

          ctx.save();
          ctx.fillStyle = '#efefef';
          ctx.fillRect(left, top, width, height);
          ctx.restore();
        });
        var layer = this.AC.createLayer('progLayer', 'fullpage', bgPainter);

        var progbarPaniter = new Anicanvas.Painter(function (sprite, ctx, time, fdelta, data) {
          var left = sprite.left,
              top = sprite.top,
              width = sprite.width,
              height = sprite.height,
              percent = sprite.$data.percent;

          ctx.save();
          ctx.fillStyle = '#aeaeae';
          ctx.fillRect(left, top, width, height);
          ctx.fillStyle = '#999999';
          ctx.fillRect(left, top, width * percent / 100, height);
          ctx.restore();
        });
        var progresUpdate = {
          'update': {
            execute: function execute(sprite, time) {
              var mediaload = _this2.AC.$media.getImageProgress();
              var percent = mediaload[2];
              sprite.$data.percent = percent;
              sprite.updated = true;
              percent === 100 && (layer.destroy = true);
            }
          }
        };
        var progressBar = new Anicanvas.Sprite('progbar', { left: 1 * rem, top: height - 40, width: 13 * rem, height: 20 }, progbarPaniter, progresUpdate);
        layer.append(progressBar);
        this.AC.$stages['background'].append(layer);
      }
    }, {
      key: 'test',
      value: function test() {
        var _this3 = this;

        var rem = this.rem;

        /*测试代码*/

        var ballRoll = {
          execute: function execute(sprite, time) {
            var left = sprite.left,
                top = sprite.top,
                width = sprite.width,
                height = sprite.height;
            var _sprite$$parent = sprite.$parent,
                pleft = _sprite$$parent.left,
                ptop = _sprite$$parent.top,
                pwidth = _sprite$$parent.width,
                pheight = _sprite$$parent.height;

            if (left < pleft || left > pleft + pwidth - width) {
              sprite.left = left < pleft ? pleft : pleft + pwidth - width;
              sprite.velocityX = -sprite.velocityX;
            } else if (top < ptop || top > ptop + pheight - height) {
              sprite.top = top < ptop ? ptop : ptop + pheight - height;
              sprite.velocityY = -sprite.velocityY;
            }
            sprite.left += sprite.velocityX;
            sprite.top += sprite.velocityY;
            sprite.rotatePoint = { x: sprite.left + sprite.width / 2, y: sprite.top + sprite.height / 2 };
          }
        };
        var _AC$$stage$_stage = this.AC.$stage._stage,
            swidth = _AC$$stage$_stage.width,
            sheight = _AC$$stage$_stage.height;

        var _loop = function _loop(i) {
          var width = 10 + Math.random() * 30;
          var left = Math.random() * swidth - width;
          var top = Math.random() * swidth - width;
          var velocityX = Math.random() * 20;
          var velocityY = Math.random() * 20;
          var opacity = 0.2 + Math.random() * 0.8;
          var ballPainter = new Anicanvas.Painter(function (sprite, context, time, fdelta) {
            console.log(_this3.AC.frameRate);
            var _sprite$rotatePoint = sprite.rotatePoint,
                x = _sprite$rotatePoint.x,
                y = _sprite$rotatePoint.y; //

            context.save();
            context.beginPath();
            context.globalAlpha = sprite.opacity;
            context.fillStyle = "red";
            context.arc(x, y, width / 2, 0, Math.PI * 2);
            context.fill();
            context.restore();
          });
          var ball = new Anicanvas.Sprite('ball' + i, { left: left, top: top, width: width, height: width, opacity: opacity, velocityX: velocityX, velocityY: velocityY }, ballPainter, { ballRoll: ballRoll });
          _this3.AC.append(ball);
        };

        for (var i = 0; i < 1; i++) {
          _loop(i);
        }
      }
    }]);
    return Invitation;
  }();

})));
//# sourceMappingURL=index.es5.js.map
