const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

export default {
  input: 'demo/js/index.js',
  output: {
    file: 'demo/js/index.es5.js',
    name: 'Anicanvas',
    format: 'umd'
  },
  sourcemap: true,
  plugins: [ 
  	node(), 
  	babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    }),
    cjs()
  ]

};