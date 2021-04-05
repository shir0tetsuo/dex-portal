// code for web parts

function loadToolSocket() {
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
  loadToolSocket()
  loadAddressBar()
}
