const Ponzi = artifacts.require("Ponzi");

contract('test', async (accounts) => {
  var instance;
  beforeEach('setup contract for each test', async function () {
    await Ponzi.deployed();
    instance = await Ponzi.new()
  })

  it("have an initial zero balance", async () => {
     //let instance = await Ponzi.deployed();
     let balance = await web3.eth.getBalance(instance.address);
     assert.equal(balance.valueOf(), 0);
  }),
 
  it("can present new user", async () => {
    //let instance = await Ponzi.deployed();
    //presenter is the contract creator
    let presenter = accounts[0];
    let from = accounts[1]; //new user joining the schema
    await instance.join(presenter,{value:web3.toWei(10,"finney"), from:from});
    let balance = await web3.eth.getBalance(instance.address);
    assert.equal(balance.valueOf(), web3.toWei(10,"finney"));
    
 }),

 it("can present new user if member of the schema", async () => {
  //let instance = await Ponzi.deployed();
  //presenter is the contract creator
  let presenter = accounts[0];
  let from = accounts[1]; //new user joining the schema
  await instance.join(presenter,{value:web3.toWei(10,"finney"), from:from});
  let balance = await web3.eth.getBalance(instance.address);
  
  assert.equal(balance.valueOf(), web3.toWei(10,"finney"));
  presenter = from; //new member as a presenter
  from=accounts[2];  // new entering member
  await instance.join(presenter,{value:web3.toWei(10,"finney"), from:from});
  balance = await web3.eth.getBalance(instance.address);
  //contract must be rewarded
  assert.equal(balance.valueOf(), web3.toWei(20,"finney")); 
  let count = await instance.membersCount.call();
  //should have tree members on the schema
  assert.equal(3,count.toNumber());
  

}),
it("receive a reward presenting two users", async () => {
  //let instance = await Ponzi.deployed();
  //presenter is the contract creator
  let presenter = accounts[0];
  let from = accounts[1]; //new user joining the schema
  //this user will present two members so weneed to check his balance
  //too se if he's rewarded
  
  await instance.join(presenter,{value:web3.toWei(10,"finney"), from:from});
  let balance = await web3.eth.getBalance(instance.address);
  assert.equal(balance.valueOf(), web3.toWei(10,"finney"));

  //this user will present two members so weneed to check his balance
  //too se if he's rewarded. We check here so we overtake the gas used
  //in presentation
  userBalance = await web3.eth.getBalance(accounts[1]); 
  
  presenter = from; //new member as a presenter
  from=accounts[2];  // new entering member
  await instance.join(presenter,{value:web3.toWei(10,"finney"), from:from});

  balance = await web3.eth.getBalance(instance.address);
  //contract must be rewarded
  assert.equal(balance.valueOf(), web3.toWei(20,"finney")); 

  //new user join presented by the new user :) ...
  from=accounts[3];  // new entering member
  await instance.join(presenter,{value:web3.toWei(10,"finney"), from:from});
  let count = await instance.membersCount.call();
  //should have tree members on the schema
  assert.equal(4,count.toNumber());
  let userBalanceRewarded = await web3.eth.getBalance(accounts[1]); 
  let diff = userBalanceRewarded.toNumber()-userBalance.toNumber();
  
  assert.equal(diff,web3.toWei(10,"finney"));

}),

 it("can't present new user if not on schema", async () => {
  //let instance = await Ponzi.deployed();
  //presenter is the contract creator
  let presenter = accounts[2]; // not on the schema
  let from = accounts[3]; //new user joining the schema
  let countBefore = await instance.membersCount.call();
  //balance of the presenter, that should get money back since his presentation fails
  let balanceBefore = await web3.eth.getBalance(accounts[2]);
  try{
    await instance.join(presenter,{value:web3.toWei(10,"finney"), from:from});
  }catch(error){
    //we expect an exception
  }
  let countAfter = await instance.membersCount.call();
  let balanceAfter = await web3.eth.getBalance(accounts[2]);
  assert.equal(countBefore.toNumber(),countAfter.toNumber());
  assert.equal(balanceBefore.valueOf(),balanceAfter.valueOf());
}),

 it("can't present twice", async () => {
  //let instance = await Ponzi.deployed();
  //presenter is the contract creator
  let presenter = accounts[0];
  let from = accounts[1]; //new user joining the pyramid
  let countBefore = await instance.membersCount.call();
  try{
    //present once
    await instance.join(presenter,{value:web3.toWei(10,"finney"), from:from});
    //present twice
    await instance.join(presenter,{value:web3.toWei(10,"finney"), from:from});
  }
  catch(error){
    //we expect it can catch
  }
  let countAfter = await instance.membersCount.call();
  
  //ust one presentation must succeed..
  assert.equal(countBefore.toNumber()+1,countAfter.toNumber());
  
}),
  it("can't accept ether without calling join", async()=>{
    //let instance = await Ponzi.deployed();
    let balance = await web3.eth.getBalance(instance.address);
    try{
      await instance.send(100, {from: accounts[0]})
    }catch(error){
      //we expect an exception...
    }
    let after = await web3.eth.getBalance(instance.address);
    assert.equal(balance.valueOf(),after.valueOf());
  }),
  it("can't join with bad price", async () => {
    //let instance = await Ponzi.deployed();
    //presenter is the contract creator
    let presenter = accounts[0];
    let from = accounts[1]; //new user joining the pyramid
    let balance = await web3.eth.getBalance(instance.address);
    try{
      await instance.join(presenter,{value:web3.toWei(11,"finney"), from:from});
    }catch(error){
      //we expect an exception
    }
    let after = await web3.eth.getBalance(instance.address);
    assert.equal(balance.valueOf(), after.valueOf());
    
 })
});