import { minter_backend } from "../../declarations/HomeLess_backend";
const mintamount = 0; //Will be changed in the future so user has to pay to mint

const els = {};

function main() {
  els.btnConnect = document.querySelector("#connect");
  els.btnCheckid = document.querySelector("#checkid");
  els.btnBalance = document.querySelector("#balance");


  els.receiverPrincipalId = document.querySelector('#receiver-principal-id');
  els.amount = document.querySelector('#amount');
  els.btnRequestTransfer = document.querySelector('#btn-request-transfer');


  els.file = document.querySelector('#file');
  els.generate = document.querySelector("#generate");

  els.name = document.querySelector('#name');
  els.receiverPrincipalId2 = document.querySelector('#receiver-principal-id2');
  els.send = document.querySelector("#send");


  // els.register = document.querySelector()
  
  els.output = document.querySelector('#output');

  // const button = document.getElementById("connect");

  // const addbutton = document.getElementById("add");

  // const generatebut = document.getElementById("generate");

  // button.addEventListener("click", onButtonPress);
  // addbutton.addEventListener("click", getBalances);
  // generatebut.addEventListener("click", genrateNft);
  Object
    .values(els)
    .filter((el) => el.nodeName === 'BUTTON')
    .forEach((el) => el.addEventListener(
        'click',
        onButtonPressHandler
      )
    )
}
// Button press handler
function onButtonPressHandler(el) {
  const name = el.target.id;

  switch(name) {
    case 'connect':
      onBtnConnect();
      break;
    case 'checkid':
      onBtnCheckid();
      break;
    case 'balance':
      onBtnBalance();
      break;
    case 'generate':
      genrateNft();
      break;
    case 'send':
      sendNft();
      break;
    case 'btn-request-transfer':
      onBtnRequestTransfer();
      break;
    default:
      outputWrite('Button not found!');
  };
}
const canisters = ["ai7t5-aibaq-aaaaa-aaaaa-c"]; //for mainnet deployment
const host = "https://mainnet.dfinity.network"; //for mainnet deployment

let princOfCaller = "";

async function onBtnConnect() {
  // el.target.disabled = true;

  const isConnected = await window.ic.plug.isConnected();

  if(!isConnected) {
    await window.ic?.plug?.requestConnect();
  }

  outputWrite('requesting connection..');

  if (!window.ic.plug.agent) {
    await window.ic.plug.createAgent();
    outputWrite('agent created');
  }
  
  const prin = await window.ic.plug.agent.getPrincipal();
  var principalId = prin.toString();
  princOfCaller = prin;

  if (isConnected) {
    outputWrite('Plug wallet is connected');
  } else {
    outputWrite('Plug wallet connection was refused')
  }

  setTimeout(function () {
    el.target.disabled = false;
  }, 5000);
  // outputWrite('onBtnConnect() call');
  // const response = await window.ic?.plug?.requestConnect();
  
  // outputWrite(`onBtnConnect() call response ${response}`);
}

//check id
async function onBtnCheckid()  {
  const response = await window.ic?.plug?.isConnected();
  const respons = await window.ic.plug.agent.getPrincipal();
  outputWrite(`printId() call response ${respons}`);

}

async function onBtnBalance() {
  // doenst work yet

  // const name = document.getElementById("add").value.toString();
  // const balances = await minter_backend.balanceOf(name);
  
  outputWrite('onBtnRequestBalance() call');
  const response = await window.ic?.plug?.requestBalance();
  outputWrite(`onBtnRequestBalance() call response ${JSON.stringify(response)}`);

}

// On button press request transfer handler
async function onBtnRequestTransfer() {
  outputWrite('onBtnRequestTransfer() call');
  const to = els.receiverPrincipalId?.value;
  const amount = Number(els.amount?.value.replaceAll('_', ''));
  const requestTransferArg = {
    to,
    amount,
  };

  if (!to) {
    outputWrite(`onBtnRequestTransfer() call failure, missing account id!`);
    return;
  };

  const response = await window.ic?.plug?.requestTransfer(requestTransferArg);
  outputWrite(`onBtnRequestTransfer() call response ${JSON.stringify(response)}`);
}

async function genrateNft() {
  const idnft = document.getElementById("file").value.toString();
  const mint = await minter_backend.mint(nft);
  outputWrite("minted...");
  const mintId = mint.toString();
  outputWrite("this id is" + mintId);

  document.getElementById("nft").src = await minter_backend.tokenURI(mint);
  document.getElementById("greeting").innerText = "this nft owner is " + princOfCaller + "\nthis token id is " + mintId;
  
}

async function sendNft() {
  // const name = document.getElementById("name").value.toString();
  // const mint = await minter_backend.mint(name);
  // outputWrite("minted...");
  // const mintId = mint.toString();
  // outputWrite("this id is" + mintId);

  // document.getElementById("nft").src = await minter_backend.tokenURI(mint);
  // document.getElementById("greeting").innerText = "this nft owner is " + princOfCaller + "\nthis token id is " + mintId;
  outputWrite('onBtnsendNft() call');
  const to = els.receiverPrincipalId2?.value;
  const name = Number(els.name?.value.replaceAll('_', ''));
  const requestTransferArg = {
    to,
    name,
  };

  if (!to) {
    outputWrite(`onBtnsendNft() call failure, missing account id!`);
    return;
  };

  const response = await window.ic?.plug?.requestTransfer(requestTransferArg);
  outputWrite(`onBtnRequestTransfer() call response ${JSON.stringify(response)}`);
}



// Write to the output DOM element
function outputWrite(text) {
  els.output.textContent += (els.output.textContent ? `\n` : '') + `> ${text}`;
  els.output.scrollTop = els.output.scrollHeight;
}



document.addEventListener("DOMContentLoaded", main);

  //const name = document.getElementById("name").value.toString();

  //button.setAttribute("disabled", true);

  // Interact with foo actor, calling the greet method
  //const greeting = await minter_backend.greet(name);

  //button.removeAttribute("disabled");
