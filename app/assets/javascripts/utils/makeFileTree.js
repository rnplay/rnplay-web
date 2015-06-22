
/**
 * Builds a nested object from an array of filepaths
 * @param  {array} filenames The filenames
 * @return {object}          The tree
 */
export default (filenames) => {
  return filenames.reduce((tree, filename) => {
    const parts = filename.split('/');
    let tempTree = tree;
    let part;
    while((part = parts.shift())) {
      tempTree = tempTree[part] = parts.length === 0 ?
        null :
        tempTree[part] || {};
    }
    return tree;
  }, {});
};
