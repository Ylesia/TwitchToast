var DATA_KEY = "data";
var DEFAULT_ROWS_COUNT = 4;

var _data_server = [];

function loadChannel(index_in_new){
  var titles = $("#titles");
  var data = _data_server[index_in_new].content;

  $("#current_selected").val(index_in_new);
  if(data){
    var length = data.length;

    $("#titles").html("");

    if(data.length > 0){
      var i = 0;
      for(;i<data.length;i++){
        jsonToRow(data[i], i);
      }
    }
  }
}

function appendNewRowToMenu(){
  var categories = $("#nav-mobile");

  var i = categories.children().length;

  categories.append("<li class=\"bold\"><a id=\"menu_title"+i+"\" href=\"#\" class=\"waves-effect waves-teal\">Scene "+i+"</a></li>");

  while(_data_server.length <= i) {
    _data_server.push({title:"", content: [], idx:i});
  }

  _data_server[i].title = "Scene "+i;
  var index_in_new = i;
  $("#menu_title"+i).on("click",function(){
    loadChannel(index_in_new);
  });
}

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

  function rowMenuToJson(element_title, index_in_html){
    var data = {
      title: $("#menu_title"+index_in_html).html(),
      content:[],
      idx:index_in_html
    }

    if($("#current_selected") && $("#current_selected").val() == index_in_html){
      $("#titles").children().each(function(index, element){
        data.content.push(rowToJson($(element)));
      });
    }else{
      data.content = _data_server[index_in_html].content;
    }
    return data;
  }

  function rowToJson(element) {
    var data = {
      title: element.find("input[name=title]").first().val(),
      duration: element.find("input[name=duration]").first().val(),
      logo: element.find("input[name=logo_hidden]").first().val(),
      loop: element.find("input[name=loop]").first().prop('checked'),
    };
    return data;
  }

  function jsonCategorieToRow(json, index_in_html){
    var categories = $("#nav-mobile");

    if(!json.content) json.content = [];
    if(!json.title) json.title = [];

    while(categories.children().length <= index_in_html){
      appendNewRowToMenu();
    }
    $("#menu_title"+index_in_html).html(json.title);
  }

  function jsonToRow(json, index_in_html) {
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

    var categories = $("#nav-mobile");

    var i = 0;
    categories.children().each(function(index, element){
      json_array.push(rowMenuToJson($(element), index));
    });

    sendData(json_array);
  }

  function restoreStore(data){
    _data_server = data;

    var categories = $("#nav-mobile");
    var titles = $("#titles");

    if(data){
      var length = data.length;

      if(data.length > 0){
        var i = 0;
        for(;i<data.length;i++){
          jsonCategorieToRow(data[i], i);
        }
      }

      var selected = $("#current_selected").val();
      if(!selected || selected == ""){
        selected = 0;
      }

      if(selected > categories.children().length){
        selected = 0;
      }

      loadChannel(selected);
    }
  }

  function checkStore() {
  }
