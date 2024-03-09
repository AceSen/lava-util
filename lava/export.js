const fetch = require("node-fetch");
const fs = require("fs");
const config = require("./config.json");
const { Wallet, JsonRpcProvider } = require("ethers");
const selectRandomCode = require("./random").selectRandomCode;

const csvFilePath = "privateKey.csv";
const provider = new JsonRpcProvider(
  "https://eth1.lava.build/lava-referer-c8410a52-8703-4da7-9c53-85acd0427b35/"
);

const inviteCode = config.invateCode;

let invite_code_list = [inviteCode];

const headers = {
  accept: "application/json",
  "accept-language": "zh-CN,zh;q=0.9",
  "content-type": "application/json",
  "sec-ch-ua":
    '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  Referer: "https://points.lavanet.xyz/",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const loginUrl = "https://points-api.lavanet.xyz/accounts/metamask/login/";
let meUrl = "https://points-api.lavanet.xyz/api/v1/users/me";

function parsePrivateKey2Arr() {
  let arr;
  try {
    const data = fs.readFileSync(csvFilePath, "utf-8");
    arr = data.split("\n");
    console.log(`✅ 读取私钥文件成功，私钥数量： ${arr.length}`);
  } catch (err) {
    console.log(`❌ 读取私钥文件失败, 错误信息: ${err}`);
  }
  return arr;
}

async function exportRpc() {
  const privateKeyArr = parsePrivateKey2Arr();
  const rpcPool = {};
  let i = 1;

  for (privateKey of privateKeyArr) {
    try {
      await appendRpc(privateKey, rpcPool, invite_code_list);
    } catch (err) {
      console.log(`发生获取RPC发生异常: ${err}`);
      console.log(`跳过异常, 继续执行`);
    }
    console.log(`==========第 ${i} 次RPC获取完成==========`);
    i++;
  }

  console.log("正在导出RPC POOL, 文件名为：rpc_pool.json");
  console.log(rpcPool);
  const rpcPoolStr = JSON.stringify(rpcPool, null, 2);
  fs.writeFileSync("rpc_pool.json", rpcPoolStr);
}

async function appendRpc(privateKey, rpcPool, invite_code_list) {
  const use_invite_code = selectRandomCode(invite_code_list);
  const wallet = new Wallet(privateKey, provider);
  const address = wallet.address;

  // request 1 获取签名数据
  console.log(`使用的 invite code: ${use_invite_code}`);

  let loginDataParam = {
    account: address.toLowerCase(),
    process: "token",
    invite_code: selectRandomCode(use_invite_code),
  };

  let loginDataRes = await fetch(loginUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(loginDataParam),
  });

  const loginData = await loginDataRes.json();
  const loginDataCookie = loginDataRes.headers.get("set-cookie");
  const signSource = loginData.data;

  console.log(`地址${address}, 获取到签名源数据：${signSource}`);

  // request 2 获取登录权限
  let tokenParam = {
    account: wallet.address.toLowerCase(),
    login_token: await wallet.signMessage(signSource),
    process: "verify",
    invite_code: use_invite_code,
  };
  headers.cookie = loginDataCookie;
  let loginVerifyRes = await fetch(loginUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(tokenParam),
  });

  const verifyData = await loginVerifyRes.json();
  console.log(`地址${address}, 获取到用户hash：${verifyData.data}`);

  // request 3 获取RPC数据
  const loginVerifyCookie = loginVerifyRes.headers
    .get("set-cookie")
    .replaceAll("Secure,", "");
  headers.cookie = loginVerifyCookie;

  let userRes = await fetch(meUrl, {
    method: "GET",
    headers: headers,
  });
  const userData = await userRes.json();

  const invite_code = JSON.stringify(userData.invite_url).match(
    /code=([a-zA-Z0-9]{4})/
  )[1];

  invite_code_list.push(invite_code);

  console.log(`地址${address}, 获取到RPC数据，正在加入RPC POOL...... `);

  rpcPool[userData.username] = {};
  for (item of userData["chains"]) {
    rpcPool[userData.username][item.name] = item.urls.map((url) => url.value);
  }
  console.log(`地址${address}, RPC数据已加入 RPC_POOL`);
}

(async () => await exportRpc())();
