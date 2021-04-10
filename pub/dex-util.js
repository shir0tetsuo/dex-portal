// code for web parts

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function compareKeys() {
  pwdbox = document.getElementById('password');
  pwdcnf = document.getElementById('passwordconfirmation')
  if (pwdbox.value == pwdcnf.value && pwdcnf.value.length > 7) {
    toast('submitbox')
  } else {
    hide('submitbox')
  }
}

function forceLower(strInput) {
  strInput.value=strInput.value.toLowerCase();
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

function loadPassBar() {
  let addressIdent = window.location.href.slice(-6)
  bar = document.getElementById("password");
  if (bar) {
    bar.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        gotoSubmit()
      }
    })
  }
}

function gotoBar() {
  ref = document.getElementById("abar").value;
  window.location.replace(`https://realmdex.shadowsword.tk/view/${ref}`)
}

function gotoSubmit() {
  document.getElementById('submit').click();
}

function toast(id) {
  document.getElementById(id).style.display = 'block'
}

function hide(id) {
  document.getElementById(id).style.display = 'none'
}

async function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

async function bakeCookieButton() {
  controller = document.getElementById('login-ctrl')
  user_email = await getCookie('user_email')
  if (user_email) {
    var re = /@.*$/;
    user_email = user_email.replace(re, "");
    controller.innerHTML = user_email
    // navigate to UCP
    controller.href = '/ucp';
  } else {
    controller.innerHTML = 'Login'
  }
}

// must be onLoad event
function loadPortal() {
  //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_event_key_keycode2
  loadJSONSocket()
  loadAddressBar()
  bakeCookieButton()
}

function loadGateway() {
  loadPassBar()
}

function rmCookies() {
  document.cookie = `user_email=; maxAge=0; SameSite=none; path=/; Secure`
  document.cookie = `hashed_pwd=; maxAge=0; SameSite=none; path=/; Secure`
}

function loadRegistrar() {
  // for registration
}
