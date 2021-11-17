
module.exports = {
  //changing contracts directory in order to access them in browser
  contracts_build_directory : "./public/contracts",


  networks: {

    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },

  },



  // Configure your compilerss
  compilers: {
    solc: {
      version: "0.8.9",    // Fetch exact version from solc-bin (default: truffle's version)

    }
  },


};
