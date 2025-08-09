import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/components/index.ts', // The entry point of our library
  output: {
    file: 'dist/one-viz.js', // The bundled output file
    format: 'esm', // ES Module format, suitable for modern browsers
    sourcemap: true,
  },
  plugins: [
    typescript(), // Compile TypeScript files
    nodeResolve(), // Resolve dependencies from node_modules
  ],
};
