
async function generateNode(M,address) {
  // write cell/node to database
  try {
    const block = M.create({
      coordinate: address,
      owner_id: 0,
      silver: 2,
      gold: 0,
      identity: '0',
      description: '0',
    }).catch(err=>{
      if (err.name === 'SequelizeUniqueConstraintError') {
        //console.log('SYS',address,'NODE EXISTS')
      }
    })
    //console.log('SYS',address,'NODE OK')
  }
  catch (e) {
    console.log(e)
  }
}

async function rMapNode(M,addr) {
  return node = await M.findOne({ where: { coordinate: addr }})
}

async function generateMapComponents(M,x,y) {
  // min/max
  var xmin = parseInt(x) - 5,
    xmax = parseInt(x) + 5,
    ymin = parseInt(y) - 5,
    ymax = parseInt(y) + 4;
  if (xmin < 0) xmin = 0;
  if (xmax >= 180) xmax = 179;
  if (ymin < 0) ymin = 0;
  if (ymax >= 360) ymax = 359;
  var workload = [];
  // loop through generation

  await (async function loop() {
    for (lat = xmin; lat < xmax; lat++) {
      for (lon = ymin; lon < ymax; lon++) {
        var xx = zeroPad(lat,3)
        var yy = zeroPad(lon,3)
        var address = `${xx}${yy}`
        await generateNode(M,address);
      }
    }
  })().then(r => {
    console.log(chalk.greenBright('201 generateMapComponents X',xmin,xmax,'Y',ymin,ymax))
  })

  data = {};
  data.xmin = xmin;
  data.xmax = xmax;
  data.ymin = ymin;
  data.ymax = ymax;

  return data;
  // just calls generateNode function and puts it in cells
  //console.log(workload)
  //node = await rMapNode(M,x,y);
  //
  //return node.silver;
}


function generateRewardSlot(user){
  try {
    const tag = Rewards.create({
      user_id: user.user_id,
      last_execution: new Date().getTime(),
      next_execution: new Date().getTime() - 1,
      hash: "0",
      key: "0",
      reward: 0,
    }).catch(e => {
      //console.log(e)
    })
  } catch (e) {
    //if (e.name === 'SequelizeUniqueConstraintError') console.log(chalk.greenBright(`DOCUMENT EXIST ${user_id}`))
  } finally {
    console.log('New User Reward Slot')
  }
  var tag = {};
  tag.user_id = user.user_id,
  tag.last_execution = new Date().getTime(),
  tag.next_execution = new Date().getTime() - 1,
  tag.hash = "0",
  tag.key = "0",
  tag.reward = 0;
  return tag;
}


async function generateResponseBlock(pgname,body_loaded,url_extension){
  if (!pgname) pgname = 'Untitled'
  if (!body_loaded) body_loaded = '<body>'
  if (!url_extension) url_extension = ''

  var tag = {};
  tag.h = await readFile('./part/header.html'),
  tag.v = await readFile('./part/pub_ver.html'),
  tag.imgh = await readFile('./part/top_head.html'),
  tag.motd = await readFile('./part/motd.html');
  tag.bodyEnd = '</body></html>'

  tag.generated = `${tag.h}${body_loaded}<div class='display-topleft'><span title="Home"><a href="https://shadowsword.tk/">SSTK//</a></span><span title="Information"><a href="/">DEX//</a>${url_extension}${pgname} ${tag.v}</div>${tag.imgh}${pgname}</div></div>`;
  return tag;
}
