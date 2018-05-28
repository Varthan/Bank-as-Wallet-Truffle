//   0x35be8516a0dedd62c33f7067defaeb79529a71f4

// contract   0x8a7a2a02021898033f36d85638b056f8ca8f792c


pragma solidity ^0.4.0;
contract ERC20  
{
  function allowance(address owner, address spender) public view returns (uint256);
  function transferFrom(address from, address to, uint256 value) public returns (bool);
  function approve(address spender, uint256 value) public returns (bool);
  event Approval(address indexed owner, address indexed spender, uint256 value);
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}


contract Bank 
{
    
    //Register contract Details
    struct bank_Details
    {
        string name;
        uint bal;
        bool status;
        uint loan_interst;
        uint fixed_deposit_interst;
        // uint account_deposit_interst;
        uint token_count;
        uint borrow_amount;
        uint lend_amount;
        uint fixed_amount_bank;
        uint fixed_amount_user;
    }
    
    mapping(address => bank_Details) public bank_d1;
    address[] public reg_user;
    
    
    //Loan_Details contract Details
    
    uint loan_count;
    uint eth= 0.01 ether;

    struct loan_details
    {
        uint loan_id;
        address lender_address;
        address borrower_address;
        address token_address;
        uint amount;
        uint settle_count;
        uint next_settle_time;
        //uint tokens;
        uint months;
        uint bal_loan;
        uint current_installment;
    }
    
    mapping(uint => loan_details) public loan;
    //mapping (address => mapping(address => mapping(uint256 => loan_details))) public loan;
    
    mapping(address => mapping(uint => uint)) public loan_get_id;
    mapping(address => uint256) public loan_get_count;
    
    mapping(address => mapping(uint => uint)) public loan_pro_id;
    mapping(address => uint256) public loan_pro_count;

    
    //Fixed_Deposit contract Details
    struct Bank_Client
    {
        address bank_address;
        address user_address;
        uint256 amount;
        bool check;
        uint256 end_time;
        uint256 year;
        
    }

    mapping(address => mapping(address => Bank_Client)) public bank_client_Details;

    //Bank can stores the users details
    mapping(address => mapping(uint256 => address)) public bank_owner_clients;
    mapping(address => uint256) public bank_client_count;

    //User can stores the deposited bank details
    mapping(address => mapping(uint256 => address)) public my_acc_details;
    mapping(address => uint256) public my_acc_count;

    
    uint amont;
    uint256 temp_amount;
    uint256 temp_int_amt;
    // uint256 temp_interest;
    //uint256 temp_year;
    

    //Register contract functions
    function register(string name, uint loan_interst, uint fixed_deposit /*, uint acc_dep_int */) public payable
    {
        if(keccak256(bank_d1[msg.sender].name)==keccak256(""))
        {
            bank_d1[msg.sender].name = name;
            bank_d1[msg.sender].loan_interst = loan_interst;
            bank_d1[msg.sender].fixed_deposit_interst = fixed_deposit;
            // bank_d1[msg.sender].account_deposit_interst = acc_dep_int;
        
            if(bank_d1[msg.sender].status == false)
            {
                bank_d1[msg.sender].status = true;
                reg_user.push(msg.sender);
            }
        }
    }

    function deregister() ch_register(msg.sender) public
    {
        require(bank_d1[msg.sender].borrow_amount == 0);
        require(bank_d1[msg.sender].lend_amount == 0);
        require(bank_d1[msg.sender].fixed_amount_bank == 0);
        require(bank_d1[msg.sender].fixed_amount_user == 0);

        msg.sender.transfer(bank_d1[msg.sender].bal);

        bank_d1[msg.sender].name = "";
        bank_d1[msg.sender].loan_interst = 0;
        bank_d1[msg.sender].fixed_deposit_interst = 0;
        // bank_d1[msg.sender].account_deposit_interst = 0;
        bank_d1[msg.sender].bal = 0;
        
    }
  
    function show_registers() public view returns(address[])
    {
        return reg_user;
    }


    //Bank Contract Basic functions
    modifier ch_register(address add)
    {
        require(keccak256(bank_d1[add].name) != keccak256(""));
        _;
    }
   
    function deposit(address addr)  public payable                      //modified
    {
        bank_d1[addr].bal += msg.value;
    }
   
    function withdraw(uint256 amount) public
    {
        bank_d1[msg.sender].bal -= amount;
        msg.sender.transfer(amount);
    }
   
    function transfer(address to,uint256 amount) public ch_register(to)
    {  
        bank_d1[to].bal += amount;
        bank_d1[msg.sender].bal -= amount; //amount transfered to other persion bank address
        //to.transfer(amount);
    }
    
    
    function isRegistered()public constant returns (bool) {
      return keccak256(bank_d1[msg.sender].name) != keccak256("");
    }



    //Loan_Details contract functions
    
    function req_loan(address token_address,address bank_address,uint256 tokens,uint8 year) public ch_register(bank_address) //payable
    {
        //require(bank_address!=msg.sender);
        
        require (bank_d1[bank_address].bal > (eth * tokens) );
        
        ERC20(token_address).transferFrom(msg.sender,bank_address,tokens);
        
        bank_d1[bank_address].bal -= (eth * tokens);
        bank_d1[msg.sender].bal += (eth * tokens);
        //msg.sender.transfer((eth * tokens));
        
        
        bank_d1[msg.sender].borrow_amount += (eth * tokens);
        bank_d1[bank_address].lend_amount += (eth * tokens);

        tok_count(token_address,msg.sender);
        tok_count(token_address,bank_address);

        amont = ( (eth * tokens) * ((bank_d1[bank_address].loan_interst) / 100) ) /100;
        
        loan_get_id[msg.sender][ loan_get_count[msg.sender] ] = loan_count;
        loan_get_count[msg.sender]++;
        loan_pro_id[bank_address][ loan_pro_count[bank_address] ] = loan_count;
        loan_pro_count[bank_address]++;
        
        
        loan[loan_count].loan_id = loan_count;
        loan[loan_count].lender_address = bank_address;
        loan[loan_count].borrower_address = msg.sender;
        loan[loan_count].token_address = token_address;
        loan[loan_count].amount = (eth * tokens);
        loan[loan_count].next_settle_time = now + 2 minutes;//35 days;
        loan[loan_count].months = year*12;
        loan[loan_count].bal_loan = (eth * tokens);
        loan[loan_count].current_installment = amont + (((eth * tokens))/(year*12));
        
        // loan[loan_count].tokens = tokens;
        
        loan_count = loan_count + 1;
    }
    
    function settlement(uint ln_id) public
    {
        // require(loan[ln_id].borrower_address == msg.sender);
        
        // require(loan[ln_id].settle_count <= loan[ln_id].months);
         
        if(loan[ln_id].settle_count < loan[ln_id].months)
        {
            // require( now > (loan[ln_id].next_settle_time - 1 minutes  /* 5 days */)) ;
            
            if( ((loan[ln_id].next_settle_time - 1 minutes  /* 5 days */) <= now) && (now <= loan[ln_id].next_settle_time))
            {
                loan_settle(ln_id,loan[ln_id].current_installment);
            }

            else
            {
                loan_settle(ln_id, (loan[ln_id].current_installment + 0.01 ether) );
            }
        }

        else if(loan[ln_id].settle_count == loan[ln_id].months)
        {
            bank_d1[msg.sender].bal -= loan[ln_id].bal_loan; 
            bank_d1[ loan[ln_id].lender_address ].bal += loan[ln_id].bal_loan;
            
            bank_d1[msg.sender].borrow_amount -= loan[ln_id].bal_loan;
            bank_d1[ loan[ln_id].lender_address ].lend_amount -= loan[ln_id].bal_loan;
            loan[ln_id].bal_loan -= loan[ln_id].bal_loan;
            
            ERC20( loan[ln_id].token_address ).transferFrom( loan[ln_id].lender_address , msg.sender, (loan[ln_id].amount/eth));
            
            tok_count((loan[ln_id].token_address),msg.sender);
            tok_count((loan[ln_id].token_address),(loan[ln_id].lender_address));
            
            loan[ln_id].settle_count += 1;
        }
    }
    
    function loan_settle(uint ln_id, uint value) public
    {
        require( value <= bank_d1[msg.sender].bal);
        
        transfer((loan[ln_id].lender_address),value);
        
        //bank_d1[msg.sender].bal -= value;
        //bank_d1[ loan[ln_id].lender_address ].bal += value;

        bank_d1[msg.sender].borrow_amount -= loan[ln_id].amount / loan[ln_id].months;
        bank_d1[ loan[ln_id].lender_address ].lend_amount -= loan[ln_id].amount / loan[ln_id].months;
        loan[ln_id].bal_loan -= loan[ln_id].amount / loan[ln_id].months;  // reduse one installment
        
        amont = ( (loan[ln_id].bal_loan) * ( (bank_d1[ loan[ln_id].lender_address ].loan_interst) / 100) ) /100;
        loan[ln_id].current_installment = amont + (loan[ln_id].amount / loan[ln_id].months);
                
        loan[ln_id].next_settle_time += 1 minutes;//30 days;
        
        loan[ln_id].settle_count += 1;
    }
    
    
    function tok_count(address token,address ad) public
    {
        bank_d1[ad].token_count = ERC20(token).balanceOf(ad);
    }



    //Fixed_Deposit contract functions
    
    function Fixed_Deposit(address bank_addr, uint256 year) public payable ch_register(bank_addr)
    {
        require( bank_client_Details[bank_addr][msg.sender].check == false );               //controlled in front end
        //require(bank_addr != msg.sender);
        bank_client_Details[bank_addr][msg.sender].bank_address = bank_addr;
        bank_client_Details[bank_addr][msg.sender].user_address = msg.sender;
        bank_owner_clients[bank_addr][ bank_client_count[bank_addr] ] = msg.sender;
        
        my_acc_details[msg.sender][ my_acc_count [msg.sender] ] = bank_addr;
        
        if(bank_client_Details[bank_addr][msg.sender].amount == 0)
        {
            bank_client_count[bank_addr]+=1;
            my_acc_count[msg.sender]+=1;
        }
        
        //bank_d1[bank_addr].bal += msg.value;
        deposit(bank_addr);
        
        bank_d1[bank_addr].fixed_amount_bank += msg.value;
        bank_d1[msg.sender].fixed_amount_user += msg.value;
        
        bank_client_Details[bank_addr][msg.sender].amount = msg.value;
        bank_client_Details[bank_addr][msg.sender].end_time =now + 2 minutes;//now + (year *1 years);
        bank_client_Details[bank_addr][msg.sender].year = year;
        bank_client_Details[bank_addr][msg.sender].check = true;
        
    }
        
    function fixed_amount_get(address bank_addr) public
    {
        // require( bank_client_Details[bank_addr][msg.sender].check == true );                 //controlled in front end
        
        // temp_year = (bank_client_Details[bank_addr][msg.sender].year);
        temp_amount = (bank_client_Details[bank_addr][msg.sender].amount);
        
        if ( now >= (bank_client_Details[bank_addr][msg.sender].end_time) )
        {
            temp_int_amt = temp_amount + ( (temp_amount * (bank_client_Details[bank_addr][msg.sender].year) * ( (bank_d1[bank_addr].fixed_deposit_interst) /100)) / 100 );
            fix_settle(bank_addr,msg.sender,temp_int_amt);
        }
        
        else
        {
            temp_int_amt = temp_amount - (temp_amount / 100) ;
            fix_settle(bank_addr,msg.sender,temp_int_amt);
        }
    }        
    
    function fix_settle(address bank,address user,uint value)public
    {
        require(value <= bank_d1[bank].bal);
            
        bank_d1[bank].bal -= value;
        msg.sender.transfer( value );

        bank_d1[user].fixed_amount_user -= temp_amount;
        bank_d1[bank].fixed_amount_bank -= temp_amount; 
            
        bank_client_Details[bank][user].check = false;
    }
    
    function amount_settlement(address user_address) public
    {
        //require( bank_client_Details[msg.sender][user_address].check == true );          //controlled in front end
        
        //require ( now >= (bank_client_Details[msg.sender][user_address].end_time) );                //controlled in front end
        
        // temp_year = (bank_client_Details[msg.sender][user_address].year);
        temp_amount = (bank_client_Details[msg.sender][user_address].amount);
        // temp_interest = (bank_d1[msg.sender].fixed_deposit_interst);
        
        temp_int_amt = temp_amount + ( (temp_amount * (bank_client_Details[msg.sender][user_address].year) * ((bank_d1[msg.sender].fixed_deposit_interst) / 100)) / 100 );
        
        fix_settle(msg.sender,user_address,temp_int_amt);
    }
    
    function loan_due_pending(uint i, uint time,bool id) public view returns(bool,bool)
    {
        uint temp_id;
        bool temp_bending_count;
        bool temp_exp_count;

        if(id == true)
            temp_id = i;
        else
            temp_id = loan_get_id[msg.sender][i];

        if( time >= (loan[temp_id].next_settle_time - 1 minutes  /* 5 days */))
        {
            if( ((loan[temp_id].next_settle_time - 1 minutes  /* 5 days */) <= time) && (time <= loan[temp_id].next_settle_time))
            {
                // if( ((loan[temp_id].months - loan[temp_id].settle_count) * (loan[temp_id].amount / loan[temp_id].months)) > 0 )
                if(loan[temp_id].bal_loan > 0)
                    temp_bending_count = true;
            }
            else
            {
                // if( ((loan[temp_id].months - loan[temp_id].settle_count) * (loan[temp_id].amount / loan[temp_id].months)) > 0 )
                if(loan[temp_id].bal_loan > 0)
                    temp_exp_count = true;
            }
        }
        return (temp_bending_count,temp_exp_count);
    }
}