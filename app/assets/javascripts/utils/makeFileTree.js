'use strict';

import natSort from './natSort';
/**
 * Builds a nested object from an array of filepaths
 * @param  {array} filenames The filenames
 * @return {object}          The tree
 */
 export default (filenames) => {
   // TODO we could also use _.difference here,
   // but if this code does not slow us down then nevermind
   const nested = filenames.filter((p) => p.indexOf('/') > -1).sort(natSort);
   const files = filenames.filter((p) => p.indexOf('/') < 0).sort(natSort);

   return files.reduce((tree, filename) => {
     tree[filename] = null;
     return tree;
   }, nested.reduce((tree, filename) => {
     const parts = filename.split('/');
     let tempTree = tree;
     let part;
     while((part = parts.shift())) {
       tempTree = tempTree[part] = parts.length === 0 ?
         null :
         tempTree[part] || {};
     }
     return tree;
   }, {}));
 };
