const fs = require('fs');
const SymbolTree = require('symbol-tree');
const tree = new SymbolTree();
var createTree = require("functional-red-black-tree");
// Read the input JSON file
const data = JSON.parse(fs.readFileSync('c:\\Users\\ai\\Documents\\andy\\code\\docx\\pat\\example.json', 'utf8'));
var parent = { name: data.name };
var bool_pp = true;
var allNodes = [];//createTree();
var ANF = createTree();
var zeroLV = -1;
var setLV = true;
var maxLV = -1;
data.UMary.forEach(levelObj => {
    const level = levelObj.level;
    levelObj.domARY.forEach(item => {
        
            if (setLV) {
                zeroLV = level;
                setLV = false;
            }
            ANF = ANF.insert(item.prevID, allNodes.length);
            allNodes.push({//insert(item.id, {
                id: item.id,
                index: allNodes.length,
                level: level,
                prevID: item.prevID,
                innerText: item.innerText
            });
            if (maxLV < level) {
                maxLV = level;
            }
        
    });
});
var MTlastLV = createTree();
var previdx = -1;
//allNodes reorder by id
allNodes.sort((a, b) => a.id - b.id);
allNodes.forEach(item => {//(key, value) => {
    if (item.level === zeroLV || item.prevID === 0) {//if (value.level === zeroLV) {
        if (bool_pp) {
            tree.prependChild(parent, allNodes[item.index]);
            bool_pp = false;
            console.log("debug0");
        } else {
            tree.appendChild(parent, allNodes[item.index]);
            console.log("debug1");
        }
    } else {
        var lvq;
        var setLVQ = false;
        try {
            lvq = allNodes[previdx].level;
            setLVQ = true;
        } catch (error) {
            tree.appendChild(allNodes[previdx], allNodes[item.index]);
        }
        console.log(lvq);
        if (setLVQ) {
            if (lvq === maxLV) {
                console.log("debug-1");
                tree.insertAfter(allNodes[previdx], allNodes[item.index]);
            } else if (lvq === item.level) {
                console.log("debug2");
                tree.insertAfter(allNodes[previdx], allNodes[item.index]);
            } else if (lvq < item.level) {
                console.log("debug3");
                tree.appendChild(allNodes[previdx], allNodes[item.index]);
            } else if (lvq > item.level) {
                console.log("debug4");
                tree.insertAfter(allNodes[MTlastLV.get(item.level)], allNodes[item.index]);
            } else {
                console.log("世界的盡頭");
            }
        }
    }
    MTlastLV = MTlastLV.remove(item.level);
    MTlastLV = MTlastLV.insert(item.level, item.index);
    previdx = item.index;
});

function printTree(node) {
    const children = [];
    for (const child of tree.childrenIterator(node)) {
        children.push(printTree(child));
    }
    return { data: node, child: children };
}


// Write to output file
const outputFile = 'c:\\Users\\ai\\Documents\\andy\\code\\docx\\pat\\output2.json';
fs.writeFileSync(outputFile, JSON.stringify(printTree(parent), null, 2));
console.log(`Transformation complete. Output written to ${outputFile}`);