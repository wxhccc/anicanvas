import Painter from './Painter'

/*图片绘画类
*
*
*/
export class ImagePainter extends Painter{
  /*
  * @param img 图片
  * @param set 绘制图片的参数
  */
  constructor(img = null, set){
    super();
    this.image = img;
    this.imgSet = set ? set : {x: 0, y: 0, w: img && img.width, h: img && img.height};
  }
  paint(sprite, context, time, fdelta, data) {
    if(this.image) {
      context.save();
      let spriteCopy = Object.assign({}, sprite);
      this._setSelfStyles(spriteCopy, context);
      this.runQueue(spriteCopy, context, time, fdelta, data);
      let imgSet = this.imgSet;
      
      context.drawImage(this.image, imgSet.x, imgSet.y, imgSet.w, imgSet.h, spriteCopy.left, spriteCopy.top, spriteCopy.width, spriteCopy.height);
      context.restore();
    }
  }
  
}
/*精灵绘画类
*
*
*/
export class SheetPainter extends Painter{
  /*
  * @param img 图片
  * @param set 绘制图片的参数
  */
  constructor(img,cells,{interval = 1000,autoruning = false,iteration = 1,reverse = false}){
    super();
    this.image = img;
    this.cells = cells;
    this.reverse = reverse;
    this.cell_index = reverse ? (this.cells.length - 1) : 0;
    this.interval = interval;
    this.running = autoruning ? true : false;
    this.frame_point = 0;
    this.timeline = 0;
    this.iteration = iteration == 'infinite' ? iteration : parseInt(iteration);
    this._countFramePoint(this.cell_index);
  }
  /*索引递增/递减*/
  advance() {
    if(this.reverse ? (this.cell_index == 1) : (this.cell_index == this.cells.length-2)){
      this.frame_point = this.timeline = 0;
      Number.isInteger(this.iteration) && this.iteration--;
    }
    this.reverse ? (this.cell_index += this.cells.length - 1) : this.cell_index ++;
    this.cell_index %= this.cells.length;
    this._countFramePoint(this.cell_index);
    
  }
  /*关键帧时间点计算*/
  _countFramePoint(index){
    let next_index = (this.reverse ? (index + this.cells.length - 1) : index + 1) % this.cells.length;
    this.frame_point += this._sValue(this.cells[next_index].interval,this.interval);
  }
  /*跳帧*/
  skip(frame_index){
    this.cell_index = frame_index % this.cells.length;
  }
  paint(sprite,context,time,fdelta,data) {
    if(this.running){
      if(this.iteration > 0 || this.iteration == 'infinite'){
        if(this.timeline >= this.frame_point ){
          this.advance();
        }
      }
      let cell = this.cells[this.cell_index],
        sheet_img = cell.img ? this.image[cell.img] : this.image,
        sv = this._sValue;
      context.save();
      context.drawImage(sheet_img,cell.x,cell.y,cell.w,cell.h,sv(cell.sl,sprite.left),sv(cell.st,sprite.top),sv(cell.sw,sprite.width),sv(cell.sh,sprite.height));
      
      this.timeline += fdelta;
      //console.log(this.timeline,this.frame_point)
      context.restore();
    }
  }
  /*获取有效值*/
  _sValue(cell_val,sprite_val) {
    return Number.isFinite(cell_val) ? cell_val : sprite_val;
  }
  
}