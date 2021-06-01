const SHA256 = require('crypto-js/sha256')

function getNow(){
  return new Date().toLocaleString();
}

class Block{
  constructor(lvlDifficulty){
    this.timestamp = getNow();
    this.execution = new Date().getTime();
    this.nonce = 0;
    this.hash = this.calculateHash();
    this.work = this.work(5);
    this.reward = Math.round(this.nonce/1000+(lvlDifficulty/2))
    this.claimWithin = Math.round(new Date().getTime() + (1000*90*lvlDifficulty))
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

exports.mine = async (user) => {
  let block = await new Block(user.level);
  console.log(block)
  return block;
}
