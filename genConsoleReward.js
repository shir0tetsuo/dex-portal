const SHA256 = require('crypto-js/sha256')

const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: '../avaira/avaira.db',
});

const Rewards = sequelize.define('rewards', {
  user_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  last_execution: {
    type: Sequelize.STRING,
    defaultValue: "0",
    allowNull: false,
  },
  next_execution: {
    type: Sequelize.STRING,
    defaultValue: "0",
    allowNull: false,
  },
  hash: {
    type: Sequelize.STRING,
    unique: true,
  },
  key: {
    type: Sequelize.STRING,
    defaultValue: 0,
    allowNull: false,
  },
  reward: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  }
})

Rewards.sync()

function getNow(){
  return new Date().toLocaleString();
}

class Block{
  constructor(lvlDifficulty,wlvl){
    this.timestamp = getNow();
    this.execution = new Date().getTime();
    this.nonce = 0;
    this.hash = this.calculateHash();
    this.work = this.work(wlvl);
    this.reward = Math.round(this.nonce/1000+(lvlDifficulty/2))
    this.claimWithin = Math.round(new Date().getTime() + (1000*90*(lvlDifficulty+1)))
    //this.claimWithin = this.calculateNextExecution(this.nonce, lvlDifficulty) // 5 min
  }

  calculateHash(){
    return SHA256(this.timestamp + this.execution + this.nonce).toString();
  }

  work(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash()
    }
    return true;
  }
}

let block = new Block(4096,5)

console.log(block);
console.log(`${block.reward}G, https://realmdex.shadowsword.tk/bank/hash/${block.hash}/${block.nonce}`)
Rewards.update({hash: block.hash, key: block.nonce, last_execution: block.execution, next_execution: block.claimWithin, reward: block.reward},{where:{user_id: '1P074X1622518786829'}})
