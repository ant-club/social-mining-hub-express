const ethAddressReg = /^0x[a-fA-F0-9]{40}$/;
function isEthAddress(address) {
  return ethAddressReg.test(address);
}

export {
  isEthAddress,
};
