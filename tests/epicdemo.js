const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log("Starting test...");
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Epicdemo;
  
  // this is where the test account is instantiated
  const baseAccount = anchor.web3.Keypair.generate();
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId, 
    },
    signers: [baseAccount],
  });
  
  
  console.log("Your transaction signature", tx);
  
  //initite the gif counter
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('Gif count', account.totalGifs.toString());

  await program.rpc.addGif("https://media.giphy.com/media/3oEhn51EPgFiSQw8GQ/giphy.gif",{
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  // Get the account again to see what changed. 
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString());   

  console.log('Gif list', account.gifList)
}

//runMain actually is the container of the test function
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
};

runMain();