
X.post('/bank/getwork', async(req, res) => {
  flag = await checkAuthorization(req.cookies.user_email, req.cookies.hashed_pwd)
  if (!flag) return res.status(401).send({error: "UNAUTHORIZED / HASH ERROR / NOT LOGGED IN"})

  user = await readPortalU(req.cookies.user_email)

  rewardInfo = await readReward(user.user_id)
  if (!rewardInfo) {
    rewardInfo = await generateRewardSlot(user)
  }
  if (rewardInfo.next_execution > new Date().getTime()) {
    res.status(200).send({ response: `<red>Sorry, you can't use this for a little while.</red><br><br>hash_balance: ${rewardInfo.reward} G<br>lex: ${new Date(Math.round(rewardInfo.last_execution)).toLocaleString()}<br>req: ${new Date().toLocaleString()}<br><red>exe: ${new Date(Math.round(rewardInfo.next_execution)).toLocaleString()}</red><br>hash: <a class="phased" href="/bank/hash/${rewardInfo.hash}/${rewardInfo.key}">${rewardInfo.hash}` })
  } else {
    block = await gsmine.mine(user)
    Rewards.update({last_execution: block.execution, next_execution: block.claimWithin, hash: block.hash, key: block.nonce, reward: block.reward},{where:{user_id:user.user_id}})
    res.status(200).send({
      response: `${block.timestamp}<br><a href="/bank/hash/${block.hash}/${block.nonce}" class="phasedYel">${block.hash}</a>`
    })
  }

  console.log(200,'Bank-Roll',req.cookies.user_email)
})


X.post('/update', async (req, res) => {
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
  Node = await readM(req.body.address)
  if (!Node) return res.status(400).send({
    error: "BAD METHOD"
  })
  if (user.user_id != Node.owner_id) return res.status(200).send({
    response: "&nbsp;User doesn't have Ownership."
  })

  var node_cost_gold = Node.gold,
  node_cost_silver = Node.silver,
  ident_request = req.body.identity,
  descr_request = req.body.desc,
  gold_request = req.body.gold,
  silver_request = req.body.silver;

  // if the request length in the description exceeds maximum
  if (descr_request.length > 33) return res.status(400).send({error: "Descr len > 33"})

  // if the request leaves the node with less than 0
  if (gold_request < 0 || silver_request < 0) return res.status(400).send({error: "Silver/Gold < 0"})

  var gold_after = Node.gold - gold_request,
  silver_after = Node.silver - silver_request;

  var user_gold_after = user.gold + gold_after,
  user_silver_after = user.silver + silver_after;

  // if the request leaves the user with less than 0
  if (user_gold_after < 0 || user_silver_after < 0) return res.status(400).send({error: "User funds < 0"})

  if (descr_request == '(No Description)') descr_request = 0;

  Users.update({ gold: user_gold_after, silver: user_silver_after },{ where: { portalemail: req.cookies.user_email }})
  M.update({ gold: gold_request, silver: silver_request, identity: ident_request, description: descr_request },{ where: { coordinate: Node.coordinate }})

  res.status(200).send({
    response: "&nbsp;<b>Update Successful</b>",
    reload: true,
  })

  console.log(chalk.greenBright('301 UPDATE SUCCESS',req.cookies.user_email))
})

X.post('/auth/authorize', async (req, res) => {
  var user_email = req.body.user_email;
  var user_password = req.body.password;
  var user_confirm = req.body.passwordconfirmation;
  const hash = bcrypt.hashSync(user_password, saltRounds);
  // EMAIL AUTHENTICATION RULES

  if (!user_email || /...*@..*\..*$/.test(user_email) == false) {
    // bad email
    return res.status(200).send({
      authority: 5,
    })
  }
  if (!user_password || user_password.length < 8) {
    // no password or len < 8
    return res.status(200).send({
      authority: 0,
    })
  } else {
    //console.log(user_email)
    const portalUser = await readPortalU(user_email);
    //console.log(portalUser)
    // error 3 cannot find email
    if (!portalUser && user_confirm == user_password) {
      const user_id = await genID()
      const generation = await newAccount(Users, user_id, user_email, hash)
      return res.status(200).send({
        authority: 22,
        user_id: user_id,
        start_instance: StartDate,
      })
    }
    if (!portalUser || portalUser.portalemail == 0) {
      return res.status(200).send({authority: 3,});
    }
    if (portalUser.portalhash == 'REGISTER' && user_confirm != user_password) {
      return res.status(200).send({
        authority: 20,
      });
    }
    if (portalUser.portalhash == 'REGISTER' && user_confirm == user_password) {
      Users.update({ portalhash: hash },{ where: { portalemail: user_email }})
      console.log(chalk.greenBright('200 AUTHORIZED/HASHED LEGACY',user_email))
      return res.status(200).send({
        authority: 21,
      })
    }
    if (portalUser.portalban == true) return res.status(200).send({authority: 2,});
    if (portalUser.portalemail) {
      if (portalUser.portalhash == 0) return res.status(200).send({ authority: 4, })
      if (bcrypt.compareSync(user_password, portalUser.portalhash)) {
        console.log(chalk.greenBright(`200 Access Elevated by Server ${user_email}`))
        res.status(200).send({
          authority: 1,
          cookie: {
            user_email: user_email,
            hashed_pwd: portalUser.portalhash
          },
          toast: 'server_error',
          login: `<a href="/"><b>Access Granted</b></a><br>Reloading in 5sec.`,
        })
      } else {
        res.status(200).send({
          authority: 4,
        })
      }
    } else {
      return res.status(200).send({
          authority: 3,
        })
    }
  }
  //res.status(501).send('NOT IMPLEMENTED')
})
