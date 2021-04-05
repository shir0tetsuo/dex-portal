// code for web parts

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandLoc() {
  let xxx = zeroPad(getRandomInt(179),3),
  yyy = zeroPad(getRandomInt(359),3);
  window.location.replace(`https://realmdex.shadowsword.tk/view/${xxx}${yyy}`)
}

function loadJSONSocket() {
  let addressIdent = window.location.href.slice(-6)
  document.getElementById("json-export").href = `../node_json/${addressIdent}`
  //document.getElementById("addrbar").value = `${parseInt(addressIdent)}`
}

function loadAddressBar() {
  let addressIdent = window.location.href.slice(-6)
  document.getElementById("abar").value = `${addressIdent}`;
  bar = document.getElementById("abar");
  bar.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      gotoBar()
    }
  })
}

function gotoBar() {
  ref = document.getElementById("abar").value;
  window.location.replace(`https://realmdex.shadowsword.tk/view/${ref}`)
}

// must be onLoad event
function loadPortal() {
  loadJSONSocket()
  loadAddressBar()
}
