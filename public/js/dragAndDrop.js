/**
 *
 * revision 2 : change to manage ul/li behaviour by default
 */
var source;

function getFirstParentMatching(node, typeString){
  console.log(node.nodeName+" "+typeString);
  var parent = node;
  if (node && typeString) {
    if (parent && parent.nodeName.toLowerCase() == typeString)
      return parent;

    do{
      parent = parent.parentNode;
    } while (parent && parent.nodeName.toLowerCase() != typeString);
  }
  return parent;
}

function isbefore(a, b) {
  if (a.parentNode == b.parentNode) {
    for (var cur = a; cur; cur = cur.previousSibling) {
      if (cur === b) {
        return true;
      }
    }
  }
  return false;
}

function dragenter(e) {
  var parent = getFirstParentMatching(e.target, "ul");
  if (!parent) parent = e.target.parentNode;

  var li = getFirstParentMatching(e.target, "li");
  if (isbefore(source, li)) {
    parent.insertBefore(source, li);
  }else{
    parent.insertBefore(source, li.nextSibling);
  }
}

function dragstart(e) {
  source = getFirstParentMatching(e.target, "li");
  e.dataTransfer.effectAllowed = 'move';
}
