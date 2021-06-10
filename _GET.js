
X.get('/user/:uid', async (req, res) => {

  errorfile = await readFile('./part/400.html')

  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    user = await readPortalU(req.cookies.user_email);
    if (user && req.cookies.hashed_pwd != user.portalhash) {
      return res.status(406).send({
        error: "ACCESS DENIED PORTAL HASH DOES NOT EQUAL COOKIE HASH",
      })
    }
  }

  const { uid } = req.params;

  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  motd = await readFile('./part/motd.html')

  errorReturn = `${header}${errorfile}`

  if (!uid) return res.status(400).send(errorReturn)

  res_data = ''; // header data
  res_data += `${header}`

  res_data += `<body>` // top left elements
  res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
  res_data += `<span title="Information"><a href="/">DEX//</a></span>${uid} ${pub_ver}</div>`

  res_data += `${top_head}` // logo
  res_data += `user`
  res_data += `</div></div>`

  var user = await readU(uid);

  if (!user.user_id) return res.status(400).send(errorReturn)

  if (!/.*P.*/.test(user.user_id)) {
    var legacy = "&#11088;";
  } else {
    var legacy = "";
  }

  const tagList = await M.findAll({ where: { owner_id: user.user_id } })
  Properties = tagList.length

  var ownedSilverValue = 0, ownedGoldValue = 0;

  for (i = 0; i < Properties; i++) {
    ownedSilverValue = parseInt(ownedSilverValue) + parseInt(tagList[i].silver),
    ownedGoldValue = parseInt(ownedGoldValue) + parseInt(tagList[i].gold)
  }

  var PropertyDetail = '';

  if (Properties == 0) PropertyDetail = '(No Properties)'

  for (i = 0; i < Properties; i++) {
    if (tagList[i].description == 0) {
      tagList[i].description = '<br>'
    } else {
      tagList[i].description += '<br>'
    }
    PropertyDetail += `<br><a href="/view/${tagList[i].coordinate}"><b>${tagList[i].coordinate}</b></a> // <gold>${tagList[i].gold} G</gold>, ${tagList[i].silver} S, <level>sov. ${tagList[i].updatedAt}</level><br>&nbsp;${tagList[i].description}`
  }

  res_data += `${block_open}<div class="loginbox">`
  res_data += `<b>${uid}</b>${legacy} // <level>Level ${user.level}</level> / <level>${user.mrecord} EXP</level> // <gold>${ownedGoldValue} G</gold>, ${ownedSilverValue} S <gold>in ${Properties} Nodes</gold> // <a href="/leaders">Leaderboard</a>`
  res_data += `</div>${block_close}`

  res_data += `${block_open}<div class="userPropertyBox">`
  res_data += `${PropertyDetail}`
  res_data += `</div>${block_close}`

  res_data += `${motd}`

  console.log(chalk.blueBright('200 user',uid,req.cookies.user_email))
  res.status(200).send(res_data)
    //if (!req.cookies.user_email)
})

X.get('/ucp', async (req, res) => {
  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    user = await readPortalU(req.cookies.user_email);
    if (user && req.cookies.hashed_pwd != user.portalhash) {
      return res.status(406).send({
        error: "ACCESS DENIED PORTAL HASH DOES NOT EQUAL COOKIE HASH",
      })
    }

    header = await readFile('./part/header.html')
    pub_ver = await readFile('./part/pub_ver.html')
    top_head = await readFile('./part/top_head.html')

    res_data = ''; // header data
    res_data += `${header}`

    res_data += `<body>` // top left elements
    res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
    res_data += `<span title="Information"><a href="/">DEX//</a></span>User Control Panel ${pub_ver}</div>`

    res_data += `${top_head}` // logo
    res_data += `ucp`
    res_data += `</div></div>`

    var re = /@.*$/;
    email_small = req.cookies.user_email.replace(re, "")

    if (!/.*P.*/.test(user.user_id)) {
      var legacy = "&#11088; (legacy) ";
    } else {
      var legacy = "";
    }

    res_data += `${block_open}`
    res_data += `<br><b>${email_small}</b> <a href="/auth">Logout</a><br><br>`
    res_data += `ID: <a href="/user/${user.user_id}">${user.user_id}</a> <b>${legacy}</b><br>Email: ${user.portalemail}<br><br>`
    res_data += `${block_close}`

    res_data += `${block_open}<div class="loginbox">`
    res_data += `<blue>Authority: ${user.permission}</blue><br>`
    res_data += `<level>Level: ${user.level}</level> / <level>EXP: ${user.mrecord}</level><br><br>`
    res_data += `<gold>${user.gold} G</gold>, ${user.silver} S <gold>available</gold> // `

    const tagList = await M.findAll({ where: { owner_id: user.user_id } })
    Properties = tagList.length

    var ownedSilverValue = 0, ownedGoldValue = 0;

    for (i = 0; i < tagList.length; i++) {
      ownedSilverValue += parseInt(tagList[i].silver),
      ownedGoldValue += parseInt(tagList[i].gold)
    }

    res_data += `<gold>${ownedGoldValue} G</gold>, ${ownedSilverValue} S <gold>in ${Properties} Nodes</gold><br>`
    res_data += `<a href="/bank" class="phasedYel">Generate Gold</a>`
    res_data += `${block_close}</div>`

    console.log(chalk.yellowBright('200 /ucp',req.cookies.user_email))
    res.status(200).send(res_data)

  } else {
    res.status(405).send('NOT LOGGED IN')
  }
})

X.get('/auth', async (req, res) => {
  login = await readFile('./part/login.html')
  rules = await readFile('./part/registered_rules.html')
  logout_a = await readFile('./part/logout_p1.html')
  logout_b = await readFile('./part/logout_p2.html')

  var res_data = '';
  const block = await generateResponseBlock('Authorize','<body onLoad="loadGateway()">','')
  res_data += `${block.generated}`
  res_data += `${rules}`

  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    res_data += `${logout_a}<b>${req.cookies.user_email}</b>, ${logout_b}`
  } else {
    res_data += `${login}`
  }

  res_data += `${block.motd}`
  res_data += `${block.bodyEnd}`

  console.log(chalk.yellowBright('200 /auth'))
  res.status(200).send(res_data)
})

X.get('/bank', async(req, res) => {
  flag = await checkAuthorization(req.cookies.user_email, req.cookies.hashed_pwd)
  if (!flag) return res.status(401).send({error: "UNAUTHORIZED / HASH ERROR / NOT LOGGED IN"})
  bank = await readFile('./part/bank.html')
  acptools = await readFile('./part/acptools.html')

  res_data = '';
  const block = await generateResponseBlock('bank','<body>','<a href="/ucp">UCP//</a>')
  res_data += block.generated;
  res_data += bank;

  res_data += block.motd;

  if (user.permission >= 3) {
    res_data += acptools;
  }

  res_data += block.bodyEnd;

  res.status(200).send(res_data)
})

X.get('/acp/resetreward', async(req, res) => {
  flag = await checkAuthorization(req.cookies.user_email, req.cookies.hashed_pwd)
  if (!flag) return res.status(401).send({error: "UNAUTHORIZED / HASH ERROR / NOT LOGGED IN"})
  user = await readPortalU(req.cookies.user_email)

  if (user.permission >= 3) {
    res.status(200).send({message: "REWARDS RESET"})
    Rewards.update({last_execution: new Date().getTime(), next_execution: new Date().getTime()},{where:{user_id: user.user_id}})
  } else {
    res.status(200).send({message: "UNAUTHORIZED"})
  }
})

X.get('/acp/seedpersonalaccount', async(req, res) => {
  flag = await checkAuthorization(req.cookies.user_email, req.cookies.hashed_pwd)
  if (!flag) return res.status(401).send({error: "UNAUTHORIZED / HASH ERROR / NOT LOGGED IN"})
  user = await readPortalU(req.cookies.user_email)

  if (user.permission >= 3) {
    res.status(200).send({message: "FUNDS SEEDED"})
    Users.update({gold: user.gold + 1500, silver: user.silver + 2000},{where:{user_id: user.user_id}})
  } else {
    res.status(200).send({message: "UNAUTHORIZED"})
  }
})

X.get('/bank/hash/:hash/:nonce', async(req, res) => {
  flag = await checkAuthorization(req.cookies.user_email, req.cookies.hashed_pwd)
  if (!flag) return res.status(401).send({error: "UNAUTHORIZED / HASH ERROR / NOT LOGGED IN"})
  user = await readPortalU(req.cookies.user_email)

  const { hash, nonce } = req.params;

  let rewardInfo = await readRewardHashed(hash)

  res_data = '';

  const block = await generateResponseBlock('Hash_Pay','<body>','<a href="/ucp">UCP//</a><a href="/bank">BANK//</a>')
  res_data += block.generated;

  if (rewardInfo && rewardInfo.hash == hash && rewardInfo.key == nonce && rewardInfo.reward >= 1) {
    await Users.update({gold: user.gold + rewardInfo.reward, mrecord: user.mrecord + 2},{where: {user_id: user.user_id}})
    await Rewards.update({reward: 0},{where: {hash: hash}})
    console.log('Rewarded',user.portalemail,user.user_id)
    res_data += `${block_open}<level>${rewardInfo.key}</level>${rewardInfo.hash}${block_close}`
    res_data += `${block_open}<a href="/ucp" class="phasedYel">OK: Claimed ${rewardInfo.reward} Gold</a>${block_close}`
  } else {
    res_data += `${block_open}<a href="/ucp" class="phased">Reward hash has zero balance</a>${block_close}`
  }

  res_data += block.motd;
  res_data += block.bodyEnd;
  res.status(200).send(res_data)
})

X.get('/leaders', async (req, res) => {

  res_data = ''; // header data

  const block = await generateResponseBlock('Leaderboard','<body>','<a href="/ucp">UCP//</a>')
  res_data += block.generated;

  const list_maxgold = await Users.findAll({
    order: [
      ['gold','DESC']
    ]
  })
  const list_maxsilver = await Users.findAll({
    order: [
      ['silver','DESC']
    ]
  })
  const list_maxlevel = await Users.findAll({
    order: [
      ['level','DESC']
    ]
  })
  const list_maxmrecord = await Users.findAll({
    order: [
      ['mrecord','DESC']
    ]
  })
  const list_maxmwealthgold = await M.findAll({
    order: [
      ['gold','DESC']
    ]
  })
  const list_maxmwealthsilver = await M.findAll({
    order: [
      ['silver','DESC']
    ]
  })

  var maxgold = '', maxsilver = '', maxlevel = '', maxmrecord = '', maxmwealthgold = '', maxmwealthsilver = ''

  for (i = 0; i < 12; i++) {
    maxgold += `<a href="/user/${list_maxgold[i].user_id}">${list_maxgold[i].user_id}</a> <gold>${list_maxgold[i].gold} G</gold><br>`
    maxsilver += `<a href="/user/${list_maxsilver[i].user_id}">${list_maxsilver[i].user_id}</a> ${list_maxsilver[i].silver} S<br>`
    maxlevel += `<a href="/user/${list_maxlevel[i].user_id}">${list_maxlevel[i].user_id}</a> <level>${list_maxlevel[i].level} Lv</level><br>`
    maxmrecord += `<a href="/user/${list_maxmrecord[i].user_id}">${list_maxmrecord[i].user_id}</a> <level>${list_maxmrecord[i].mrecord} EXP</level><br>`
    maxmwealthgold += `<a href="/view/${list_maxmwealthgold[i].coordinate}">${list_maxmwealthgold[i].coordinate}</a> <gold>${list_maxmwealthgold[i].gold} G</gold><br>`
    maxmwealthsilver += `<a href="/view/${list_maxmwealthsilver[i].coordinate}">${list_maxmwealthsilver[i].coordinate}</a> ${list_maxmwealthsilver[i].silver} S<br>`
  }

  res_data += `${block_open}<div class="userPropertyBox">${maxgold}top_gold</div>${block_close}`
  res_data += `${block_open}<div class="userPropertyBox">${maxsilver}top_silver</div>${block_close}`
  res_data += `${block_open}<div class="userPropertyBox">${maxlevel}top_level</div>${block_close}`
  res_data += `${block_open}<div class="userPropertyBox">${maxmrecord}top_exp</div>${block_close}`
  res_data += `${block_open}<div class="userPropertyBox">${maxmwealthsilver}most_valuable_silver_nodes</div>${block_close}`
  res_data += `${block_open}<div class="userPropertyBox">${maxmwealthgold}most_valuable_gold_nodes</div>${block_close}`

  res_data += block.motd;
  res_data += block.bodyEnd;


  res.status(200).send(res_data)
})

X.get('/', async (req, res) => {
  index = await readFile('./part/index2_infotext.html')
  logos = await readFile('./part/index2_logos.html')

  if (req.cookies.user_email) req.cookies.user_email = `<a href="/ucp"><blue><u>${req.cookies.user_email}</u></blue></a>`
  if (!req.cookies.user_email) req.cookies.user_email = "Not Logged In"

  var res_data = '';
  const block = await generateResponseBlock('Information','<body onLoad="loadGateway()">','<span title="Jump To Random Location"><a href="#" style="phased" onclick="getRandLoc()">RND//</a></span>')
  res_data += `${block.generated}`
  res_data += `${block_open}<div class="loginbox"><a class="phased" href="/auth">Login/Logout</a> &nbsp;&nbsp;<span title="Jump To Random Location"><a href="#" onclick="getRandLoc()"><level><u>Enter</u></level></a></span><br><br>(${req.cookies.user_email})</div>${block_close}`
  res_data += `${block_open}<br>`
  res_data += `System up since ${StartDate}<br><br>`
  res_data += `${block_close}`
  if (req.cookies.user_email == "Not Logged In") res_data += `${index}`

  res_data += block.motd;

  res_data += `${logos}${block.bodyEnd}`

  console.log('200 /')
  res.status(200).send(res_data)
})

X.get('/logoff', async (req, res) => {
  res.set('location','/')
  res.status(301).send()
})

X.get('/start_instance', async (req, res) => {
  res.status(200).send({
    start_instance: StartDate
  })
})



X.get('/edit/:id', async (req, res) => {
  if (!req.cookies.user_email || !req.cookies.hashed_pwd) return res.status(401).send({
    error: "NOT LOGGED IN / ACCESS DENIED"
  })
  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    var user = await readPortalU(req.cookies.user_email);
    if (user && req.cookies.hashed_pwd != user.portalhash) {
      return res.status(406).send({
        error: "ACCESS DENIED PORTAL HASH DOES NOT EQUAL COOKIE HASH",
      })
    }
  }

  if (!user) return res.status(406).send({
    error: "ACCESS DENIED USER DOESN'T EXIST"
  })
  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  editctrl = await readFile('./part/editctrl.html')
  motd = await readFile('./part/motd.html')

  const { id } = req.params;

  const node = await rMapNode(M,id)

  if (!node || !node.coordinate) return res.status(401).send({
    error: "NODE DOESN'T EXIST IN DATABASE"
  })

  if (node.owner_id != user.user_id) return res.status(406).send({
    error: "NODE OWNERSHIP != USER_ID"
  })

  res_data = ''; // header data
  res_data += `${header}`

  res_data += `<body onLoad="loadEditCtrl()">` // top left elements
  res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
  res_data += `<span title="Information"><a href="/">DEX//</a></span><a href="/view/${id}">${id}</a> ${pub_ver}</div>`

  res_data += `${top_head}` // logo
  res_data += `edit`
  res_data += `</div></div>`

  res_data += `${editctrl}`

  res_data += `${motd}`

  console.log(chalk.blueBright('200 EDIT',id,req.cookies.user_email))

  res.status(200).send(res_data)

})

X.get('/delete/:id', async (req, res) => {

  redirect = await readFile('./part/301.html')

  const { id } = req.params;

  if (!req.cookies.user_email || !req.cookies.hashed_pwd) return res.status(401).send({
    error: "NOT LOGGED IN / ACCESS DENIED"
  })
  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    var user = await readPortalU(req.cookies.user_email);
    if (user && req.cookies.hashed_pwd != user.portalhash) {
      return res.status(406).send({
        error: "ACCESS DENIED PORTAL HASH DOES NOT EQUAL COOKIE HASH",
      })
    }
  }
  Node = await readM(id)
  if (!Node) return res.status(400).send({
    error: "BAD METHOD"
  })
  if (user.user_id != Node.owner_id) return res.status(200).send({
    response: "&nbsp;User doesn't have Ownership."
  })

  newSilver = user.silver + Node.silver;
  newGold = user.gold + Node.gold;

  M.update({owner_id: 0, silver: 2, gold: 0, identity: 0, description: 0},{where:{ coordinate: Node.coordinate }})
  Users.update({silver: newSilver, gold: newGold},{where: { user_id: user.user_id }})

  res.status(200).send(redirect)
})

X.get('/view/:id', async (req, res) => {
  let ReqDate = new Date();
  if (req.cookies.user_email && req.cookies.hashed_pwd) {
    var user = await readPortalU(req.cookies.user_email);
    if (user && req.cookies.hashed_pwd != user.portalhash) {
      return res.status(406).send({
        error: "ACCESS DENIED PORTAL HASH DOES NOT EQUAL COOKIE HASH",
      })
    }
  }
  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  tools = await readFile('./part/toolkit.html')
  acptools = await readFile('./part/acptools.html')
  motd = await readFile('./part/motd.html')

  const { id } = req.params;
  umr(Users,req.cookies.user_email)

  if (id.length != 6 || isNaN(id)) {
    res.status(406).send({
      error: `request ${id} length != 6 or isNaN`
    })
  } else {
    // determine x,y
    xxx = parseInt(id.slice(0, 3))
    yyy = parseInt(id.slice(3, 6))
    // define technical limits
    if (parseInt(xxx) >= 180) xxx = 179
    if (parseInt(yyy) >= 360) yyy = 359
    // "real" lat/lon
    realLat = parseInt(xxx) - 90
    realLon = parseInt(yyy) - 180
    // if system had to make correction
    var corrected = '';
    if (parseInt(id.slice(0, 3)) != xxx) corrected += 'xxx-corrected,'
    if (parseInt(id.slice(3, 6)) != yyy) corrected += 'yyy-corrected,'

    maximus = await generateMapComponents(M,zeroPad(xxx,3),zeroPad(yyy,3))

    glyph = '&#x25C9;';

    var map_system = '<div class="dsp"><!--<div class="nav"><b>N-></b></div>--><table>';

    for (lat = maximus.xmax; lat >= maximus.xmin; lat--) {
      map_system += `<tr>`
      for (lon = maximus.ymin; lon <= maximus.ymax; lon++) {
        var nhead = '', ntail = ''
        addr = `${zeroPad(lat,3)}${zeroPad(lon,3)}`
        NODE = await rMapNode(M,addr)
        if (!NODE) NODE = await mdummy();

        if (NODE.description == 0) NODE.description = '(No Description)'

        // if node ownership belongs to someone else
        if (NODE.owner_id != 0 && NODE.owner_id != undefined) nhead = '<red>', ntail = '</red>'

        // if user can fund node purchase
        if (user && NODE.silver <= user.silver && NODE.gold <= user.gold) nhead = '<blue>', ntail = '</blue>'

        // if user doesn't have enough gold
        if (user && NODE.gold > user.gold) nhead = '<level>', ntail = '</level>'

        // if node has no ownership
        if (NODE.owner_id == 0) nhead = '', ntail = '', NODE.owner_id = '(No Ownership)'

        // if user has node ownership
        if (user && NODE.owner_id == user.user_id) nhead = '<gold>', ntail = '</gold>'

        //if (user && NODE.owner_id != user.user_id && NODE.owner_id != 0 && NODE.owner_id != undefined && NODE.silver)

        // current node highlight
        if (NODE.coordinate == `${zeroPad(xxx,3)}${zeroPad(yyy,3)}`) nhead = '<b>', ntail = "</b>"

        map_system += `<td><a href="/view/${addr}"><span class="nodebase">${nhead}${glyph} ${addr}${ntail}`
        map_system += `<div class="nodeextrude">${NODE.coordinate}(${NODE.identity})<br>${NODE.description}<br>${NODE.owner_id}</div></span></a></td>`
      }
      map_system += `</tr>`
    }

    map_system += `</table></div>`

    // load node data
    BYTE = await readM(`${zeroPad(xxx,3)}${zeroPad(yyy,3)}`);
    if (!BYTE) {
      BYTE = mdummy()
      USER = udummy()
      corrected += 'node-empty-in-database,'
    } else {
      USER = await readU(BYTE.owner_id);
    }

    if (!BYTE.coordinate) {
      BYTE.coordinate = `<b><span title="node-empty-in-database">(Error)</span></b>`
    }

    ident_img_array = [
      '1_city','2_nIV','3_spar','4_spar','5_spar','6_defconstruct',
      '7_railgun','8_nithya','9_dark','10_arirealm','11_arigate','12_NULL','13_astragate','14_lightgate','15_construct','16_wormhole',
      '17_star','18_star','19_other','20_void','21_star'
    ]

    if (!BYTE.identity) {
      BYTE.identity = 16
    }
    if (!BYTE.description || BYTE.description == 0) {
      BYTE.description = `(No Description)`
    }

    var lvDisplay = '';
    if (USER.level) {
      lvDisplay = `${USER.level}`;
    } else {
      lvDisplay = 0;
    }

    var ownerlink = '', linkclose = '';
    if (BYTE.owner_id != 0 && BYTE.owner_id != undefined) {
      var ownerlink = `<a href="/user/${BYTE.owner_id}">`, linkclose = `</a>`
    }

    ident_img = `${ident_img_array[BYTE.identity-1]}.gif`

    var box_provider = '';
    if (req.cookies.user_email && req.cookies.hashed_pwd) var box_provider = `<a onclick="poptoast('ebox')"><span style="font-family: devicons; font-weight: normal; font-style: normal; font-size: 25px;" ><green>&#xe664;</green></span></a>`;

    var disp_right = '';
    disp_right = `<div class="display-corner-right"><img src="https://shadowsword.tk/img/avaira/${ident_img}">`
    disp_right += `<div class="bottom-right"><span title="Identity">(${BYTE.identity})</span></div>`
    disp_right += `<div class="top-gold"><span title="Cost Gold">${BYTE.gold} G</span></div>`
    disp_right += `<div class="top-edgebar"><span title="Controls">${box_provider}</span></div>`
    disp_right += `<div class="top-level"><level><span style="font-size: 20px !important;" title="Node Level">${lvDisplay}</span></level></div>`
    disp_right += `<div class="top-silver"><span title="Cost Silver">${BYTE.silver} S</span></div>`
    disp_right += `<div class="bottom-left">${BYTE.coordinate}</div>`
    disp_right += `</div>`

    var metadata = '(METADATA) NOT IMPLEMENTED';
    var owner_flag = '';
    var edit_flag = '';

    if (!USER) USER = {}, USER.level = 0;

    if (user && user.user_id != BYTE.owner_id && user.silver >= BYTE.silver && user.gold >= BYTE.gold && user.level >= USER.level) {
      edit_flag = `<div class="editbox"><a class="phased" href="/buy/${zeroPad(xxx,3)}${zeroPad(yyy,3)}">Capture</a></div>`
    }

    if (user && user.user_id === BYTE.owner_id) {
      var owner_flag = '(Owned)';
      var edit_flag = `<div class="editbox"><a class="phasedYel" href="/edit/${zeroPad(xxx,3)}${zeroPad(yyy,3)}">Edit</a></div>`
    }
    metadata = `<div class="extrusionbase"><b>Request: ${id} ${owner_flag}</b><span class="extrude">`
    metadata += `X: ${xxx} `
    metadata += `Y: ${yyy}<br>${ownerlink}Ownership: <b>${BYTE.owner_id}</b>${linkclose}<br>`
    metadata += `M${BYTE.owner_id.toString().substring(0,5)}..//U${USER.user_id.toString().substring(0,5)}.. <br>`
    metadata += `COST: ${BYTE.gold} G, ${BYTE.silver} S`

    let PushDate = new Date();
    var updateTime = PushDate.getTime()-ReqDate.getTime();

    metadata += `</span></div><br><br><span style="font-family: devicons; font-weight: normal; font-style: normal; font-size: 20px;" >&#xe606</span> ${updateTime} ms<br><br><br>`
    metadata += `address: ${zeroPad(xxx,3)}${zeroPad(yyy,3)}<br>`
    //metadata += `coordinate: ${BYTE.coordinate}<br>`
    metadata += `lat,lon: <a href="https://www.google.com/maps/@${realLat}.0000000,${realLon}.0000000,8.0z">${realLat}.00,${realLon}.00</a><br>`
    metadata += `<br><br>`
    //metadata += `<br>description: <b>${BYTE.description}</b><br><br>`
    //metadata += `updated_at: ${BYTE.updatedAt}<br>`
    //metadata += `created_at: ${BYTE.createdAt}`


    // send response
    //console.log(BYTE)

    if (!user) user = {}, user.level = 0, user.silver = 0, user.gold = 0;

    res_data = ''; // header data
    res_data += `${header}`

    res_data += `<body onLoad="loadPortal()">` // top left elements
    res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
    res_data += `<span title="Information"><a href="/">DEX//</a></span>${zeroPad(xxx,3)}${zeroPad(yyy,3)} ${pub_ver}</div>`

    res_data += `${top_head}` // logo
    res_data += `view`
    res_data += `</div></div>`

    res_data += `${tools}` // view and translate toolkit

    res_data += `${block_open}${map_system}${block_close}`

    res_data += `${block_open}<div style="font-size: 16px;">Description: <b>${BYTE.description}</b></div>${block_close}`

    res_data += `${block_open}<div class="dsp">${disp_right}${metadata}</div>${block_close}`

    const failure = `<span class="segmentfail">`
    const pass = `<span class="segmentpass">`

    var levelPass = failure;
    if (parseInt(lvDisplay) <= user.level) levelPass = pass;

    var silverPass = failure;
    if (BYTE.silver <= user.silver) silverPass = pass;

    var goldPass = failure;
    if (BYTE.gold <= user.gold) goldPass = pass;

    //if (user.user_id)

    res_data += `<blockquote class="toast tooldrop dsp" id="ebox">`
    res_data += `<a>Level <level>${lvDisplay}</level> // <level>${user.level} (you)</level> ${levelPass}&#9679;</span></a><br>`
    res_data += `<a>Gold <gold>${BYTE.gold}</gold> // <gold>${user.gold} (you)</gold> ${goldPass}&#9679;</span></a><br>`
    res_data += `<a>Silver ${BYTE.silver} // ${user.silver} (you) ${silverPass}&#9679;</span></a>`
    res_data += `${edit_flag}`
    res_data += `${block_close}`

    res_data += `${block_open}<div class="loginbox"><green><span title="Sovereignty Updated">sov.: ${BYTE.updatedAt}</span></green>`
    res_data += `<br><span title="Node Generated">gen.: ${BYTE.createdAt}</span>`
    res_data += `<br><br><span title="Requested"><gold>req.: ${new Date()}</gold></span>`
    res_data += `<br><span title="Uptime">upt.: ${StartDate}</span>`

    res_data += `</div>${block_close}`

    res_data += `${motd}`

    if (user.permission >= 3) {
      res_data += `${acptools}`
    }

    res_data += `</body>` // closing tag

    console.log(chalk.blueBright(`200 ${id} ${req.cookies.user_email}`))
    res.status(200).send(res_data)
  }
})

// VIEW :id
X.get('/node_json/:id', async (req, res) => {

  const { id } = req.params;

  if (id.length != 6 || isNaN(id)) {
    res.status(406).send({
      error: `request ${id} length != 6 or isNaN`
    })
  } else {
    // determine x,y
    xxx = parseInt(id.slice(0, 3))
    yyy = parseInt(id.slice(3, 6))
    // define technical limits
    if (parseInt(xxx) >= 180) xxx = 179
    if (parseInt(yyy) >= 360) yyy = 359
    // width, height of projection
    var xmin = parseInt(xxx) - 4,
      xmax = parseInt(xxx) + 5,
      ymin = parseInt(yyy) - 2,
      ymax = parseInt(yyy) + 3;
    if (xmin < 0) xmin = 0;
    if (xmax >= 180) xmax = 179;
    if (ymin < 0) ymin = 0;
    if (ymax >= 360) ymax = 359;
    // "real" lat/lon
    realLat = parseInt(xxx) - 90
    realLon = parseInt(yyy) - 180
    // if system had to make correction
    var corrected = '';
    if (parseInt(id.slice(0, 3)) != xxx) corrected += 'xxx-corrected,'
    if (parseInt(id.slice(3, 6)) != yyy) corrected += 'yyy-corrected,'
    // load node data
    BYTE = await readM(`${zeroPad(xxx,3)}${zeroPad(yyy,3)}`);
    if (!BYTE) {
      BYTE = mdummy()
      USER = udummy()
      corrected += 'node-empty-in-database,'
    } else {
      USER = await readU(BYTE.owner_id);
    }

    // send response
    //console.log(BYTE)
    console.log('200 json',id,req.cookies.user_email)
    res.status(200).send({
      request: {
        raw: id,
        xxx: xxx,
        yyy: yyy,
        address: `${zeroPad(xxx,3)}${zeroPad(yyy,3)}`,
        geo: {
          lat: `${realLat}.00`,
          lon: `${realLon}.00`,
          coordinate: `${realLat}.00,${realLon}.00`,
          google_url: `https://www.google.com/maps/@${realLat}.0000000,${realLon}.0000000,8.0z`,
        },
        limits: {
          xmin: xmin,
          xmax: xmax,
          ymax: ymax,
          ymin: ymin,
        }
      },
      node: {
        errors: {
          warning: corrected,
        },
        node_ownership: {
          owner_id: BYTE.owner_id,
          node_updatedAt: BYTE.updatedAt,
          node_createdAt: BYTE.createdAt,
          user_id: USER.user_id,
          user_permission: USER.permission,
          user_level: USER.level,
          user_silver: USER.silver,
          user_gold: USER.gold,
          user_mrecord: USER.mrecord,
        },
        node_coordinate: BYTE.coordinate,
        node_cost_silver: BYTE.silver,
        node_cost_gold: BYTE.gold,
        node_identity: BYTE.identity,
        node_description: BYTE.description,
      },
    })
  }
});


X.get('/buy/:id', async (req, res) => {
  flag = await checkAuthorization(req.cookies.user_email, req.cookies.hashed_pwd)
  if (!flag) return res.status(401).send({error: "UNAUTHORIZED / HASH ERROR / NOT LOGGED IN"})
  const { id } = req.params;
  Node = await readM(id)
  if (!Node) return res.status(400).send({
    error: "BAD METHOD"
  })

  if (user.silver < Node.silver || user.gold < Node.gold) return res.status(400).send({
    error: "USER NOT ENOUGH FUNDS"
  })

  if (Node.owner_id != 0) var owner_user = await readU(Node.owner_id);
  if (!owner_user) owner_user = {}, owner_user.level = 0;
  if (owner_user.level > user.level) return res.status(400).send({
    error: "NODE OWNER LEVEL > USER LEVEL"
  })

  user_gold = user.gold - Node.gold;
  user_silver = user.silver - Node.silver;
  user_mrecord = user.mrecord + 1;

  Users.update({ gold: user_gold, silver: user_silver, mrecord: user_mrecord },{ where:{ user_id: user.user_id }})

  M.update({ owner_id: user.user_id },{where: { coordinate: Node.coordinate }})
  redirect = await readFile('./part/301.html')
  console.log('301 PURCHASE',req.cookies.user_email)
  res.status(200).send(redirect)
})


/*X.get('/mission/:page', async (req, res) => {
  flag = await checkAuthorization(req.cookies.user_email, req.cookies.hashed_pwd)
  if (!flag) return res.status(401).send({error: "UNAUTHORIZED / HASH ERROR / NOT LOGGED IN"})

  const { page } = req.params;

  header = await readFile('./part/header.html')
  pub_ver = await readFile('./part/pub_ver.html')
  top_head = await readFile('./part/top_head.html')
  motd = await readFile('./part/motd.html')

  res_data = ''; // header
  res_data += `${header}`

  res_data += `<body>` // top left elements
  res_data += `<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span>`
  res_data += `<span title="Information"><a href="/">MISSION//</a></span><red>PAGE ${page}</red> ${pub_ver}</div>`

  res_data += `${top_head}bounty</div></div>`

  res_data += `${block_open}`

  MiData = await Mission.findAll({
    order: [
      ['id','DESC']
    ]
  })

  pStart = Math.floor(page*10)-10;
  pEnd = Math.floor(page*10);

  d_status = ['<b>ACTIVE</b>','<red>INACTIVE</red>','<jsonbutton>NON-PRIORITY</jsonbutton>'];
  d_difficulty = ['Neophyte','Intermediate','Advanced','Angelic','Celestial','Suicide']
  d_type = ['ENEMY','ENEMY AREA','MISSION']
  d_corruption = ['Shattered','Voidal','Malignant','Corrupt','Diseased','Ailed','Quiet','Healthy','Evolving','Ascended']

  for (i = pStart; i < pEnd; i++) {
    if (MiData[i] != undefined) {
      var D = MiData[i]
      var cdDate = new Date(D.m_date).getTime(),
      cdNow = new Date().getTime();
      var distance = cdNow - cdDate;
      //var days = Math.floor(distance / (1000 * 60 * 60 * 24))+1;
      //var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      //var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      //var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      //D.m_left = days + "d " + hours + "h " + minutes + "m " + seconds + "s"
      res_data += `ID ${D.id} ${d_status[D.m_complete]}<br>(${D.owner_id}) `
      res_data += `<red>Difficulty: ${d_difficulty[D.m_difficulty]} (${d_corruption[D.m_corruption]})</red> "${D.m_name}" <br>${d_type[D.m_type]} @<a href="/view/${D.m_area}">${D.m_area}</a> <level>SEC[${D.m_area_securityrating}]</level> <br><gold>${D.m_description}</gold> <br><b><red>( @ ${D.m_date} )</red></b><br><br>`
    } else {
      res_data += `ID ${i} (BLANK)<br>`
    }
  }

  res_data += `${block_close}`

  res.status(200).send(res_data)
})*/
