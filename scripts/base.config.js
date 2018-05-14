const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/anicanvas.js',
    name: 'Anicanvas',
    format: 'umd'
  },
  plugins: [ 
  	node(), 
  	babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    }),
    cjs()
  ]

};