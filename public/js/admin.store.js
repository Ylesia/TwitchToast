var DATA_KEY = "data";
var DEFAULT_ROWS_COUNT = 4;

var _data_server = [];

function fixFocusInput(input_element){
  input_element.siblings('label, i').addClass('active');
}

function setMenuActiveAtIndex(index_in_html){
  var categories = $("#nav-mobile");

  categories.children().each(function (index, element){
    console.log(index+" "+index_in_html);
    if(index == index_in_html){
      $(element).addClass("active");
    }else{
      $(element).removeClass("active");
    }
  });
}

function changeChannelName(){
  var new_channel_name = $("#channel_name").val();
  var uuid = $("#current_selected").val();
  var selected = findChannel(uuid);

  console.log(selected+" "+uuid);
  if(new_channel_name && selected >= 0 && selected < _data_server.length){
    _data_server[selected].title = new_channel_name;
    $("#menu_title"+selected).html(new_channel_name);
  }
}

function findChannel(uuid){
  var i = 0;
  if(!_data_server) return -1;

  for(;i<_data_server.length;i++){
    if(_data_server[i].uuid == uuid) return i;
  }
  return -1;
}

function loadChannel(index_in_new){
  if(index_in_new == -1 || !_data_server || _data_server.length <= index_in_new){
    return;
  }

  setMenuActiveAtIndex(index_in_new);

  console.log(">>"+_data_server+" "+index_in_new);
  var titles = $("#titles");
  var uuid = _data_server[index_in_new].uuid;
  var name = _data_server[index_in_new].title;
  var data = _data_server[index_in_new].content;

  $("#current_selected").val(uuid);
  $("#channel_name").val(name);
  fixFocusInput($("#channel_name"));

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

function appendNewRowToMenu(with_loading){
  var categories = $("#nav-mobile");

  var i = categories.children().length;

  categories.append("<li class=\"bold\"><input id=\"menu_title_uuid"+i+"\" type=\"hidden\" value=\"\"/><a id=\"menu_title"+i+"\" href=\"#\" class=\"waves-effect waves-teal\">Scene "+i+"</a></li>");

  while(_data_server.length <= i) {
    _data_server.push({
      uuid:uuid.v4(),
      title:"",
      content: [],
    });
  }

  if(!_data_server[i].title){
    _data_server[i].title = "Scene "+i;
  }

  var index_in_new = i;
  var tmp_uuid = _data_server[i].uuid;
  $("#menu_title"+i).html(_data_server[i].title);
  $("#menu_title"+i).on("click",function(){
    var new_index = findChannel(tmp_uuid);
    if(new_index == -1) alert("error invalid");
    console.log(new_index);
    loadChannel(new_index);
  });

  if(with_loading){
    loadChannel(i);
  }
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
      uuid: $("#menu_title_uuid"+index_in_html).val()
    }

    if($("#current_selected") && $("#current_selected").val() == data.uuid){
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
    if(!json.uuid) json.uuid = uuid.v4();

    while(categories.children().length <= index_in_html){
      appendNewRowToMenu();
    }
    $("#menu_title"+index_in_html).html(json.title);
    $("#menu_title_uuid"+index_in_html).val(json.uuid);
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

    fixFocusInput($("#title"+index_in_html));
    fixFocusInput($("#duration"+index_in_html));

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

    if(!_data_server) _data_server = [];

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

      var uuid = $("#current_selected").val();
      var selected = findChannel(uuid);

      //in case we did not find something to display
      //we display the first item
      if(selected == -1){
        if(!uuid && data.length > 0){
          selected = 0;
        }
      }

      if(selected < categories.children().length || selected > -1){
        loadChannel(selected);
      }

    }
  }

  function checkStore() {
  }
