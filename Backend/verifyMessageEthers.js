const ethers = require("ethers");

const recoveredAddress = ethers.utils.verifyMessage(
  "Example `personal_sign` message.",
  "0x4bc4adfffc47c9a8d98028b6bf5c0fc3ec72a1bdbf987d11052594f4c24966c95ea513536c7b3cffa27afd00bc89b514166d7e987a3a624df07246256cc495321b"
);
console.log(recoveredAddress);
