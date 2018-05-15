import config from './base.config';
import { merge } from 'lodash';

const uglify = require('rollup-plugin-uglify')

export default merge(config, {
  output: {
  	format: 'cjs',
  	file: 'dist/anicanvas.common.js'
  },
  plugins: [
  	uglify()
  ]
});