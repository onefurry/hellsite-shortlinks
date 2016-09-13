var tmp = document.querySelector("#turl-make-parent");
var tm = document.querySelector("#turl-make");
var turl = document.querySelector("#turl");
var boxes = document.querySelector("#boxes");

var checkUrl = function () {
  return /^https?:\/\/([a-zA-Z0-9\-\.]+\.)?tumblr.com(\/.*)?$/.test(turl.value);
};

var updateUrl = function (e) {
  if (checkUrl()) {
    tmp.classList.add('show');
    if (e && e.keyCode === 13) makeLink();
  } else
    tmp.classList.remove('show');
};

var makeUrlBox = function (original, newurl) {
  var box = document.createElement('div');
  box.classList.add('urlbox');
  box.innerHTML = "<div class='oldurl'>" + original + "</div><a class='newurl' href='" + newurl + "'>" + newurl + "</a>";
  boxes.insertBefore(box, boxes.firstChild);
};

var makeLink = function () {
  if (checkUrl()) {
    var url = turl.value;
    turl.value = '';
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var val = JSON.parse(xhr.responseText);
      if (val.passed) makeUrlBox(url, val.url);
    };
    xhr.open('GET', '/make?url=' + url);
    xhr.send();
    turl.focus();
  }
};

turl.onkeyup = updateUrl;
turl.onpaste = function () {
  setTimeout(makeLink, 10);
};
tm.onclick = makeLink;

turl.value = '';
turl.focus();
