const fs = require('fs');

// Read the input JSON file
const data = JSON.parse(fs.readFileSync('c:\\Users\\ai\\Documents\\andy\\code\\docx\\pat\\example.json', 'utf8'));

// Create a flat array of all nodes with their original level
const allNodes = [];
data.UMary.forEach(levelObj => {
  const level = levelObj.level;
  levelObj.domARY.forEach(item => {
    allNodes.push({
      id: item.id,
      level,
      prevID: item.prevID,
      innerText: item.innerText
    });
  });
});

// Create the tree nodes with parent ID
const treeNodes = allNodes.map(node => {
  // Find potential parents (nodes with lower level and lower ID)
  const potentialParents = allNodes.filter(
    potentialParent => 
      potentialParent.level < node.level && 
      potentialParent.id < node.id
  );
  
  // Find the closest parent (highest ID among potential parents)
  let parrentID = null;
  if (potentialParents.length > 0) {
    const parent = potentialParents.reduce(
      (max, current) => current.id > max.id ? current : max, 
      potentialParents[0]
    );
    parrentID = parent.id;
  }
  
  return {
    id: node.id,
    parrentID,
    prevsiblingID: node.prevID,
    innerText: node.innerText
  };
});

// Create the final output
const output = { tree: treeNodes };

// Write to output file
const outputFile = 'c:\\Users\\ai\\Documents\\andy\\code\\docx\\pat\\output.json';
fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

console.log(`Transformation complete. Output written to ${outputFile}`);