(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.anicanvas = {})));
}(this, (function (exports) { 'use strict';

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

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  /*
  * 精灵类，用于处理各种精灵对象的绘制和行为
  * 
  */
  var Sprite = function () {
    function Sprite() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var painter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var behaviors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      classCallCheck(this, Sprite);

      this.name = name;
      this.painter = painter;
      this.behaviors = behaviors;
      this.top = 0;
      this.left = 0;
      this.width = 10;
      this.height = 10;
      this.velocityX = 0;
      this.velocityY = 0;
      this.rotate_velocity = 0;
      this.rotate = 0;
      this.opacity = 1;
      this.visible = true;
      this.animating = false;
      this.zindex = 0;
      this.update_paint = true;
      this.update_painted = false;
      this.data = {};
      this.initArgs(args);
      this.rotate_point = { x: this.left + this.width / 2, y: this.top + this.height / 2 };
      return this;
    }

    createClass(Sprite, [{
      key: 'initArgs',
      value: function initArgs(args) {
        Object.assign(this, args);
      }
      /*设置精灵路径*/

    }, {
      key: 'setPath',
      value: function setPath(fn) {
        typeof fn == 'function' && (this.path = fn);
      }
    }, {
      key: 'paint',
      value: function paint(context, time, fdelta, data) {
        if (this.painter !== undefined && this.visible) {
          if (!this.update_painted) {
            this.painter.paint(this, context, time, fdelta, data);
            this.update_painted = this.update_paint ? true : false;
          }
        }
      }
    }, {
      key: 'update',
      value: function update(context, time, fdelta, data) {
        var behaviors = this.behaviors;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(behaviors)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            var behavior = behaviors[i];
            if (behavior.delay) {
              if (time - behavior.delay < 0) {
                continue;
              }
              time = time - behavior.delay;
            }
            typeof behavior.execute == 'function' && behavior.execute(this, context, time, fdelta, data);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (this.update_paint) {
          this.update_painted = false;
          this.paint(context, time, fdelta, data);
        }
      }
    }]);
    return Sprite;
  }();

  /*
  * 精灵类，用于处理各种精灵对象的绘制和行为
  * 
  */
  var Sprite$1 = function () {
    function Sprite() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var painter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var behaviors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      classCallCheck(this, Sprite);

      this.name = name;
      this.painter = painter;
      this.behaviors = behaviors;
      this.top = 0;
      this.left = 0;
      this.width = 10;
      this.height = 10;
      this.velocityX = 0;
      this.velocityY = 0;
      this.rotate_velocity = 0;
      this.rotate = 0;
      this.opacity = 1;
      this.visible = true;
      this.animating = false;
      this.zindex = 0;
      this.update_paint = true;
      this.update_painted = false;
      this.data = {};
      this.initArgs(args);
      this.rotate_point = { x: this.left + this.width / 2, y: this.top + this.height / 2 };
      return this;
    }

    createClass(Sprite, [{
      key: 'initArgs',
      value: function initArgs(args) {
        Object.assign(this, args);
      }
      /*设置精灵路径*/

    }, {
      key: 'setPath',
      value: function setPath(fn) {
        typeof fn == 'function' && (this.path = fn);
      }
    }, {
      key: 'paint',
      value: function paint(context, time, fdelta, data) {
        if (this.painter !== undefined && this.visible) {
          if (!this.update_painted) {
            this.painter.paint(this, context, time, fdelta, data);
            this.update_painted = this.update_paint ? true : false;
          }
        }
      }
    }, {
      key: 'update',
      value: function update(context, time, fdelta, data) {
        var behaviors = this.behaviors;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(behaviors)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            var behavior = behaviors[i];
            if (behavior.delay) {
              if (time - behavior.delay < 0) {
                continue;
              }
              time = time - behavior.delay;
            }
            typeof behavior.execute == 'function' && behavior.execute(this, context, time, fdelta, data);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (this.update_paint) {
          this.update_painted = false;
          this.paint(context, time, fdelta, data);
        }
      }
    }]);
    return Sprite;
  }();

  /*
  * 公共函数
  */

  /*
  * 图层类，用于提供多层容器
  * 
  */

  var Layer = function (_Sprite) {
    inherits(Layer, _Sprite);

    function Layer() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var painter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var behaviors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      classCallCheck(this, Layer);

      var _this2 = possibleConstructorReturn(this, (Layer.__proto__ || Object.getPrototypeOf(Layer)).call(this));

      _this2.layers = [];
      _this2.sprites = [];
      _this2.name = name;
      _this2.painter = painter;
      _this2.behaviors = behaviors;
      Object.assign(_this2, args);
      return _this2;
    }

    createClass(Layer, [{
      key: 'paint',
      value: function paint(context, time, fdelta, data) {
        if (this.painter) {
          this.painter.paint(this, context, time, fdelta);
        }
      }
    }, {
      key: 'update',
      value: function update(context, time, fdelta, data) {
        for (var i = 0; i < this.behaviors.length; ++i) {
          this.behaviors[i].execute(this, context, time, fdelta);
        }
        this.paint(context, time, fdelta, data);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _i = _step.value;

            _i.update(context, time, fdelta, data);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.sprites[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _i2 = _step2.value;

            _i2.update(context, time, fdelta, data);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.layers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _i3 = _step3.value;

            _i3.paint(context, time, fdelta);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.sprites[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _i4 = _step4.value;

            _i4.paint(context, time, fdelta);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }
      /*添加精灵*/

    }, {
      key: 'addSprite',
      value: function addSprite(sprite) {
        var _this = this;
        _this.sprites.push(sprite);
        objKeySort(_this.sprites, 'zindex');
      }
    }]);
    return Layer;
  }(Sprite$1);

  /*
  * 绘制器基础类，用于提供基础的绘制器逻辑方便扩展
  * 
  */
  var Painter = function () {
    function Painter() {
      classCallCheck(this, Painter);

      this.image = null;
      this.paint_queue = [];
      this.photo = null;
    }

    createClass(Painter, [{
      key: 'paint',
      value: function paint() {}
    }, {
      key: 'addQueueFn',
      value: function addQueueFn(fn) {
        var add_fn = typeof fn == 'function' ? fn : typeof this[fn] == 'function' ? this[fn] : null;
        add_fn && this.paint_queue.push(add_fn);
      }
    }, {
      key: 'clearQueue',
      value: function clearQueue() {
        this.paint_queue = [];
      }
    }, {
      key: 'runQueue',
      value: function runQueue(sprite, context, time, fdelta, data) {
        var queue = this.paint_queue;
        for (var i = 0; i < queue.length; i++) {
          queue[i](sprite, context, time, fdelta, data);
        }
      }
    }, {
      key: '_setSelfStyles',
      value: function _setSelfStyles(sprite, context) {
        if (sprite.opacity < 1) {
          context.globalAlpha = sprite.opacity;
        }
      }
    }, {
      key: 'rotate',
      value: function rotate(sprite, context, time, fdelta, data) {
        context.translate(sprite.rotate_point.x, sprite.rotate_point.y);
        context.rotate(deg2rad(sprite.rotate));
        sprite.left = -sprite.width / 2;
        sprite.top = -sprite.height / 2;
      }
    }, {
      key: 'getPhoto',
      value: function getPhoto(sprite, context) {
        this.photo = context.getImageData(sprite.left, sprite.top, sprite.width, sprite.height);
      }
    }, {
      key: 'putPhoto',
      value: function putPhoto(sprite, context) {
        context.putImageData(this.photo, sprite.left, sprite.top);
      }
    }]);
    return Painter;
  }();

  /*图片绘画类
  *
  *
  */
  var ImagePainter = function (_Painter) {
    inherits(ImagePainter, _Painter);

    /*
    * @param img 图片
    * @param set 绘制图片的参数
    */
    function ImagePainter(img, set$$1) {
      classCallCheck(this, ImagePainter);

      var _this = possibleConstructorReturn(this, (ImagePainter.__proto__ || Object.getPrototypeOf(ImagePainter)).call(this));

      _this.image = img;
      _this.img_set = set$$1 ? set$$1 : { x: 0, y: 0, w: img.width, h: img.height };
      return _this;
    }

    createClass(ImagePainter, [{
      key: 'paint',
      value: function paint(sprite, context, time, fdelta, data) {
        context.save();
        var sprite_copy = Object.assign({}, sprite);
        this._setSelfStyles(sprite_copy, context);
        this.runQueue(sprite_copy, context, time, fdelta, data);
        var img_set = this.img_set;

        context.drawImage(this.image, img_set.x, img_set.y, img_set.w, img_set.h, sprite_copy.left, sprite_copy.top, sprite_copy.width, sprite_copy.height);
        context.restore();
      }
    }]);
    return ImagePainter;
  }(Painter);
  /*精灵绘画类
  *
  *
  */
  var SheetPainter = function (_Painter2) {
    inherits(SheetPainter, _Painter2);

    /*
    * @param img 图片
    * @param set 绘制图片的参数
    */
    function SheetPainter(img, cells, _ref) {
      var _ref$interval = _ref.interval,
          interval = _ref$interval === undefined ? 1000 : _ref$interval,
          _ref$autoruning = _ref.autoruning,
          autoruning = _ref$autoruning === undefined ? false : _ref$autoruning,
          _ref$iteration = _ref.iteration,
          iteration = _ref$iteration === undefined ? 1 : _ref$iteration,
          _ref$reverse = _ref.reverse,
          reverse = _ref$reverse === undefined ? false : _ref$reverse;
      classCallCheck(this, SheetPainter);

      var _this2 = possibleConstructorReturn(this, (SheetPainter.__proto__ || Object.getPrototypeOf(SheetPainter)).call(this));

      _this2.image = img;
      _this2.cells = cells;
      _this2.reverse = reverse;
      _this2.cell_index = reverse ? _this2.cells.length - 1 : 0;
      _this2.interval = interval;
      _this2.running = autoruning ? true : false;
      _this2.frame_point = 0;
      _this2.timeline = 0;
      _this2.iteration = iteration == 'infinite' ? iteration : parseInt(iteration);
      _this2._countFramePoint(_this2.cell_index);
      return _this2;
    }
    /*索引递增/递减*/


    createClass(SheetPainter, [{
      key: 'advance',
      value: function advance() {
        if (this.reverse ? this.cell_index == 1 : this.cell_index == this.cells.length - 2) {
          this.frame_point = this.timeline = 0;
          Number.isInteger(this.iteration) && this.iteration--;
        }
        this.reverse ? this.cell_index += this.cells.length - 1 : this.cell_index++;
        this.cell_index %= this.cells.length;
        this._countFramePoint(this.cell_index);
      }
      /*关键帧时间点计算*/

    }, {
      key: '_countFramePoint',
      value: function _countFramePoint(index) {
        var next_index = (this.reverse ? index + this.cells.length - 1 : index + 1) % this.cells.length;
        this.frame_point += this._sValue(this.cells[next_index].interval, this.interval);
      }
      /*跳帧*/

    }, {
      key: 'skip',
      value: function skip(frame_index) {
        this.cell_index = frame_index % this.cells.length;
      }
    }, {
      key: 'paint',
      value: function paint(sprite, context, time, fdelta, data) {
        if (this.running) {
          if (this.iteration > 0 || this.iteration == 'infinite') {
            if (this.timeline >= this.frame_point) {
              this.advance();
            }
          }
          var cell = this.cells[this.cell_index],
              sheet_img = cell.img ? this.image[cell.img] : this.image,
              sv = this._sValue;
          context.save();
          context.drawImage(sheet_img, cell.x, cell.y, cell.w, cell.h, sv(cell.sl, sprite.left), sv(cell.st, sprite.top), sv(cell.sw, sprite.width), sv(cell.sh, sprite.height));

          this.timeline += fdelta;
          //console.log(this.timeline,this.frame_point)
          context.restore();
        }
      }
      /*获取有效值*/

    }, {
      key: '_sValue',
      value: function _sValue(cell_val, sprite_val) {
        return Number.isFinite(cell_val) ? cell_val : sprite_val;
      }
    }]);
    return SheetPainter;
  }(Painter);

  /*
  * 动画时间控制器类，用于提供与动画时间播放相关的功能
  * 
  */

  var Behavior = function () {
    function Behavior(args, execute) {
      classCallCheck(this, Behavior);

      var def_args = {
        first_fn: null, //行为首次运行时运行的函数
        animation: null, //动画行为对象
        iteration: 1, //行为运行次数
        timing: null //时间函数
      };
      Object.assign(this, def_args, args);
      /*此部分为精灵行为基础属性*/
      this.execute_fn = typeof execute == 'function' ? execute : this.animation ? this._attrChange : function () {};
      this.timing = typeof this.timing == 'function' ? this.timing : typeof AnimationTimer[this.timing] == 'function' ? AnimationTimer[this.timing](this.timing_args) : null;
      this.first_fn = typeof this.first_fn == 'function' ? this.first_fn : function () {};
      this.first_run = false; //精灵行为首次运行标记
      this.iteration_count = 0; //行为已重复运行次数
      this.sprite_attrs = {}; //精灵初始属性记录对象
      /*以下为精灵动画行为专属属性*/
      this.anima_data = { //动画初始属性
        velocity: defineProperty({ left: 0, top: 0, rotate: 0, width: 0, height: 0, opacity: 0 }, 'rotate', 0), //支持的动画属性
        last_frame: 0, //上一帧时间点
        frame_duration: 0, //关键帧间隔
        first_frame_start: false, //第一帧关键帧是否开始
        frames_time: [] //运行中的帧时间点
      };
      this.anima_runtime = null; //动画运行环境数据
      /*初始化函数*/
    }

    createClass(Behavior, [{
      key: 'execute',
      value: function execute(sprite, context, time, fdelta, data) {
        /*单次执行，用于计算初始值*/
        if (!this.first_run) {
          this._remeberAttrs(sprite);
          this._animationPrepare(sprite);
          this.first_fn();
          this.first_run = true;
        }
        /*行为逻辑*/
        var repeat_count = Math.floor(time / this.duration);
        if (repeat_count > this.iteration_count) {
          this._remeberAttrs(sprite, true);
          console.log(sprite);
          this.iteration_count = repeat_count;
          this._animationPrepare(sprite);
        }

        if (repeat_count < this.iteration || this.iteration == 'infinite') {
          time %= this.duration;
          /*动画执行流程*/
          if (this.animation) {
            var runtime = this.anima_runtime,
                animation = this.animation,
                cur_frame = runtime.frames_time[0];
            if (!runtime.first_frame_start) {
              runtime.frame_duration = runtime.frames_time[0] * this.duration / 100;
              runtime.velocity = this._attrChangeInit(sprite, animation[cur_frame], runtime.frame_duration);
              runtime.first_frame_start = true;
            }
            if (time > cur_frame * this.duration / 100) {
              var last_frame = runtime.frames_time.shift();
              runtime.last_frame = last_frame * this.duration / 100;
              cur_frame = runtime.frames_time[0];
              runtime.frame_duration = (cur_frame - last_frame) * this.duration / 100;
              runtime.velocity = this._attrChangeInit(sprite, animation[cur_frame], runtime.frame_duration);
            }
            var anima_time = time - runtime.last_frame;
            if (this.timing && runtime.frame_duration) {
              var new_time = this._warpTime(time, runtime.frame_duration);
              time = new_time[0];
              fdelta = new_time[1];
            }
            /*行为逻辑函数*/
            this.execute_fn(sprite, context, time, fdelta, data);
          } else {
            /*时间轴扭曲逻辑*/
            if (this.timing && this.duration) {
              var _new_time = this._warpTime(time, this.duration);
              time = _new_time[0];
              fdelta = _new_time[1];
            }
            /*行为逻辑函数*/
            this.execute_fn(sprite, context, time, fdelta, data);
          }
        } else {
          typeof this.animate_callback == 'function' && this.animate_callback(sprite, context);
          delete sprite.behaviors[this.name]; //行为执行完销毁自身W
        }
      }
      /*重置行为动画运行数据*/

    }, {
      key: '_animationPrepare',
      value: function _animationPrepare(sprite) {
        if (this.animation) {
          this._setAnimaData();
          !this.animation['0'] && !this.animation['100'] && (this.animation = { '100': this.animation }); //处理单层数据
          var animation = this.animation,
              anima_runtime = this.anima_runtime;
          for (var i in animation) {
            if (i == 0) {
              this._spriteAttrSet(sprite, animation[0]);
            } else {
              anima_runtime['frames_time'].push(i);
            }
          }
        }
      }
      /*重置行为动画运行数据*/

    }, {
      key: '_setAnimaData',
      value: function _setAnimaData() {
        if (this.animation) {
          this.anima_runtime = JSON.parse(JSON.stringify(this.anima_data)); //重置动画运行环境数据
        }
      }
      /* 时间轴扭曲函数
      * @param time 行为运行时间
      */

    }, {
      key: '_warpTime',
      value: function _warpTime(time, duration) {
        var percent = time / duration;
        var warp_time = this.timing(percent) / percent * time;
        !this.last_time && (this.last_time = warp_time);
        var warp_fdelta = warp_time - this.last_time;
        this.last_time = warp_time;
        this.org_time = [warp_time, warp_fdelta];
        return this.org_time;
      }
      /*属性变换初始化函数*/

    }, {
      key: '_attrChangeInit',
      value: function _attrChangeInit(sprite, anima_args, duration) {
        var anima_vel = {};
        for (var i in anima_args) {
          var arg = anima_args[i],
              relative_val = 0,
              relative_key = typeof arg == 'string' ? arg.substr(0, 2) : null;
          if (relative_key == '+=' || relative_key == '-=') {
            relative_val = parseFloat(arg.replace('=', ''));
          } else {
            relative_val = arg - sprite[i];
          }
          anima_vel[i] = relative_val / duration;
        }
        return anima_vel;
      }

      /*属性变换函数*/

    }, {
      key: '_attrChange',
      value: function _attrChange(sprite, context, time, fdelta, data) {
        var _this = this,
            anima_vel = _this.anima_runtime.velocity;
        for (var i in anima_vel) {
          sprite[i] += anima_vel[i] * fdelta;
        }
      }
      /*属性设置函数*/

    }, {
      key: '_spriteAttrSet',
      value: function _spriteAttrSet(sprite, attrs) {
        var sprite_keys = this.anima_data.velocity;
        for (var i in sprite_keys) {
          attrs[i] !== undefined && (sprite[i] = attrs[i]);
        }
      }
      /*属性变换函数*/

    }, {
      key: '_remeberAttrs',
      value: function _remeberAttrs(sprite, restore) {
        if (Object.keys(sprite.behaviors).length == 1 && (this.iteration > 1 || this.iteration == 'infinite')) {
          var _this = this,
              sprite_attrs = _this.sprite_attrs,
              anima_vel = _this.anima_data.velocity;
          if (Object.keys(sprite_attrs) == 0 && !restore) {
            for (var i in anima_vel) {
              sprite_attrs[i] = sprite[i];
            }
          }
          if (restore && sprite_attrs) {
            this._spriteAttrSet(sprite, sprite_attrs);
          }
        }
      }
    }]);
    return Behavior;
  }();

  /*
  * 动画时间控制器类，用于提供与动画时间播放相关的功能
  * 
  */

  var AnimationTimer$1 = function () {
    function AnimationTimer(animation) {
      classCallCheck(this, AnimationTimer);

      this.animation = typeof animation == 'function' ? animation : function () {};
      this.start_time = 0;
      this.last_time = 0;
      this.running = false;
      this.playing = false;
      this.time = 0;
      this.elapsed = 0;
      this.anim_handle = null;
    }

    createClass(AnimationTimer, [{
      key: 'start',
      value: function start() {
        var _this = this;
        _this.start_time = +new Date();
        _this.running = true;
        _this.play();
        var animation = function animation(time) {
          if (_this.playing) {
            if (!_this.last_time) {
              _this.last_time = time;
            } else {
              _this.time = time - _this.last_time;
              _this.elapsed += _this.time;
              _this.last_time = time;
              _this.animation(_this.elapsed, _this.time);
            }
            _this.anim_handle = window.requestAnimationFrame(animation);
          }
        };
        _this.anim_handle = window.requestAnimationFrame(animation);
      }
    }, {
      key: 'play',
      value: function play() {
        var _this = this;
        _this.playing = true;
      }
    }, {
      key: 'pause',
      value: function pause() {
        var _this = this;
        _this.last_time = 0;
        _this.playing = false;
      }
    }, {
      key: 'stop',
      value: function stop() {
        this.elapsed = +new Date() - this.start_time;
        this.running = false;
        window.cancelAnimationFrame(this.anim_handle);
      }
    }, {
      key: 'getElapsedTime',
      value: function getElapsedTime() {
        if (this.running) {
          return +new Date() - this.start_time;
        } else {
          return this.elapsed;
        }
      }
    }, {
      key: 'getRuningTime',
      value: function getRuningTime() {
        return this.time;
      }
    }, {
      key: 'getNextTime',
      value: function getNextTime() {
        var true_time = this.time,
            percent_complete = true_time / this.duration;
        if (!this.running) return undefined;
        if (this.timeWrap == undefined) return elapsed_time;
        return elapsed_time * (this.timeWarp(percent_complete) / percent_complete);
      }
    }, {
      key: 'isRunning',
      value: function isRunning() {
        return this.running;
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.elapsed = 0;
      }
    }], [{
      key: 'getWarpTime',
      value: function getWarpTime(warp_fn, time, duration) {
        if (typeof warp_fn == 'function') {
          var percent = time / duration;
          return time * warp_fn(percent) / percent;
        }
      }
      /*基础事件控制函数*/

    }, {
      key: 'easeIn',
      value: function easeIn(strength) {
        return function (percent_complete) {
          return Math.pow(percent_complete, strength * 2);
        };
      }
    }, {
      key: 'easeOut',
      value: function easeOut(strength) {
        return function (percent_complete) {
          return 1 - Math.pow(1 - percent_complete, strength * 2);
        };
      }
    }, {
      key: 'easeInOut',
      value: function easeInOut() {
        return function (percent_complete) {
          return percent_complete - Math.sin(percent_complete * 2 * Math.PI) / (2 * Math.PI);
        };
      }
    }, {
      key: 'elastic',
      value: function elastic(passes) {
        passes = passes || this.def_opts.elastic_passes;
        return function (percent_complete) {
          return (1 - Math.cos(percent_complete * Math.PI * passes)) * (1 - percent_complete) + percent_complete;
        };
      }
    }, {
      key: 'bounce',
      value: function bounce(bounces) {
        var fn = AnimationTimer.elastic(bounces);
        return function () {
          percent_complete = fn(percent_complete);
          return percent_complete <= 1 ? percent_complete : 2 - percent_complete;
        };
      }
    }, {
      key: 'linear',
      value: function linear() {
        return function (percent_complete) {
          return percent_complete;
        };
      }
    }, {
      key: 'step',
      value: function step() {
        return function (percent_complete) {
          return percent_complete;
        };
      }
    }]);
    return AnimationTimer;
  }();

  /*
  * 资源加载模块类，用于加载资源
  * 
  */
  var MediaLoad = function () {
    function MediaLoad() {
      var mediaobj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      classCallCheck(this, MediaLoad);

      this.images = {
        total: { s: 0, f: 0, t: 0 },
        queue: { s: 0, f: 0, t: 0 },
        urls: []
      };
      this.image = {};
      this.audios = {
        total: { s: 0, f: 0, t: 0 },
        queue: { s: 0, f: 0, t: 0 },
        urls: []
      };
      this.audio = {};
      mediaobj && this.loadingMedia(mediaobj, callback);
    }
    /*加载资源*/


    createClass(MediaLoad, [{
      key: 'loadingMedia',
      value: function loadingMedia(mediaobj, callback) {
        this.loadingImages(mediaobj.image || {}, callback, true);
        this.loadingAudios(mediaobj.audio || {}, callback, true);
        return this;
      }
      /*加载图片,返回对象实例*/

    }, {
      key: 'loadingImages',
      value: function loadingImages() {
        var image_list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var is_array = Array.isArray(image_list) ? true : false;
        if (image_list) {
          this.images.queue = { s: 0, f: 0, t: 0 };
          for (var i in image_list) {
            var key = is_array ? image_list[i] : i;
            this.loadImage(key, image_list[i], callback);
          }
        }
        return this;
      }
    }, {
      key: 'loadImage',
      value: function loadImage(key, img_url, callback, checkall) {
        var _this = this,
            images = _this.images;
        if (!images['urls'][img_url]) {
          images.total.t++;
          images.queue.t++;
          images['urls'].push(img_url);
          var image = new Image(),
              check_fn = checkall ? _this.getMediaProgress : _this.getImageProgress;
          image.addEventListener('load', function () {
            images.total.s++;
            images.queue.s++;
            if (check_fn(_this)[2] == 100) {
              callback();
            }
          });
          image.addEventListener('error', function () {
            images.total.f++;
            images.queue.f++;
            if (check_fn(_this)[2] == 100) {
              callback();
            }
          });
          image.src = img_url;
          _this.image[key] = image;
        }
      }
      /*获取图片加载进度，输出为[加载数，总数，百分比]的数组格式*/

    }, {
      key: 'getImageProgress',
      value: function getImageProgress(self) {
        var queue = self.images.queue,
            loaded = queue.s + queue.f,
            percent = Math.round(loaded / queue.t * 100);
        return [loaded, queue.t, percent];
      }
      /*加载音频资源,返回对象实例*/

    }, {
      key: 'loadingAudios',
      value: function loadingAudios() {
        var audio_list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var is_array = Array.isArray(audio_list) ? true : false;
        if (audio_list) {
          this.audios.queue = { s: 0, f: 0, t: 0 };
          for (var i in audio_list) {
            var key = is_array ? audio_list[i] : i;
            this.loadAudio(key, audio_list[i], callback);
          }
        }
        return this;
      }
    }, {
      key: 'loadAudio',
      value: function loadAudio(key, audio_url, callback, checkall) {
        var _this = this,
            audios = _this.audios;
        if (!audios['urls'][audio_url]) {
          audios.total.t++;
          audios.queue.t++;
          audios['urls'].push(audio_url);
          var audio = new Audio(),
              check_fn = checkall ? _this.getMediaProgress : _this.getImageProgress;
          audio.addEventListener('loadedmetadata', function () {
            audios.total.s++;
            audios.queue.s++;
            if (check_fn(_this)[2] == 100) {
              callback();
            }
          });
          audio.addEventListener('error', function () {
            audios.total.f++;
            audios.queue.f++;
            if (check_fn(_this)[2] == 100) {
              callback();
            }
          });
          audio.src = audio_url;
          _this.audio[key] = audio;
        }
      }
    }, {
      key: 'getAudioProgress',
      value: function getAudioProgress(self) {
        var queue = self.audios.queue,
            loaded = queue.s + queue.f,
            percent = Math.round(loaded / queue.t * 100);
        return [loaded, queue.t, percent];
      }
      /*获取总资源加载进度*/

    }, {
      key: 'getMediaProgress',
      value: function getMediaProgress(self) {
        var images = self.images.queue,
            audios = self.audios.queue,
            loaded = audios.s + audios.f + images.s + images.f,
            total = audios.t + images.t,
            percent = Math.round(loaded / total * 100);
        return [loaded, total, percent];
      }
    }]);
    return MediaLoad;
  }();

  var Stage = function () {
    function Stage() {
      classCallCheck(this, Stage);
    }

    createClass(Stage, [{
      key: 'reszie',
      value: function reszie() {}
    }]);
    return Stage;
  }();

  exports.Stage = Stage;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
