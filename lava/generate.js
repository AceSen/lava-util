const { HDNodeWallet } = require('ethers');
const fs = require('fs')
const config = require('./config.json')

function generatePrivateKey() {
    const prePath = "m/44'/60'/0'/0/"
    let start = config.walletStartNo;

    const privateKeyArr = [];
    for (let i = start; i < start + config.generateNum; i++) {
        let path = prePath + i;
        let wallet = HDNodeWallet.fromPhrase(config.phrase, null, path);
        console.log(`PATH: 【 ${(i)} 】, 当前地址：${wallet.address}`)
        
        privateKeyArr.push(wallet.privateKey)
          
    }
    console.log("正在将私钥写入csv文件......")
    const data = privateKeyArr.join('\n')
    fs.writeFileSync("privateKey.csv", data);

}

generatePrivateKey();