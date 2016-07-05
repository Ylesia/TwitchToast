var DATA_KEY = "data";

function getStoredData(){
  return store.get(DATA_KEY);
}

function rowToJson(element) {
  return {
    title: element.find("input[name=title]").first().val(),
    duration: element.find("input[name=duration]").first().val(),
    loop: element.find("input[name=loop]").first().prop('checked'),
  };
}

function jsonToRow(json, index_in_html) {
  $("#title"+index_in_html).val(json.title);
  $("#duration"+index_in_html).val(json.duration);
  $("#loop"+index_in_html).attr("checked", json.loop);
}

function invalidateStore(){
  var json_array = [];

  $("#titles").children().each(function(index, element){
    json_array.push(rowToJson($(element)));
  });
  store.set(DATA_KEY, json_array);
}

function restoreStore(){
  var data = getStoredData();

  if(data && data.length > 0){
    var i = 0;
    for(;i<data.length;i++){
      jsonToRow(data[i], i);
    }
  }
}

function checkStore() {
  if (!store.enabled) {
    alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
  }
}
