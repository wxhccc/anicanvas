import config from './base.config';
import { merge } from 'lodash';

export default merge(config, {
  output: {
  	file: 'dist/anicanvas.min.js'
  }

});