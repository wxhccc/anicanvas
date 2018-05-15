/*
* 公共函数
*/
/* 创建dom元素 */
export function createHtmlElement(tag, attrs, styles){
  let elem = document.createElement(tag);
  isType(attrs, 'object') && Object.assign(elem, attrs);
  isType(styles, 'object') && Object.assign(elem.style, styles);
  return elem;
}
/* 创建dom元素 */
export function objectFilter(obj, keys, def){
  let result = {};
  isType(obj, 'object') && isType(keys, 'array') && keys.forEach(item => {
    obj.hasOwnProperty(item) ? (result[item] = obj[item]) : (def && (result[item] = undefined));
  })
  return result;
}
/* 对象数组按某一键值排序 */
export function isType(value, type){
  return (typeof type === 'string') ? Object.prototype.toString.call(value).toLowerCase() === `[object ${type.toLowerCase()}]` : null;
}
/* 判断变量是否是数字或数字字符串 */
export function isNumeric(obj) {  
  return (isType(obj, 'number') || isType(obj, 'string')) && !isNaN( obj - parseFloat( obj ) );
}
/* json数据拷贝 */
export function jsonCopy(obj) {  
  return JSON.parse(JSON.stringify(obj));
}
/* 对象数组按某一键值排序 */
export function objKeySort(obj_arr=[],key='',desc=false){
  return obj_arr.sort((a,b)=>{
    if(a[key] !== undefined && b[key] !== undefined){
      if(a[key] < b[key]){
        return desc ? 1 : -1;
      }
      else if(a[key] > b[key]){
        return desc ? -1 : 1;
      }
      else {
        return 0;
      }
    }
    else {
      return 0;
    }
  })
}
/* 角度转化弧度 */
export function deg2rad(deg){
  return Math.PI/180*deg;
}
/* 三次贝塞尔曲线 */
export function cubicBezier(p1_x,p1_y,p2_x,p2_y){
  var ax,bx,cx,ay,by,cy;
  /*计算多项式系数*/
  cx = 3.0 * (p1_x - 0);  
  bx = 3.0 * (p2_x - p1_x) - cx;  
  ax = 1 - 0 - cx - bx;  

  cy = 3.0 * (p1_y - 0);  
  by = 3.0 * (p2_y - p1_y) - cy;  
  ay = 1 - 0 - cy - by;  
  return function(x) {
    let tSquared = x * x,
        tCubed = tSquared * x;
    return ay * tCubed + by * tSquared + cy * x;
  }
}
/* 约等于函数 */
export function approximate(comp1,comp2,precision=0){
  return Math.abs(comp1 - comp2) < Math.pow(10,precision);
}
/* 错误处理 */
export function errWarn(error) {
  console.log(error);
}