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

ident_img_array = [
  '1_city','2_nIV','3_spar','4_spar','5_spar','6_defconstruct',
  '7_railgun','8_nithya','9_dark','10_arirealm','11_arigate','12_NULL','13_astragate','14_lightgate','15_construct','16_wormhole'
]

function pushValue(id, origin) {
  document.getElementById(id).innerHTML = origin.value;
  if (id == 'idbox') {
    document.getElementById('display').src = `https://shadowsword.tk/img/avaira/${ident_img_array[origin.value-1]}.gif`;
  }
}

function setInnerHTML(id, origin) {
  document.getElementById(id).innerHTML = origin;
}

function limit(section,max) {
  if (section.value.length > max) {
    section.value = section.value.substring(0,max);
  }
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
  bar = document.getElementById("password");
  bar_two = document.getElementById("passwordconfirmation")
  if (bar) {
    bar.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        gotoSubmit()
      }
    })
  }
  if (bar_two) {
    bar_two.addEventListener("keyup", function(event) {
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

function poptoast(id) {
  var obj = document.getElementById(id);
  if (obj.style.display != 'block') {
    toast(id);
  } else {
    hide(id);
  }
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

function setValue(id,val) {
  //console.log(id,val)
  if (id == 'identity' && val == 0) val = 16;
  if (id == 'descript' && val == 0) val = '(No Description)'
  document.getElementById(id).value = val;
}

async function loadEditCtrl() {
  await syncNodeJSON()
  toast('server_error')
  //pushValue('idbox',document.getElementById('identity'))
}

function syncImgIdent(pointer) {
  if (pointer == 0) pointer = 16;
  document.getElementById('display').src = `https://shadowsword.tk/img/avaira/${ident_img_array[pointer-1]}.gif`
}

async function updateCost() {
  let addressIdent = window.location.href.slice(-6)
  $.get(`../node_json/${addressIdent}`, function(data, status) {
    var res = '&nbsp;';
    res += `<gold>Difference:</gold><br>&nbsp;`
    gold_after = data.node.node_cost_gold - document.getElementById('gold').value
    user_gold_after = data.node.node_ownership.user_gold + gold_after

    silver_after = data.node.node_cost_silver - document.getElementById('silver').value
    user_silver_after = data.node.node_ownership.user_silver + silver_after


    res += `<gold>${gold_after} G (${user_gold_after})</gold>, `
    res += `${silver_after} S (${user_silver_after})`
    if (user_gold_after < 0 || user_silver_after < 0 || document.getElementById('silver').value < 0 || document.getElementById('gold').value < 0) {
      res += `<br>&nbsp;Not enough funds / Cannot take from nothing.`
      hide('submitbox')
    } else {
      toast('submitbox')
    }
    setInnerHTML('server_error',res)
  })
}

async function syncNodeJSON() {
  let addressIdent = window.location.href.slice(-6)
  $(document).ready(function() {
    $.get(`../node_json/${addressIdent}`, function(data, status) {
      setValue('identity',data.node.node_identity)
      setValue('silver',data.node.node_cost_silver)
      setValue('gold',data.node.node_cost_gold)
      setValue('descript',data.node.node_description)
      setInnerHTML('cost_gold',data.node.node_cost_gold)
      setInnerHTML('top-silv',data.node.node_cost_silver)
      setInnerHTML('idbox',data.node.node_identity)
      setInnerHTML('userSilver',data.node.node_ownership.user_silver)
      setInnerHTML('userGold',data.node.node_ownership.user_gold)
      syncImgIdent(data.node.node_identity)
    })
  })
}

function rmCookies() {
  document.cookie = `user_email=; maxAge=0; SameSite=none; path=/; Secure`
  document.cookie = `hashed_pwd=; maxAge=0; SameSite=none; path=/; Secure`
}

function loadRegistrar() {
  // for registration
}
