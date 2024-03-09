const { JsonRpcProvider} = require('ethers');
const rpcJson = require('./rpc_pool.json');

async function run() {
    
    let rpcArr = getAllEthRpc();
    rpcArr = shuffleArray(rpcArr);
    for (;;) {
        await doRun(rpcArr);
    }
}

async function doRun(rpcArr) {

    for (let rpc of rpcArr) {
        try {
            await requestRpc(rpc).catch(err => console.log(`发生异常: ${err}`))
        } catch (err) {
            console.log(`发生异常: ${err}`)
        }
    }

}

async function requestRpc(rpc) {
    console.log(rpc)
    const provider = new JsonRpcProvider(rpc)

    // 获取指定区块
    // const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock().catch(err => console.log(`发生异常: ${err}`));

    await new Promise(resolve => setTimeout(resolve, 300));

    // 获取区块中的所有交易数据
    const transactions = await Promise.all(block.transactions.map( async txHash => await provider.getTransaction(txHash)))
    .catch(err => console.log(`发生异常: ${err}`));

    
    console.log(`当前区块高度：${block.number}, tx数量: ${transactions.length}`)

    console.log(`开始查询tx中地址余额......`)

    for (let tx of transactions) {
        let balance;
        if (tx.to) {
            balance = await provider.getBalance(tx.to).catch(err => console.log(`发生异常: ${err}`))
            console.log(`${tx.to} 余额: ${balance}`)
        }
        if (tx.from) {
            balance = await provider.getBalance(tx.from).catch(err => console.log(`发生异常: ${err}`))
            console.log(`${tx.from} 余额: ${balance}`)
        }

        console.log("暂停450Ms")
        await new Promise(resolve => setTimeout(resolve, 450));
    }

}

function getAllEthRpc() {
    let data = []
    for (let key in rpcJson) {
        let rpcArr = rpcJson[key]['ETH'];
        data = data.concat(rpcArr)
    }
    return data.filter(el => el);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

(async () => await run())()