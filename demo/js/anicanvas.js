(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Anicanvas = factory());
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

  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
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
  * 媒体文件类，用于处理媒体对象的行为
  * 
  */

  var Media = function () {
    function Media() {
      classCallCheck(this, Media);
    }

    createClass(Media, [{
      key: "play",
      value: function play(name) {
        this[name] && this[name].play && this[name].play();
      }
    }, {
      key: "pause",
      value: function pause(name) {
        this[name] && this[name].pause && this[name].pause();
      }
    }]);
    return Media;
  }();

  /*
  * 公共函数
  */
  /* 创建dom元素 */
  function createHtmlElement(tag, attrs, styles) {
    var elem = document.createElement(tag);
    isType(attrs, 'object') && Object.assign(elem, attrs);
    isType(styles, 'object') && Object.assign(elem.style, styles);
    return elem;
  }
  /* 创建dom元素 */
  function objectFilter(obj, keys, def) {
    var result = {};
    isType(obj, 'object') && isType(keys, 'array') && keys.forEach(function (item) {
      obj.hasOwnProperty(item) ? result[item] = obj[item] : def && (result[item] = undefined);
    });
    return result;
  }
  /* 对象数组按某一键值排序 */
  function isType(value, type) {
    return typeof type === 'string' ? Object.prototype.toString.call(value).toLowerCase() === '[object ' + type.toLowerCase() + ']' : null;
  }
  /* 判断变量是否是数字或数字字符串 */
  function isNumeric(obj) {
    return (isType(obj, 'number') || isType(obj, 'string')) && !isNaN(obj - parseFloat(obj));
  }
  /* json数据对比 */
  function jsonEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  /* 对象数组按某一键值排序 */
  function objKeySort() {
    var obj_arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var desc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    return obj_arr.sort(function (a, b) {
      if (a[key] !== undefined && b[key] !== undefined) {
        if (a[key] < b[key]) {
          return desc ? 1 : -1;
        } else if (a[key] > b[key]) {
          return desc ? -1 : 1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });
  }
  /* 角度转化弧度 */
  function deg2rad(deg) {
    return Math.PI / 180 * deg;
  }
  /* 错误处理 */
  function errWarn(error) {
    console.log(error);
  }

  /*
  * 精灵类，用于处理各种精灵对象的绘制和行为
  * 
  */
  var relevantProps = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    velocityX: 0,
    velocityY: 0,
    rotateVelocity: 0,
    rotate: 0,
    opacity: 1,
    visible: true,
    animating: false,
    zindex: 0,
    destroy: false,
    rotatePoint: { x: 0, y: 0 }
  };

  var Sprite = function () {
    function Sprite() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var painter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var behaviors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      classCallCheck(this, Sprite);
      this._startTime = 0;
      this._autoRP = true;
      this._updated = false;
      this.$data = {};
      this.$media = new Media();
      this.TYPE = 'sprite';

      this.name = name;
      this._painter = painter;
      this.behaviors = isType(behaviors, 'object') ? behaviors : {};
      this.injectRelevantProps();
      this.initArgs(args);
    }

    createClass(Sprite, [{
      key: 'initArgs',
      value: function initArgs(args) {
        Object.assign(this, args);
      }
    }, {
      key: 'injectRelevantProps',
      value: function injectRelevantProps() {
        var _this2 = this;

        Object.keys(relevantProps).forEach(function (name) {
          var oldValue = relevantProps[name];
          var _this = _this2;
          Object.defineProperty(_this2, name, {
            enumerable: true,
            configurable: true,
            get: function get$$1() {
              return oldValue;
            },
            set: function set$$1(newValue) {
              _this._checkAutoRp(name, newValue);
              if (newValue === oldValue || jsonEqual(newValue, oldValue)) {
                return;
              }
              oldValue = newValue;
              _this._autoRotatePoint(name);
              _this.updated = true;
            }
          });
        });
      }
    }, {
      key: '_checkAutoRp',
      value: function _checkAutoRp(name, newValue) {
        if (name === 'rotatePoint' && isType(newValue, 'object')) {
          !newValue.auto ? this._autoRP = false : delete newValue['auto'];
        }
      }
    }, {
      key: '_autoRotatePoint',
      value: function _autoRotatePoint(name) {
        if (!this._autoRP) return;
        if (['left', 'top', 'width', 'height'].indexOf(name) >= 0) {
          this.rotatePoint = this._spriteRP();
        }
      }
    }, {
      key: '_spriteRP',
      value: function _spriteRP() {
        return { x: this.left + this.width / 2, y: this.top + this.height / 2, auto: true };
      }
      /*设置精灵路径*/

    }, {
      key: 'setPath',
      value: function setPath(fn) {
        isType(fn, 'function') && (this.path = fn);
      }
    }, {
      key: 'paint',
      value: function paint(context, time, fdelta, data) {
        if (this._painter && this._painter.paint && this.visible) {
          var _ref = this.$parent || { left: 0, top: 0 },
              left = _ref.left,
              top = _ref.top;

          context.save();
          context.translate(left, top);
          this._painter.paint(this, context, time, fdelta, data);
          context.restore();
        }
      }
    }, {
      key: 'update',
      value: function update(time, fdelta, data, context) {
        !this._startTime && (this._startTime = time);
        this._runBehaviors(time, fdelta, data, context);
        this.updated && (context.isStatic = false);
        this.updated = false;
      }
    }, {
      key: '_runBehaviors',
      value: function _runBehaviors(time, fdelta, data, context) {
        var behaviors = this.behaviors,
            _startTime = this._startTime;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(behaviors)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            var behavior = behaviors[i];
            if (behavior.delay) {
              if (time - _startTime - behavior.delay < 0) {
                continue;
              }
              time = time - _startTime - behavior.delay;
            }
            isType(behavior.execute, 'function') && behavior.execute(this, time, fdelta, data, context);
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
      }
    }]);
    return Sprite;
  }();

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
      var behaviors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      classCallCheck(this, Layer);

      var _this = possibleConstructorReturn(this, (Layer.__proto__ || Object.getPrototypeOf(Layer)).call(this, name, args, painter, behaviors));

      _this.TYPE = 'layer';

      _this.children = [];
      return _this;
    }

    createClass(Layer, [{
      key: 'paint',
      value: function paint(context, time, fdelta, data) {
        get(Layer.prototype.__proto__ || Object.getPrototypeOf(Layer.prototype), 'paint', this).call(this, context, time, fdelta, data);
        this.children.forEach(function (i) {
          return i.paint && i.paint(context, time, fdelta);
        });
      }
    }, {
      key: 'update',
      value: function update(time, fdelta, data, context) {
        get(Layer.prototype.__proto__ || Object.getPrototypeOf(Layer.prototype), 'update', this).call(this, time, fdelta, data, context);
        this.children.forEach(function (i, index, arr) {
          i.destroy && arr.splice(index, 1);
          i.update && i.update(time, fdelta, data, context);
        });
      }
      /* 添加子元素，精灵或层 */

    }, {
      key: 'append',
      value: function append() {
        var _this2 = this;

        var children = this.children;

        for (var _len = arguments.length, child = Array(_len), _key = 0; _key < _len; _key++) {
          child[_key] = arguments[_key];
        }

        children.push.apply(children, child);
        child.forEach(function (item) {
          return item.$parent = _this2;
        });
        objKeySort(children, 'zindex');
      }
    }]);
    return Layer;
  }(Sprite);


  var BaseLayer = function (_Layer) {
    inherits(BaseLayer, _Layer);

    function BaseLayer() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      classCallCheck(this, BaseLayer);
      return possibleConstructorReturn(this, (BaseLayer.__proto__ || Object.getPrototypeOf(BaseLayer)).call(this, 'BASELAYER-' + name, args));
    }

    createClass(BaseLayer, [{
      key: 'update',
      value: function update(time, fdelta, data, context) {
        context.isStatic = true;
        get(BaseLayer.prototype.__proto__ || Object.getPrototypeOf(BaseLayer.prototype), 'update', this).call(this, time, fdelta, data, context);
      }
    }, {
      key: 'paint',
      value: function paint(context, time, fdelta, data) {
        if (!context.isStatic) {
          var width = this.width,
              height = this.height;

          context.clearRect(0, 0, width, height);
          get(BaseLayer.prototype.__proto__ || Object.getPrototypeOf(BaseLayer.prototype), 'paint', this).call(this, context, time, fdelta, data);
        }
      }
    }]);
    return BaseLayer;
  }(Layer);

  var Stage = function () {
    function Stage(name, options) {
      var _this = this;

      classCallCheck(this, Stage);
      this._playing = true;

      this.update = function (elapsed, fdelta, data) {
        if (_this._playing) {
          var context = _this._ctx;
          _this._stage.update(elapsed, fdelta, data, context);
          _this._stage.paint(context, elapsed, fdelta, data);
        }
      };

      this.append = function () {
        var _stage;

        (_stage = _this._stage).append.apply(_stage, arguments);
      };

      this.$canvas = this.elemInit(name, options);
      this.resetOptions(options, true);
      this.stageInit(name);
      this.$layers = {};
    }

    createClass(Stage, [{
      key: 'resetOptions',
      value: function resetOptions(options, fresh) {
        fresh || !this._options ? this._options = Object.assign({}, options) : Object.assign(this._options, options);
      }
    }, {
      key: 'elemInit',
      value: function elemInit(name, options) {
        var attrs = objectFilter(options, ['width', 'height']);
        var styles = Object.assign({}, options, { position: 'absolute' });
        var canvasEle = isType(name, 'string') ? createHtmlElement('canvas', attrs, styles) : name;
        canvasEle = isType(canvasEle, 'HTMLCanvasElement') ? canvasEle : null;
        canvasEle && (canvasEle.id = 'AC_' + name);
        return canvasEle;
      }
    }, {
      key: 'stageInit',
      value: function stageInit(name) {
        var args = objectFilter(this._options, ['width', 'height']);
        this._stage = new BaseLayer(name, args);
        if (this.$canvas) {
          this._ctx = this.$canvas.getContext('2d');
        } else {
          errWarn('no accessable canvas element!');
        }
      }
    }, {
      key: 'play',
      value: function play() {
        this._playing = true;
      }
    }, {
      key: 'pause',
      value: function pause() {
        this._playing = false;
      }
    }, {
      key: 'setCanvasSize',
      value: function setCanvasSize() {
        var _options = this._options,
            width = _options.width,
            height = _options.height;

        if (isNumeric(width) && isNumeric(height)) {
          Object.assign(this.$canvas, { width: width, height: height });
        }
      }
    }, {
      key: 'resize',
      value: function resize() {
        this.setCanvasSize();
      }
    }]);
    return Stage;
  }();

  /*
  * 精灵类，用于处理各种精灵对象的绘制和行为
  * 
  */
  var relevantProps$1 = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    velocityX: 0,
    velocityY: 0,
    rotateVelocity: 0,
    rotate: 0,
    opacity: 1,
    visible: true,
    animating: false,
    zindex: 0,
    destroy: false,
    rotatePoint: { x: 0, y: 0 }
  };

  var Sprite$1 = function () {
    function Sprite() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var painter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var behaviors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      classCallCheck(this, Sprite);
      this._startTime = 0;
      this._autoRP = true;
      this._updated = false;
      this.$data = {};
      this.$media = new Media();
      this.TYPE = 'sprite';

      this.name = name;
      this._painter = painter;
      this.behaviors = isType(behaviors, 'object') ? behaviors : {};
      this.injectRelevantProps();
      this.initArgs(args);
    }

    createClass(Sprite, [{
      key: 'initArgs',
      value: function initArgs(args) {
        Object.assign(this, args);
      }
    }, {
      key: 'injectRelevantProps',
      value: function injectRelevantProps() {
        var _this2 = this;

        Object.keys(relevantProps$1).forEach(function (name) {
          var oldValue = relevantProps$1[name];
          var _this = _this2;
          Object.defineProperty(_this2, name, {
            enumerable: true,
            configurable: true,
            get: function get$$1() {
              return oldValue;
            },
            set: function set$$1(newValue) {
              _this._checkAutoRp(name, newValue);
              if (newValue === oldValue || jsonEqual(newValue, oldValue)) {
                return;
              }
              oldValue = newValue;
              _this._autoRotatePoint(name);
              _this.updated = true;
            }
          });
        });
      }
    }, {
      key: '_checkAutoRp',
      value: function _checkAutoRp(name, newValue) {
        if (name === 'rotatePoint' && isType(newValue, 'object')) {
          !newValue.auto ? this._autoRP = false : delete newValue['auto'];
        }
      }
    }, {
      key: '_autoRotatePoint',
      value: function _autoRotatePoint(name) {
        if (!this._autoRP) return;
        if (['left', 'top', 'width', 'height'].indexOf(name) >= 0) {
          this.rotatePoint = this._spriteRP();
        }
      }
    }, {
      key: '_spriteRP',
      value: function _spriteRP() {
        return { x: this.left + this.width / 2, y: this.top + this.height / 2, auto: true };
      }
      /*设置精灵路径*/

    }, {
      key: 'setPath',
      value: function setPath(fn) {
        isType(fn, 'function') && (this.path = fn);
      }
    }, {
      key: 'paint',
      value: function paint(context, time, fdelta, data) {
        if (this._painter && this._painter.paint && this.visible) {
          var _ref = this.$parent || { left: 0, top: 0 },
              left = _ref.left,
              top = _ref.top;

          context.save();
          context.translate(left, top);
          this._painter.paint(this, context, time, fdelta, data);
          context.restore();
        }
      }
    }, {
      key: 'update',
      value: function update(time, fdelta, data, context) {
        !this._startTime && (this._startTime = time);
        this._runBehaviors(time, fdelta, data, context);
        this.updated && (context.isStatic = false);
        this.updated = false;
      }
    }, {
      key: '_runBehaviors',
      value: function _runBehaviors(time, fdelta, data, context) {
        var behaviors = this.behaviors,
            _startTime = this._startTime;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(behaviors)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            var behavior = behaviors[i];
            if (behavior.delay) {
              if (time - _startTime - behavior.delay < 0) {
                continue;
              }
              time = time - _startTime - behavior.delay;
            }
            isType(behavior.execute, 'function') && behavior.execute(this, time, fdelta, data, context);
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
      }
    }]);
    return Sprite;
  }();

  /*
  * 绘制器基础类，用于提供基础的绘制器逻辑方便扩展
  * 
  */

  var Painter = function () {
    function Painter(paint) {
      classCallCheck(this, Painter);

      this.image = null;
      this.paint_queue = [];
      this.photo = null;
      isType(paint, 'function') && (this.paint = paint.bind(this));
    }

    createClass(Painter, [{
      key: 'paint',
      value: function paint(sprite, context, time, fdelta, data) {}
    }, {
      key: 'addQueueFn',
      value: function addQueueFn(fn) {
        var add_fn = isType(fn, 'function') ? fn : isType(this[fn], 'function') ? this[fn] : null;
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
          context.globalAlpha = sprite.opacity > 0 ? sprite.opacity : 0;
        }
      }
    }, {
      key: 'rotate',
      value: function rotate(sprite, context, time, fdelta, data) {
        context.translate(sprite.rotatePoint.x, sprite.rotatePoint.y);
        context.rotate(deg2rad(sprite.rotate));
        sprite.left = -sprite.width / 2;
        sprite.top = -sprite.height / 2;
      }
    }, {
      key: 'getPhoto',
      value: function getPhoto(sprite, context) {
        sprite.data.photo = context.getImageData(sprite.left, sprite.top, sprite.width, sprite.height);
      }
    }, {
      key: 'putPhoto',
      value: function putPhoto(sprite, context) {
        context.putImageData(sprite.data.photo, sprite.left, sprite.top);
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
    function ImagePainter() {
      var img = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var set$$1 = arguments[1];
      classCallCheck(this, ImagePainter);

      var _this = possibleConstructorReturn(this, (ImagePainter.__proto__ || Object.getPrototypeOf(ImagePainter)).call(this));

      _this.image = img;
      _this.imgSet = set$$1 ? set$$1 : { x: 0, y: 0, w: img && img.width, h: img && img.height };
      return _this;
    }

    createClass(ImagePainter, [{
      key: 'paint',
      value: function paint(sprite, context, time, fdelta, data) {
        if (this.image) {
          context.save();
          var spriteCopy = Object.assign({}, sprite);
          this._setSelfStyles(spriteCopy, context);
          this.runQueue(spriteCopy, context, time, fdelta, data);
          var imgSet = this.imgSet;

          context.drawImage(this.image, imgSet.x, imgSet.y, imgSet.w, imgSet.h, spriteCopy.left, spriteCopy.top, spriteCopy.width, spriteCopy.height);
          context.restore();
        }
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

  var AnimationTimer = function () {
    function AnimationTimer(animation) {
      classCallCheck(this, AnimationTimer);

      this._animation = isType(animation, 'function') ? animation : function () {};
      this.startTime = 0;
      this.lastTime = 0;
      this.running = false;
      this._playing = false;
      this.time = 0;
      this.elapsed = 0;
      this._animHandle = null;
    }

    createClass(AnimationTimer, [{
      key: 'start',
      value: function start() {
        var _this = this;

        if (!this.running) {
          this.startTime = +new Date();
          this.running = true;
          this.play();
          var animation = function animation(time) {
            if (_this._playing) {
              if (!_this.lastTime) {
                _this.lastTime = time;
              } else {
                _this.time = time - _this.lastTime;
                _this.elapsed += _this.time;
                _this.lastTime = time;
                _this._animation(_this.elapsed, _this.time);
              }
            }
            _this._animHandle = window.requestAnimationFrame(animation);
          };
          this._animHandle = window.requestAnimationFrame(animation);
        }
      }
    }, {
      key: 'play',
      value: function play() {
        this._playing = true;
      }
    }, {
      key: 'pause',
      value: function pause() {
        this.lastTime = 0;
        this._playing = false;
      }
    }, {
      key: 'stop',
      value: function stop() {
        this.elapsed = +new Date() - this.startTime;
        this.running = false;
        window.cancelAnimationFrame(this._animHandle);
      }
    }, {
      key: 'getElapsedTime',
      value: function getElapsedTime() {
        if (this.running) {
          return +new Date() - this.startTime;
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
        var trueTime = this.time,
            percentComplete = trueTime / this.duration;
        if (!this.running) return undefined;
        if (this.timeWrap == undefined) return elapsedTime;
        return elapsedTime * (this.timeWarp(percentComplete) / percentComplete);
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
  * 动画时间控制器类，用于提供与动画时间播放相关的功能
  * 
  */

  var Behavior = function () {
    function Behavior(args, execute) {
      classCallCheck(this, Behavior);

      var defArgs = {
        firstFn: null, //行为首次运行时运行的函数
        animation: null, //动画行为对象
        iteration: 1, //行为运行次数
        timing: null, //时间函数,
        fillMode: null //时间结束后样式
      };
      Object.assign(this, defArgs, args);
      /*此部分为精灵行为基础属性*/
      // 确认行为执行函数
      this.executeFn = isType(execute, 'function') ? execute : this.animation ? this._attrChange : function () {};
      // 确定时间轴函数
      this.timing = isType(this.timing, 'function') ? this.timing : isType(AnimationTimer[this.timing], 'function') ? AnimationTimer[this.timing](this.timingArgs) : null;
      this.firstFn = isType(this.firstFn, 'function') ? this.firstFn : function () {}; // 行为首次运行函数
      this._firstRun = false; // 精灵行为首次运行标记
      this._iterationCount = 0; // 行为已重复运行次数
      this._spriteAttrs = {}; // 精灵初始属性记录对象
      /*以下为精灵动画行为专属属性*/
      this._animaProps = this._animaInitProps();
      this._animaRuntime = null; //动画运行环境数据
      /*初始化函数*/
    }

    createClass(Behavior, [{
      key: '_animaInitProps',
      value: function _animaInitProps() {
        return { //动画初始属性
          velocity: defineProperty({ left: 0, top: 0, rotate: 0, width: 0, height: 0, opacity: 0 }, 'rotate', 0), //支持的动画属性
          lastFrame: 0, //上一帧时间点
          frameDuration: 0, //关键帧间隔
          framesTime: [] //运行中的帧时间点
        };
      }
    }, {
      key: 'execute',
      value: function execute(sprite, time, fdelta, data, context) {
        /*单次执行，用于计算初始值*/
        if (!this._firstRun) {
          this._remeberAttrs(sprite);
          this._animationPrepare(sprite);
          this.firstFn();
          this._iterationCount++;
          this._firstRun = true;
        }

        /*行为逻辑*/
        var repeatCount = Math.floor(time / this.duration);
        if (repeatCount === this._iterationCount) {
          if (this._checkIterationCount(repeatCount)) {
            this._iterationCount++;
            this._animationPrepare(sprite);
          }
          this.fillMode !== 'forward' && this._remeberAttrs(sprite, true);
        }
        if (this._checkIterationCount(repeatCount)) {
          time %= this.duration;
          /*动画执行流程*/
          if (this.animation) {
            var runtime = this._animaRuntime,
                animation = this.animation,
                curFrame = runtime.framesTime[0];

            if (time >= this._countFrameDuration(curFrame)) {
              var lastFrame = runtime.lastFrame = runtime.framesTime.shift();
              curFrame = runtime.framesTime[0];
              runtime.frameDuration = this._countFrameDuration(curFrame - lastFrame);
              runtime.velocity = this._attrChangeInit(sprite, animation[curFrame], runtime.frameDuration);
            }
            //let animaTime = time - runtime.lastFrame;
            if (this.timing && runtime.frameDuration) {
              var newTime = this._warpTime(time, runtime.frameDuration);
              time = newTime[0];
              fdelta = newTime[1];
            }
          } else if (this.timing && this.duration) {
            /*时间轴扭曲逻辑*/
            var _newTime = this._warpTime(time, this.duration);
            time = _newTime[0];
            fdelta = _newTime[1];
          }
          /*行为逻辑函数*/
          this.executeFn(sprite, time, fdelta, data, context);
        } else {
          isType(this.animateCallback, 'function') && this.animateCallback(sprite, context);
          delete sprite.behaviors[this.name]; //行为执行完销毁自身W
        }
      }
    }, {
      key: '_countFrameDuration',
      value: function _countFrameDuration(percent) {
        return percent * this.duration / 100;
      }
    }, {
      key: '_checkIterationCount',
      value: function _checkIterationCount(repeatCount) {
        return this.iteration === 'infinite' ? true : repeatCount < this.iteration;
      }
      /*重置行为动画运行数据*/

    }, {
      key: '_animationPrepare',
      value: function _animationPrepare(sprite) {
        if (this.animation) {
          this._setAnimaData();
          !this.animation['0'] && !this.animation['100'] && (this.animation = { 0: null, 100: this.animation }); //处理单层数据
          var animation = this.animation,
              _animaRuntime = this._animaRuntime;


          for (var i in animation) {
            i === 0 && animation[0] && this._spriteAttrSet(sprite, animation[0], true);
            _animaRuntime['framesTime'].push(i);
          }
          _animaRuntime['framesTime'].sort(function (a, b) {
            return a - b;
          });
        }
      }
      /*重置行为动画运行数据*/

    }, {
      key: '_setAnimaData',
      value: function _setAnimaData() {
        this._animaRuntime = this._animaInitProps(); //重置动画运行环境数据
      }
      /* 时间轴扭曲函数
      * @param time 行为运行时间
      */

    }, {
      key: '_warpTime',
      value: function _warpTime(time, duration) {
        var percent = time / duration;
        var warpTime = this.timing(percent) / percent * time;
        !this.lastTime && (this.lastTime = warpTime);
        var warp_fdelta = warpTime - this.lastTime;
        this.lastTime = warpTime;
        this.orgTime = [warpTime, warp_fdelta];
        return this.orgTime;
      }
      /*属性变换初始化函数*/

    }, {
      key: '_attrChangeInit',
      value: function _attrChangeInit(sprite, animaArgs, duration) {
        var animaVel = {};
        for (var i in animaArgs) {
          var arg = animaArgs[i],
              relativeVal = 0;
          if (typeof arg === 'string') {
            relativeVal = this._handleRelativeValue(arg);
          } else {
            relativeVal = arg - sprite[i];
          }
          animaVel[i] = relativeVal / duration;
        }
        return animaVel;
      }

      /*属性变换函数*/

    }, {
      key: '_attrChange',
      value: function _attrChange(sprite, time, fdelta, data, context) {
        var velocity = this._animaRuntime.velocity;


        for (var i in velocity) {
          sprite[i] += velocity[i] * fdelta;
        }
      }
      /*属性设置函数*/

    }, {
      key: '_spriteAttrSet',
      value: function _spriteAttrSet(sprite, attrs, checkRel) {
        for (var i in attrs) {
          sprite[i] = checkRel ? this._handleRelativeValue(attrs[i], sprite[i]) : attrs[i];
        }
      }
    }, {
      key: '_handleRelativeValue',
      value: function _handleRelativeValue(relVal, value) {
        var result = 0;
        if (typeof relVal === 'string' && relVal.indexOf('=') > 0) {
          var relValArr = relVal.split('=');
          switch (relValArr[0]) {
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

    }, {
      key: '_remeberAttrs',
      value: function _remeberAttrs(sprite, restore) {
        if (Object.keys(sprite.behaviors).length === 1 && (this.iteration > 1 || this.iteration === 'infinite')) {
          var _spriteAttrs = this._spriteAttrs,
              velocity = this._animaProps.velocity;

          if (Object.keys(_spriteAttrs).length === 0 && !restore) {
            for (var i in velocity) {
              _spriteAttrs[i] = sprite[i];
            }
          }
          if (restore && _spriteAttrs) {
            this._spriteAttrSet(sprite, _spriteAttrs);
          }
        }
      }
    }]);
    return Behavior;
  }();

  /*
  * 资源加载模块类，用于加载资源
  * 
  */
  var MediaLoader = function () {
    function MediaLoader() {
      var _this = this;

      classCallCheck(this, MediaLoader);

      this.loadImage = function (key, imgUrl, callback, checkall) {
        _this.loadMedias('images', key, imgUrl, callback, checkall);
      };

      this.getImageProgress = function () {
        return _this.getProgress('images');
      };

      this.loadAudio = function (key, audioUrl, callback, checkall) {
        _this.loadMedias('audios', key, audioUrl, callback, checkall);
      };

      this.getAudioProgress = function () {
        return _this.getProgress('audios');
      };

      this.getMediaProgress = function () {
        var images = _this.imagesInfo.queue,
            audios = _this.audiosInfo.queue,
            loaded = audios.s + audios.f + images.s + images.f,
            total = audios.t + images.t,
            percent = Math.round(loaded / total * 100);
        return [loaded, total, percent];
      };

      this.imagesInfo = this._mediaInfoObj();
      this.images = {};
      this.audiosInfo = this._mediaInfoObj();
      this.audios = {};
    }

    createClass(MediaLoader, [{
      key: '_mediaInfoObj',
      value: function _mediaInfoObj() {
        return {
          total: { s: 0, f: 0, t: 0 },
          queue: { s: 0, f: 0, t: 0 },
          urls: []
        };
      }
      /*加载资源*/

    }, {
      key: 'loadingMedia',
      value: function loadingMedia(mediaObj, callback) {
        this.loadingImages(mediaObj.images || {}, callback, true);
        this.loadingAudios(mediaObj.audios || {}, callback, true);
        return this;
      }
    }, {
      key: 'loadingMediaList',
      value: function loadingMediaList(type) {
        var mediaList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var checkall = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var isArray = Array.isArray(mediaList) ? true : false;
        var mediaInfo = this[type + 'Info'];
        var loadingFn = null;
        if (type === 'images') {
          loadingFn = this.loadImage;
        } else if (type === 'audios') {
          loadingFn = this.loadAudio;
        }
        if (mediaList && mediaInfo && loadingFn) {
          mediaInfo.queue = { s: 0, f: 0, t: 0 };
          for (var i in mediaList) {
            var key = isArray ? mediaList[i] : i;
            loadingFn(key, mediaList[i], callback, checkall);
          }
        }
        return this;
      }
      /*加载图片,返回对象实例*/

    }, {
      key: 'loadingImages',
      value: function loadingImages() {
        var imageList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var checkall = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        return this.loadingMediaList('images', imageList, callback, checkall);
      }
    }, {
      key: 'loadMedias',
      value: function loadMedias(type, key, mediaUrl, callback, checkall) {
        var mediaInfo = this[type + 'Info'];
        if (Array.indexOf(mediaInfo['urls'], mediaUrl) < 0) {
          mediaInfo.total.t++;
          mediaInfo.queue.t++;
          mediaInfo['urls'].push(mediaUrl);
          var checkFn = checkall && this.getMediaProgress;
          var mediaEle = null;
          var loadEventName = 'load';
          var loadedFn = function loadedFn() {
            mediaInfo.total.s++;
            mediaInfo.queue.s++;
            if (checkFn()[2] == 100) {
              callback();
            }
          };
          var errorFn = function errorFn() {
            mediaInfo.total.f++;
            mediaInfo.queue.f++;
            if (checkFn()[2] == 100) {
              callback();
            }
          };
          if (type === 'images') {
            mediaEle = new Image();
            !checkall && (checkFn = this.getImageProgress);
          } else if (type === 'audios') {
            mediaEle = new Audio();
            !checkall && (checkFn = this.getAudioProgress);
            loadEventName = 'loadedmetadata';
          }
          if (mediaEle) {
            mediaEle.addEventListener(loadEventName, loadedFn);
            mediaEle.addEventListener('error', errorFn);
            mediaEle.src = mediaUrl;
            this[type][key] = mediaEle;
          }
        }
      }
      /*获取图片加载进度，输出为[加载数，总数，百分比]的数组格式*/

    }, {
      key: 'loadingAudios',

      /*加载音频资源,返回对象实例*/
      value: function loadingAudios() {
        var audioList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var checkall = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        return this.loadingMediaList('audios', audioList, callback, checkall);
      }
    }, {
      key: 'getProgress',
      value: function getProgress(type) {
        var queue = this[type + 'Info'].queue,
            loaded = queue.s + queue.f,
            percent = Math.round(loaded / queue.t * 100);

        return [loaded, queue.t, percent];
      }
      /*获取总资源加载进度*/

    }]);
    return MediaLoader;
  }();

  var Anicanvas = function () {
    function Anicanvas(elem, opts) {
      classCallCheck(this, Anicanvas);

      _initialiseProps.call(this);

      this._elem = this.elemInit(elem);
      this._options = Object.assign({}, opts);
      this._aniTimer = new AnimationTimer(this.animation);
      this.stageInit();
    }

    createClass(Anicanvas, [{
      key: 'elemInit',
      value: function elemInit(elem) {
        return isType(elem, 'string') ? document.querySelector(elem) : null;
      }
    }, {
      key: 'stageInit',
      value: function stageInit() {
        if (this._elem) {
          var _options = this._options,
              width = _options.width,
              height = _options.height;

          this.createStage('MAIN', { width: width, height: height, zIndex: 1000 });
          this.$stage = this.$stages.MAIN;
        } else {
          errWarn('no accessable root element!');
        }
      }
    }, {
      key: 'createStage',
      value: function createStage(name, options) {
        if (isType(name, 'string') && !this.$stages[name]) {
          var _options2 = this._options,
              width = _options2.width,
              height = _options2.height;

          !options.width && (options.width = width);
          !options.height && (options.height = height);
          var stage = new Stage(name, options);
          this.$stages[name] = stage;
          this._stages.push(stage);
          objKeySort(this._stages, 'zIndex');
          this._elem.appendChild(stage.$canvas);
        }
      }
    }, {
      key: 'start',
      value: function start() {
        this._aniTimer.start();
      }
    }, {
      key: 'play',
      value: function play() {
        this._aniTimer.play();
      }
    }, {
      key: 'pause',
      value: function pause() {
        this._aniTimer.pause();
      }
    }, {
      key: 'stop',
      value: function stop() {
        this._aniTimer.stop();
      }
    }, {
      key: 'setCanvasSize',
      value: function setCanvasSize() {
        var _options3 = this._options,
            width = _options3.width,
            height = _options3.height;

        if (isNumeric(width) && isNumeric(height)) {
          Object.assign(this.canvas, { width: width, height: height });
        }
      }
    }, {
      key: 'loadingMedia',
      value: function loadingMedia(mediaMap, callback) {
        if (mediaMap.images || mediaMap.audios) {
          this.$media.loadingMedia(mediaMap, callback);
        }
      }
    }, {
      key: 'createPainter',
      value: function createPainter(type) {
        for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          options[_key - 1] = arguments[_key];
        }

        switch (type) {
          case 'image':
            return new ImagePainter([].concat(options));
            break;
          case 'sheet':
            return new SheetPainter([].concat(options));
            break;
          default:
            return new Painter(type);
            break;
        }
      }
    }, {
      key: 'resize',
      value: function resize(size) {
        isType(size, 'object') && Object.assign(this._elem, size);
      }
    }]);
    return Anicanvas;
  }();

  Anicanvas.Sprite = Sprite$1;
  Anicanvas.Layer = Layer;
  Anicanvas.Painter = Painter;
  Anicanvas.ImagePainter = ImagePainter;
  Anicanvas.SheetPainter = SheetPainter;
  Anicanvas.Behavior = Behavior;

  var _initialiseProps = function _initialiseProps() {
    var _this = this;

    this._RAF = 0;
    this._stages = [];
    this.$stages = {};
    this.$stage = null;
    this.$layers = {};
    this.$media = new MediaLoader();

    this.animation = function (elapsed, fdelta) {
      _this._stages.forEach(function (stage) {
        return stage.update(elapsed, fdelta);
      });
    };

    this.createLayer = function (name, options, painter) {
      if (isType(name, 'string')) {
        var opts = null;
        if (isType(options, 'function')) {
          painter = options;
        } else {
          opts = options === 'fullpage' ? { width: _this._options.width, height: _this._options.height } : options;
        }
        _this.$layers[name] = new Layer(name, opts, painter);
        return _this.$layers[name];
      }
    };

    this.append = function () {
      var _$stage;

      (_$stage = _this.$stage).append.apply(_$stage, arguments);
    };
  };

  return Anicanvas;

})));
//# sourceMappingURL=anicanvas.js.map
