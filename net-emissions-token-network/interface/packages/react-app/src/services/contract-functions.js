import { Contract } from "@ethersproject/contracts";
import { addresses, abis } from "@project/contracts";

import { AbiCoder } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";

const SUCCESS_MSG = "Success! Transaction has been submitted to the network. Please wait for confirmation on the blockchain.";
const EXTRACT_ERROR_MESSAGE = /(?<="message":")(.*?)(?=")/g;

const PROPOSAL_STATES = [
  "Pending",
  "Active",
  "Canceled",
  "Defeated",
  "Succeeded",
  "Queued",
  "Expired",
  "Executed"
];

/*
 *
 *  helper functions
 *
 */

function catchError(error) {
  console.error(error.message);

  // try to extract error message, otherwise return raw error
  let formatted_error;
    
  if (error.message.startsWith("invalid ENS name")) {
    formatted_error = "Missing or invalid parameter.";
  } else if (error.message.startsWith("invalid BigNumber string")) {
    formatted_error = "Invalid number parameter."
  } else {
    try {
      let errors = JSON.stringify(error).match(EXTRACT_ERROR_MESSAGE);
      formatted_error = errors[errors.length - 1];
    } catch (e) {
      formatted_error = error.message;
    }
  }
  
  return formatted_error;
}

// Helper function to prevent ambiguous failure message when dates aren't passed
function convertToZeroIfBlank(num) {
  return parseInt(num) || 0;
}

function toUnixTime(date) {
  // Return date if not a Date object
  if (Object.prototype.toString.call(date) !== "[object Date]") return date;
  return parseInt((date.getTime() / 1000).toFixed(0));
}

export async function getBlockNumber(w3provider) {
  return w3provider.getBlockNumber();
}

export function encodeParameters(types, values) {
  let abi = new AbiCoder();
  return abi.encode(types, values);
}

/*
 *
 *  NetEmissionsTokenNetwork contract functions
 *
 */

export async function getRoles(w3provider, address) {
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let roles;
  try {
    roles = await contract.getRoles(address);
  } catch (error) {
    roles = error.message;
  }
  return roles;
}

export async function getIssuer(w3provider, tokenId) {
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let issuer;
  try {
    issuer = await contract.getIssuer(tokenId);
  } catch (error) {
    issuer = error.message;
  }
  return issuer;
}

export async function getTokenDetails(w3provider, tokenId) {
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let details;
  try {
    details = await contract.getTokenDetails(tokenId);
  } catch (error) {
    details = error.message;
  }
  return details;
}

export async function getNumOfUniqueTokens(w3provider) {
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let uniqueTokens;
  try {
    uniqueTokens = await contract.getNumOfUniqueTokens();
  } catch (error) {
    uniqueTokens = error.message;
  }
  return uniqueTokens;
}

export async function getAvailableAndRetired(w3provider, address, tokenId) {
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let balances;
  try {
    balances = await contract.getAvailableAndRetired(address, tokenId);
  } catch (error) {
    balances = error.message;
  }
  return balances;
}

export async function getTokenType(w3provider, tokenId) {
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let tokenType;
  try {
    tokenType = await contract.getTokenType(tokenId);
  } catch (error) {
    tokenType = error.message;
  }
  return tokenType;
}

export async function issue(
  w3provider,
  address,
  tokenTypeId,
  quantity,
  fromDate,
  thruDate,
  automaticRetireDate,
  metadata,
  manifest,
  description
) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let signed = await contract.connect(signer);
  let issue_result;
  try {
    await signed.issue(
      address,
      tokenTypeId,
      quantity,
      convertToZeroIfBlank(toUnixTime(fromDate)),
      convertToZeroIfBlank(toUnixTime(thruDate)),
      convertToZeroIfBlank(toUnixTime(automaticRetireDate)),
      metadata,
      manifest,
      description
    );
    issue_result = SUCCESS_MSG;
  } catch (error) {
    issue_result = catchError(error);
  }
  return issue_result;
}

export async function retire(w3provider, tokenId, amount) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let signed = await contract.connect(signer);
  let retire_result;
  try {
    await signed.retire(tokenId, amount);
    retire_result = SUCCESS_MSG;
  } catch (error) {
    retire_result = catchError(error);
  }
  return retire_result;
}

export async function transfer(w3provider, address, tokenId, amount) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let signed = await contract.connect(signer);
  let transfer_result;
  try {
    await signed.transfer(address, tokenId, amount);
    transfer_result = SUCCESS_MSG;
  } catch (error) {
    transfer_result = catchError(error);
  }
  return transfer_result;
}

export async function registerConsumer(w3provider, address) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let signed = await contract.connect(signer);
  let registerConsumer_result;
  try {
    await signed.registerConsumer(address);
    registerConsumer_result = SUCCESS_MSG;
  } catch (error) {
    registerConsumer_result = catchError(error);
  }
  return registerConsumer_result;
}

export async function unregisterConsumer(w3provider, address) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let signed = await contract.connect(signer);
  let unregisterConsumer_result;
  try {
    await signed.unregisterConsumer(address);
    unregisterConsumer_result = SUCCESS_MSG;
  } catch (error) {
    unregisterConsumer_result = catchError(error);
  }
  return unregisterConsumer_result;
}

export async function registerDealer(w3provider, address, tokenTypeId) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let signed = await contract.connect(signer);
  let registerDealer_result;
  try {
    await signed.registerDealer(address, tokenTypeId);
    registerDealer_result = SUCCESS_MSG;
  } catch (error) {
    registerDealer_result = catchError(error);
  }
  return registerDealer_result;
}

export async function unregisterDealer(w3provider, address, tokenTypeId) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.tokenNetwork.address, abis.netEmissionsTokenNetwork.abi, w3provider);
  let signed = await contract.connect(signer);
  let unregisterDealer_result;
  try {
    await signed.unregisterDealer(address, tokenTypeId);
    unregisterDealer_result = SUCCESS_MSG;
  } catch (error) {
    unregisterDealer_result = catchError(error);
  }
  return unregisterDealer_result;
}

/*
 *
 *  DAO token contract functions
 *
 */

export async function daoTokenBalanceOf(w3provider, account) {
  let contract = new Contract(addresses.dao.daoToken.address, abis.daoToken.abi, w3provider);
  let balance;
  try {
    let fetchedBalance = await contract.balanceOf(account);
    let decimals = BigNumber.from("1000000000000000000");
    balance = fetchedBalance.div(decimals).toNumber();
  } catch (error) {
    balance = error.message;
  }
  return balance;
}

/*
 *
 *  Governor contract functions
 *
 */

export async function getProposalCount(w3provider) {
  let contract = new Contract(addresses.dao.governor.address, abis.governor.abi, w3provider);
  let count;
  try {
    count = await contract.proposalCount();
  } catch (error) {
    count = error.message;
  }
  return count;
}

export async function getProposalDetails(w3provider, proposalId) {
  let contract = new Contract(addresses.dao.governor.address, abis.governor.abi, w3provider);
  let proposals;
  try {
    proposals = await contract.proposals(proposalId);
  } catch (error) {
    proposals = error.message;
  }
  return proposals;
}

export async function getProposalState(w3provider, proposalId) {
  let contract = new Contract(addresses.dao.governor.address, abis.governor.abi, w3provider);
  let state;
  try {
    state = await contract.state(proposalId);
  } catch (error) {
    state = error.message;
  }
  return PROPOSAL_STATES[state];
}

export async function propose(w3provider, targets, values, signatures, calldatas, description) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.dao.governor.address, abis.governor.abi, w3provider);
  let signed = await contract.connect(signer);
  let proposal;
  try {
    let proposalCall = await signed.propose(targets, values, signatures, calldatas, description);
    proposal = SUCCESS_MSG;
  } catch (error) {
    proposal = catchError(error);
  }
  return proposal;
}

export async function getReceipt(w3provider, proposalId, voter) {
  let contract = new Contract(addresses.dao.governor.address, abis.governor.abi, w3provider);
  let receipt;
  try {
    receipt = await contract.getReceipt(proposalId, voter);
  } catch (error) {
    receipt = catchError(error);
  }
  return receipt;
}

export async function getActions(w3provider, proposalId) {
  let contract = new Contract(addresses.dao.governor.address, abis.governor.abi, w3provider);
  let actions;
  try {
    actions = await contract.getReceipt(proposalId);
  } catch (error) {
    actions = catchError(error);
  }
  return actions;
}

export async function getDescription(w3provider, proposalId) {
  let contract = new Contract(addresses.dao.governor.address, abis.governor.abi, w3provider);
  let description;
  try {
    description = await contract.getDescription(proposalId);
  } catch (error) {
    description = catchError(error);
  }
  return description;
}

export async function castVote(w3provider, proposalId, support) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.dao.governor.address, abis.governor.abi, w3provider);
  let signed = await contract.connect(signer);
  let castVote;
  try {
    let castVoteCall = await signed.castVote(proposalId, support);
    castVote = SUCCESS_MSG;
  } catch (error) {
    castVote = catchError(error);
  }
  return castVote;
}

export async function queue(w3provider, proposalId) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.dao.governor.address, abis.governor.abi, w3provider);
  let signed = await contract.connect(signer);
  let queue;
  try {
    let queueCall = await signed.queue(proposalId);
    queue = SUCCESS_MSG;
  } catch (error) {
    queue = catchError(error);
  }
  return queue;
}

export async function execute(w3provider, proposalId) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.dao.governor.address, abis.governor.abi, w3provider);
  let signed = await contract.connect(signer);
  let execute;
  try {
    let executeCall = await signed.execute(proposalId);
    execute = SUCCESS_MSG;
  } catch (error) {
    execute = catchError(error);
  }
  return execute;
}

export async function cancel(w3provider, proposalId) {
  let signer = w3provider.getSigner();
  let contract = new Contract(addresses.dao.governor.address, abis.governor.abi, w3provider);
  let signed = await contract.connect(signer);
  let cancel;
  try {
    let cancelCall = await signed.cancel(proposalId);
    cancel = SUCCESS_MSG;
  } catch (error) {
    cancel = catchError(error);
  }
  return cancel;
}
