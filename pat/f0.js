const SymbolTree = require('symbol-tree');
const tree = new SymbolTree();
 
let parent = {z:1};
let a = {z:2};
let b = {z:3};
let c = {z:4};
let d = {z:5};
 
tree.prependChild(parent, a); // insert a as the first child
tree.appendChild(parent,c ); // insert c as the last child
tree.insertAfter(a, b); // insert b after a, it now has the same parent as a
tree.appendChild(c,d );

function printTree(node) {
    const children = [];
    for (const child of tree.childrenIterator(node)) {
        children.push(printTree(child));
    }
    return { data: node, child: children };
}

console.log(JSON.stringify(printTree(parent), null, 2));


