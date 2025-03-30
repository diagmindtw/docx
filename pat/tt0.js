//Load the library
var createTree = require("functional-red-black-tree")
 
//Create a tree
var t1 = createTree()
 
//Insert some items into the tree
var t2 = t1.insert(1, "foo")
console.log(t1);
console.log(t2);
t2 = t2.insert(2, "bar")
console.log(t2);
t2=t2.remove(3);
console.log(t2);