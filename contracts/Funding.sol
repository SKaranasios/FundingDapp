pragma solidity  >=0.4.22 <0.9.0;





/*so here we want to create a contract who can recieve funds from accounts
and through web 3 get all funders and funder at specific  index 

if we create a address[] memory duplicates will be possible so we will create a mapping(key,value)
*/


contract Funding{
    //creating receive special function in order for our contract be able to accept payments
    //payable modifier
    receive() external payable{}

    //setting unit to index the  _funders
    mapping(address => bool) private funders;
    //creeting _funders to index addresses of funders
    mapping(uint => address) private lutfunders;
    uint public numOfFunders;

    address owner;

    constructor () {
        owner = msg.sender;
   
    }

    modifier limitWithdrawAmount(uint withdrawAmmount){
        require(
            withdrawAmmount <= 1000000000000000000,
            "Cannot withdraw more that 0.1 ether"
        );
        //send error or execute function with modifier is set
        _;
    }

    modifier onlyOwner{
        require(
            msg.sender == owner
            ,"Only owner can call this function"
        );
        _;
    }

    function addFunds() external payable{
        
        //should create a address object for key value which will be msg.sender
        address key =msg.sender;
        //check if key value exists inside mapping  and add it

        if(!funders[key]){
            //index increases after first iteration
            uint index = numOfFunders++;
        
            funders[key]=true;
            lutfunders[index]= key;
        }
    }

    //specify ammount
    function withdraw(uint withdrawAmmount) external   {
 
        require(withdrawAmmount <= 100000000000000000 , "Cannot withdraw mote than 0.1 ether");
        //if we have no funds it should throw error
        //if(withdrawAmmount < 1000000000000000000 )
        payable(msg.sender).transfer(withdrawAmmount);
        
        
    }


    //public to be able to called by other functions withing smart contract
    //view, access storage but not modifying it
    function getAllFunders() public view returns(address[] memory){
        
        //creating address[] to return 
        address[] memory _funders= new address[](numOfFunders);

        
         //iteration for passing mapping key value  to address[]
        for (uint i=0 ; i<numOfFunders ; i++){
            _funders[i]=lutfunders[i];

        }
        //should return address[] but _funders are mapping
        return  _funders;
    }

    function getFundersAtIndex(uint index) external view returns(address){
    //_funders is not accesible/visible outside of function , but  function getallFunders() is public and returns the _funders
    address[] memory _indexfunders = getAllFunders();

    return _indexfunders[index];
    
}

}


//const instance = await Funding.deployed()

//instance.addFunds({from:accounts[0], value:'2000000000000000000'})
//instance.addFunds({from: account[1], value:'1000000000000000000'})

//instance.getAllFunders()
//instance.getFundersAtIndex()

//instance.withdraw('500000000000000000', {from:accounts[1]})