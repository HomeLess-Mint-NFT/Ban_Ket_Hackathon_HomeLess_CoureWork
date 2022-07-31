import { Null } from "@dfinity/candid/lib/cjs/idl";
import { HomeLess_backend } from "../../declarations/HomeLess_backend";
const IPFS_LINK = 'https://dweb.link/ipfs/';
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
  els.submit = document.querySelector("#submit");
  els.output = document.querySelector('#output');
  Object
  .values(els)
  .filter((el) => el.nodeName === 'BUTTON')
  .forEach((el) => el.addEventListener(
      'click',
      onButtonPressHandler
    )
  )
}
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
    case 'submit':
      UpIPFS();
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
  const mint = await minter_backend.mint(idnft);
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
const namee = Null;
const descript = Null;
const image_inputt = Null;
async function create_image()
{
  const image_input = document.querySelector("#image-input");

image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});
   namee = document.getElementById("namee");
  descript = document.getElementById("descript");
  image_inputt = image_input;


}


async function UpIPFS()
{
  outputWrite("Minted NFT success!!!");
  const cid = await client.put(image_inputt);
  const nFile = new File(
    [
      JSON.stringify({
        description: descript,
        name: namee,
        image: `${IPFS_LINK}${cid}/${namee}`,
      }),
    ],
    `${namee}.json`,
    { type: 'text/plain' }
  );
  const metadataCID = await client.put([nFile]);
  const res = await superheroes.mint(Principal.fromText(principal), [
    { tokenUri: `${IPFS_LINK}${metadataCID}/${namee}.json` },
  ]);
  outputWrite("Minted NFT success!!!");
}
function outputWrite(text) {
  els.output.textContent += (els.output.textContent ? `\n` : '') + `> ${text}`;
  els.output.scrollTop = els.output.scrollHeight;
}
document.addEventListener("DOMContentLoaded", main);
