const Ponzi = artifacts.require("ponzi");

contract('test', async (accounts) => {

  it("have an initial zero balance", async () => {
     let instance = await Ponzi.deployed();
     let balance = await web3.eth.getBalance(instance.address);
     assert.equal(balance.valueOf(), 0);
  })
 
  it("can present new user", async () => {
    let instance = await Ponzi.deployed();
    //presenter is the contract creator
    let presenter = accounts[0];
    let from = accounts[1]; //new user joining the pyramid
    await instance.join(presenter,{value:web3.toWei(10,"finney"), from:from});
    let balance = await web3.eth.getBalance(instance.address);
    assert.equal(balance.valueOf(), web3.toWei(10,"finney"));
    
 })

 it("can't present twice", async () => {
  let instance = await Ponzi.deployed();
  //presenter is the contract creator
  let presenter = accounts[0];
  let from = accounts[1]; //new user joining the pyramid
  await instance.join(presenter,{value:web3.toWei(10,"finney"), from:from});
  let balance = await web3.eth.getBalance(instance.address);
  assert.equal(balance.valueOf(), web3.toWei(10,"finney"));
  
})
  
});