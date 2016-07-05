var DATA_KEY = "data";
var DEFAULT_ROWS_COUNT = 4;

function appendNewRowToTitles(){
  var titles = $("#titles");
  var i = titles.children().length;

  titles.append(
    "<li draggable=\"true\" ondragenter=\"dragenter(event)\" ondragstart=\"dragstart(event)\" ondragend=\"invalidateStore()\">"+
    "  <div class=\"row\">"+
    "    <div class=\"col s1 input-field\">"+
    "     <i class=\"material-icons hamburger-black\">menu</i>"+
    "    </div>"+
    "    <div class=\"col s1 input-field\">"+
    "      <input type=\"hidden\" name=\"logo_hidden\" id=\"logo_hidden"+i+"\" />"+
    "      <img src=\"\" class=\"logo\" id=\"logo"+i+"\">"+
    "    </div>"+
    "    <div class=\"col s3 input-field\">"+
    "      <input type=\"text\" name=\"title\" id=\"title"+i+"\" length=\"10\" />"+
    "      <label for=\"title"+i+"\">Title</label>"+
    "    </div>"+
    "    <div class=\"col s1 input-field\">"+
    "      <input type=\"text\" name=\"duration\" id=\"duration"+i+"\" />"+
    "      <label for=\"duration"+i+"\">Duration</label>"+
    "    </div>"+
    "    <div class=\"col s2 input-field\">"+
    "      <input type=\"checkbox\" name=\"loop\" id=\"loop"+i+"\" />"+
    "      <label for=\"loop"+i+"\">loop</label>"+
    "    </div>"+
    "    <div class=\"col s2 input-field\">"+
    "      <button class=\"btn waves-effect\" onclick=\"updateTitle("+i+")\">Update</button>"+
    "    </div>"+
    "    <div class=\"col s2 input-field\">"+
    "      <button class=\"btn waves-effect\" onclick=\"endTitle("+i+")\">End</button>"+
    "    </div>"+
    "  </div>"+
    "</li>");

    $("#title"+i).characterCounter();
    $("#duration"+i).numeric();


    $("#logo"+i).on("click", function() {
      changeLogo(i);
    });
  }

  function rowToJson(element) {
    var data = {
      title: element.find("input[name=title]").first().val(),
      duration: element.find("input[name=duration]").first().val(),
      logo: element.find("input[name=logo_hidden]").first().val(),
      loop: element.find("input[name=loop]").first().prop('checked'),
    };
    console.log(data);
    return data;
  }

  function jsonToRow(json, index_in_html) {
    console.log("jsonToRow "+index_in_html);
    var titles = $("#titles");

    while(titles.children().length <= index_in_html){
      appendNewRowToTitles();
    }

    $("#title"+index_in_html).val(json.title);
    $("#logo"+index_in_html).attr("src", json.logo);
    $("#logo_hidden"+index_in_html).val(json.logo);
    $("#duration"+index_in_html).val(json.duration);
    $("#loop"+index_in_html).attr("checked", json.loop);
  }

  function invalidateStore(){
    var json_array = [];

    $("#titles").children().each(function(index, element){
      json_array.push(rowToJson($(element)));
    });

    sendData(json_array);
  }

  function restoreStore(data){
    var titles = $("#titles");

    if(data){
      var length = data.length;

      if(data.length > 0){
        var i = 0;
        for(;i<data.length;i++){
          jsonToRow(data[i], i);
        }
      }
    }
  }

  function checkStore() {
  }
