const fs = require('fs');

function addKeysToDomAry(jsonData) {
  const tree = [];

  // Traverse all items in UMary
  jsonData.UMary.forEach(parent => {
    if (!Array.isArray(parent.domARY)) return;
    
    // Add parrentID and prevsiblingID to each child
    parent.domARY.forEach((child, index) => {
      const prevSibling = index > 0 ? parent.domARY[index - 1].id : null;
      tree.push({
        id: child.id,
        parrentID: parent.id,
        prevsiblingID: prevSibling
      });
    });
  });

  return { tree };
}

// Example usage:
const rawData = fs.readFileSync(
  'c:\\Users\\ai\\Documents\\andy\\code\\docx\\pat\\example.json',
  'utf8'
);
const jsonData = JSON.parse(rawData);
const result = addKeysToDomAry(jsonData);
console.log(JSON.stringify(result, null, 2));