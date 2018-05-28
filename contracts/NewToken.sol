pragma solidity ^0.4.0;
contract ERC20  {
 
  function allowance(address owner, address spender) public view returns (uint256);
  function transferFrom(address from, address to, uint256 value) public returns (bool);
  function approve(address spender, uint256 value) public returns (bool);
  event Approval(address indexed owner, address indexed spender, uint256 value);
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}
contract NewToken
{
    string standard="Token 1.0";
    string public name;
    string public symbol;
    uint256 public totalsupply;
    uint256  initialallowed;
    uint256 public decimals;
    address public admin;
    address token_address;

    mapping(address=>uint) public balanceOf;
    mapping(address=>mapping(address=>uint256))public allowed;
    function NewToken()public
    {
        token_address = address(this);
        totalsupply = 10000;
        balanceOf[msg.sender] = totalsupply;
        symbol = "TEAM-D";
        name = "newtoken";
        //initialallowed = 500;
        decimals = 0;
    }

    function tok_add() public view returns(address)
    {
        return token_address;
    }

    function transferFrom(address from, address to, uint256 value)public returns(bool) 
    {
        require(to != address(0));
        require(value <= balanceOf[from]);
        //require(value <= allowed[from][msg.sender]);
    
        balanceOf[from]=balanceOf[from]-value;
        balanceOf[to] =balanceOf[to]+value;
        allowed[from][msg.sender] = allowed[from][msg.sender]-(value);
        //Transfer(from,to,value);
        return true;
    }
    
    function allowance(address _owner, address _to) public view returns (uint256) 
    {
        return allowed[_owner][_to];
    }
    function increaseApproval(address _to, uint value) public returns(bool)
    {
        allowed[msg.sender][_to]=allowed[msg.sender][_to]+(value);
        return true;
    }
    function decreaseApproval(address _to, uint value) public returns(bool)
    {
        allowed[msg.sender][_to]=allowed[msg.sender][_to]-(value);
        return true;
    }
    function approve(address spender, uint256 value) public returns (bool)
    {
        allowed[msg.sender][spender]=value;
        return true;
    }
    function transfer(address to, uint256 value) public returns (bool)
    {   
        
        balanceOf[to]=balanceOf[to]+value;
        balanceOf[msg.sender]=balanceOf[msg.sender]-value;
        //require(value<=balanceOf[msg.sender]);
       
        //Transfer(msg.sender,to,value);
        return true;
    }
    function totalSupply() public view returns (uint256)
    {
       return totalsupply;
    }
    function balanceOf(address _addr) public view returns (uint256)
    {
        return balanceOf[_addr];
    }
}