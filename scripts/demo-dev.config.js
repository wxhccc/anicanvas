import config from './base.config';
import { merge } from 'lodash';

export default merge(config, {
  output: {
  	file: 'demo/js/anicanvas.js'
  },
  sourcemap: true,
  watch: {
    include: 'src/**'
  }

});