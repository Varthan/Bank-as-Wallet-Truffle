// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import bank_artifacts from '../../build/contracts/Bank.json'
import token_artifacts from '../../build/contracts/NewToken.json'


// MetaCoin is our usable abstraction, which we'll use through the code below.
var Bank = contract(bank_artifacts);
var Token = contract(token_artifacts);


// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
//  account = web3.eth.accounts[0];
// var accountInterval = setInterval(function() {
//   if (web3.eth.accounts[0] !== account) {
//     account = web3.eth.accounts[0];
//     // your actions
//   }
// }, 100);

window.App = {
  start: function() {
    var self = this;
    

    // Bootstrap the MetaCoin abstraction for Use.
    Bank.setProvider(web3.currentProvider);
    Token.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.basicfunctions();
      self.bank_list();
      self.loan_list();
      self.get_loan_list();
      self.fixed_list();
      self.fixed_loan_list();
      self.bank_d1();
      self.bank_listcopy1();
      self. bank_listcopy2();
      self.dues();
      self.tok();
      self.set_max();
    //  self.token_list();
    //  self.get_token_list();
    });
    this.showBalance();



  $("#deposit-bank").click(function(event) {
    
    
    $('#op1').hide();
    var self = this;

    var deposit_amount = document.getElementById("deposit-amount").value;

    if(deposit_amount >= 0 && deposit_amount == "")//{alert("Enter the Amount");return;}
    {
      $('#op1').show();
      $('#op1').html("Enter Amount.....");return 0;
    }

    document.getElementById("loader").style.display="block";     //$("#loader").html('<center><i class="fa fa-spinner fa-spin" style="font-size:200px;"></center>');
    $("#dep-status").html("Initiating transaction... (please wait)");

    Bank.deployed().then(function(instance) {
      console.log(web3.toWei(deposit_amount, 'ether'));
      return instance.deposit(account, {from: account, value: web3.toWei(deposit_amount, 'ether')});
    }).then(function() {
      $("#dep-status").html("Transaction complete!");
	
      // window.location.reload();
     
      // document.getElementById("menu1").style.display="none";
      // App.showBalance();
      setTimeout(App.start(), 3000);
      document.getElementById("deposit-amount").value = 0;
      $("#dep-status").html("");
      
      // document.getElementById("all_bank").style.display="block";

    }).catch(function(e) {
      console.log(e);
      document.getElementById("loader").style.display="none";
      $("#dep-status").html("Error in transaction; see log.");
    });
    
  });


  $("#withdraw").click(function(event) {

    $("#op2").hide();
    var self = this;

    var withdraw_amount = document.getElementById("withdraw-amount").value;

    if(withdraw_amount == 0)//{alert("Enter the Amount");return;}
    {
      $('#op2').show();
      $('#op2').html("Enter Amount.....");return 0;
    }

    document.getElementById("loader").style.display="block";
    $("#with-status").html("Initiating transaction... (please wait)");

    Bank.deployed().then(function(instance) {
      console.log(web3.toWei(withdraw_amount, 'ether'));
      return instance.withdraw(web3.toWei(withdraw_amount, 'ether'),{from: account });
    }).then(function() {
      $("#with-status").html("Transaction complete!");
      //App.showBalance();
      // window.location.reload();
      setTimeout(App.start(), 3000);;
      document.getElementById("withdraw-amount").value = 0;
      $("#with-status").html("");
      // $('#page').load('#page');
    }).catch(function(e) {
      console.log(e);
      document.getElementById("loader").style.display="none";
      $("#with-status").html("Error in transaction; see log.");
    });
  });

  $("#transfer-amount").click(function(event) {

    $('#op3').hide();
    var self = this;
    var transfer_address = $("#t").val().trim();
    var transfer_amount = document.getElementById("t1").value;

    if(transfer_address == "")
    {
      $('#op3').show();
      $('#op3').html("Enter the Bank Address");
      return;
    }
    
    if(transfer_amount == 0)
    {
      $('#op3').show();
      $('#op3').html("Enter the Amount");
      return;
    }

    document.getElementById("loader").style.display="block";
    $("#trans-status").html("Initiating transaction... (please wait)");

    Bank.deployed().then(function(instance) {
      console.log(transfer_address);
      console.log(web3.toWei(transfer_amount, 'ether'));
      return instance.transfer(transfer_address,web3.toWei(transfer_amount, 'ether'),{from: account});
    }).then(function() {
      $("#status").html("Transaction complete!");
      // App.showBalance();
      // window.location.reload();
      document.getElementById("t").value = "";
      document.getElementById("t1").value=0;
      setTimeout(App.start(), 3000);;
      $("#trans-status").html("");

    }).catch(function(e) {
      console.log(e);
      document.getElementById("loader").style.display="none";
      $("#trans-status").html("Error in transaction; see log.");
    });
  });


  $("#de-register").click(function(event) {

    var self = this;

    document.getElementById("loader").style.display="block";
    $("#dereg-status").html("Initiating transaction... (please wait)");

    Bank.deployed().then(function(instance) {
      return instance.deregister({from: account, gas: 600000});
    }).then(function() {
      $("#dereg-status").html("Transaction complete!");
      //App.showBalance();
      // window.location.reload();
      setTimeout(App.start(), 3000);;
      $("#dereg-status").html("");
    }).catch(function(e) {
      console.log(e);
      document.getElementById("loader").style.display="none";
      $("#dereg-status").html("Error in transaction; see log.");
    });
  });

  $("#token-address").click(function(event) {

    $('#op4').hide();
    var self = this;

    var tokenaddress = document.getElementById("tokenadd").value;

    if(tokenaddress == "")
    {
      $('#op4').show();
      $('#op4').html("Enter the Token Address");
      return;
    }

    document.getElementById("loader").style.display="block";
    $("#tok-status").html("Initiating transaction... (please wait)");
    Bank.deployed().then(function(instance) {
      return instance.tok_count(tokenaddress,account,{from: account});
    }).then(function() {
      $("#tok-status").html("Transaction complete!");
      //App.showBalance();
      setTimeout(App.start(), 3000);;
      $("#tok-status").html("");
    }).catch(function(e) {
      console.log(e);
      document.getElementById("loader").style.display="none";
      $("#tok-status").html("Error in transaction; see log.");
    });
  });


  $(document).ready(function(){
    $("#register-bank").click(function(event){
      // $('#bank_list').load('#bank_list');
      $("#output").hide();
    var self = this;

    // var interest = document.getElementById("interest").value * 100;
    var loan_interest = document.getElementById("loan-interest").value * 100;
    var deposit_interest = document.getElementById("deposit-interest").value * 100;
    var bank_name = document.getElementById("bkname").value;

      if(bank_name=="")
      {
        $('#output').show();
        $('#output').html("Enter the Bank Name");
        return;
      }
      
      if(loan_interest==0)
      {
        $('#output').show();
        $('#output').html("Enter the loan interest");
        return;
      }
      
      if(deposit_interest==0)
      {
        $('#output').show();
        $('#output').html("Enter the deposit interest ");
        return;
      }
      
      // if(interest==0)
      // {
      //   $('#output').show();
      //   $('#output').html("Enter the interest");
      //   return;
      // }
     
    document.getElementById("loader").style.display="block";     //$("#loader").html('<center><i class="fa fa-spinner fa-spin" style="font-size:200px;"></center>');
    $("#status").html("Initiating transaction... (please wait)");
    
    Bank.deployed().then(function(instance) {
      return instance.register(bank_name, loan_interest, deposit_interest, {from: account});
    }).then(function() {
      $("#status").html("Transaction complete!");
      $("#status").html("Transaction complete!");
      //window.location.reload();
      // App.showBalance();
      setTimeout(App.start(), 3000);;
      document.getElementById("bkname").value = "";
      document.getElementById("loan-interest").value = 0;
      document.getElementById("deposit-interest").value = 0;
      }).catch(function(e) {
        console.log(e);
        document.getElementById("loader").style.display="none";
        $("#status").html("Error in transaction; see log.");
  
    });
     
    }); 
   
  });

  },

  tok : function()
  {

    Token.deployed().then(function(instance) {
      return instance.tok_add();
    }).then(function(valu) {
      $("#tokenadd").val(valu)
      $("#tkn-address").val(valu)
      
    }).catch(function(e) {
      console.log(e);
    });

  },


  set_max : function()
  {
    web3.eth.getBalance(account, (err, balance) => {
      balance = web3.fromWei(balance, "ether") + " Ξ"
      $("#balance").val(balance.trim())
      document.getElementById("deposit-amount").max = parseInt(balance.trim());
      document.getElementById("fixed-amount").max = parseInt(balance.trim());
    });

    Bank.deployed().then(function(instance) {
      return instance.bank_d1(account);
    }).then(function(val) {
      document.getElementById("withdraw-amount").max = web3.fromWei(val[1], "ether");
      document.getElementById("t1").max = web3.fromWei(val[1], "ether");
      if((web3.fromWei(val[1], "ether"))<(web3.fromWei(1, "ether")))
      {
        document.getElementById("withdraw-amount").max = 0;
        document.getElementById("t1").max = 0;
      }
    });

  },

  
  set_max_val : function( id )
  {
    if(document.getElementById(id).value > parseInt(document.getElementById(id).max))
      document.getElementById(id).value = (document.getElementById(id).max)-1;
      
    if(document.getElementById(id).value <= parseInt(document.getElementById(id).min) && parseInt(document.getElementById(id).max) != 0)
      document.getElementById(id).value = (document.getElementById(id).min)+1;
      else
      document.getElementById(id).value = (document.getElementById(id).min);
  },


  basicfunctions : function()
  {
    account = web3.eth.accounts[0];
    var accountInterval = setInterval(function()
    {
      if (web3.eth.accounts[0] !== account)
      {
        account = web3.eth.accounts[0];
        window.location.reload();
      }

      App.dues();
      App.set_max();
     

      $("#account").val(account)
      web3.eth.getBalance(account, (err, balance) => {
        balance = web3.fromWei(balance, "ether") + " Ξ"
        $("#balance").val(balance.trim())
      });

    }, 100);
  },

  showBalance: function() {
    var self = this;
    $("#status").html('');

    document.getElementById("all_bank").style.display = "none";
    document.getElementById("reg_bank").style.display = "none";
    // document.getElementById("account_details").style.display = "none";
    // document.getElementById("menu_bar").style.display = "none";
    document.getElementById("loader").style.display = "none";

    var bank;
    
    Bank.deployed().then(function(instance) {
      bank = instance;
      return instance.isRegistered.call({from:account});
    }).then(function(val) {
      if (val == true) {
        
        document.getElementById("all_bank").style.display = "block";
        document.getElementById("account_details").style.display = "block";
        document.getElementById("menu_bar").style.display = "block";
        //$("#reg_bank").html('');
        console.log("Bank has been Registered");
        document.getElementById("link1").href = "#menu1";
        document.getElementById("link2").href = "#menu2";
        document.getElementById("link3").href = "#menu5";
        document.getElementById("link4").href = "#menu4";

        $("#bank-info").html("This bank has registered");
      } else {
        document.getElementById("reg_bank").style.display = "block";
        document.getElementById("account_details").style.display = "none";
        document.getElementById("menu_bar").style.display = "none";
        
        //$("#all_bank").html('');
        console.log("Bank has been not Registered");
        
        $("#bank-info").html("This bank has not registered yet");
      }
    //   return bank.fetchBalance(account);
    // }).then(function(val) {
    //   $("#balance-address").html("This bank's balance is " + web3.fromWei(val, "ether") + " Ξ");
    }).catch(function(e) {
      console.log(e);
    });
  },

  bank_d1 : function(){
    var self = this;

    var bank;
    Bank.deployed().then(function(instance) {
      bank = instance;
      return instance.bank_d1(account);
    }).then(function(val) {
      
      document.getElementById('bankname').value = val[0];
    });
  },

  bank_list : function(){
    var self = this;

    var bank;

    $("#bank_list").html('');
    $("#bank_list").append('<table class="table table-striped"><thead><tr><th>Bank Address</th><th>Bank Name</th><th>Token Count</th><th>Balance</th><th>Borrow Amount</th><th>Lend Amount</th><th>Fixed Amount(Bank)</th><th>Fixed Amount(User)</th><th>Loan Int.</th><th>Fixed Int.</th></tr></thead><tbody id="body_bank"></tbody></table>');
    
    Bank.deployed().then(function(instance) {
      bank = instance;
      return instance.show_registers();
    }).then(function(val) {
      bank.bank_d1(account).then(function(result){
        if(result[0]!="" && result[0]!=" ")
                $("#body_bank").append('<tr><td>'+account+'</td><td>'+result[0]+'</td><td>'+result[5]+'</td><td>'+web3.fromWei(result[1].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[6].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[7].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[8].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[9].toNumber(), "ether")+" Ξ"+'</td><td>'+(result[3]/100)+" %"+'</td><td>'+(result[4]/100)+" %"+'</td></tr>')
      
     })
       $.each(val,function(err,data){
        bank.bank_d1(data).then(function(result){
           if(result[0]!="" && data!=account)
                   $("#body_bank").append('<tr><td>'+data+'</td><td>'+result[0]+'</td><td>'+result[5]+'</td><td>'+web3.fromWei(result[1].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[6].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[7].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[8].toNumber(), "ether")+" Ξ"+'</td><td>'+web3.fromWei(result[9].toNumber(), "ether")+" Ξ"+'</td><td>'+(result[3]/100)+" %"+'</td><td>'+(result[4]/100)+" %"+'</td></tr>')
         
        })
       })
      
    });
  },
  
get_loan : function(){

  $("#op5").hide();

  var token_address = $("#tkn-address").val();
  var token_count  = $("#token-count").val();
  var loan_address = $("#loan-address").val().trim();
  var loan_time = $("#loan-time").val();

  if(token_address=="")
  {
    $("#op5").show();
    $("#op5").html("Enter the Token Address");
    return;
  }

  if(loan_address=="")
  {
    $("#op5").show();
    $("#op5").html("Enter the Bank Address");
    return;
  }

  if(token_count<=0)
  {
    $("#op5").show();
    $("#op5").html("Enter the Token Count");
    return;
  }

  if(loan_time<=0)
  {
    $("#op5").show();
    $("#op5").html("Enter the Loan Duration");
    return;
  }


  if(loan_address==account)
  {
    $("#op5").show();
    $("#op5").html("You are not get loan form your account");
    return;
  }

  document.getElementById("loader").style.display="block";     //$("#loader").html('<center><i class="fa fa-spinner fa-spin" style="font-size:200px;"></center>');
  $("#loan-status").html("Initiating transaction... (please wait)");
  
  var self = this;
  var bank;
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.req_loan(token_address,loan_address, token_count ,loan_time,{from:account});
  }).then(function(val) {
    $("#loan-status").html("Transaction complete!");
    // window.location.reload();
    
    document.getElementById("loan-address").value="";
    document.getElementById("token-count").value=0;
    document.getElementById("loan-time").value=0;
    setTimeout(App.start(), 3000);;
    $("#loan-status").html("");

  }).catch(function(e) {
    console.log(e);
    document.getElementById("loader").style.display="none";
    $("#loan-status").html("Error in transaction; see log.");
  });
},

dues : function()
{
    //$("#loan-status").html("Initiating transaction... (please wait)");
  
    var self = this;
    var bank;

    
    var time = Math.round((new Date()).getTime() / 1000); 

    Bank.deployed().then(function(instance) 
    {
        bank = instance;
        return bank.loan_get_count(account);
    }).then(function(valu) 
        {
          var loan_bending = 0;
          var loan_expire = 0;
            for(var i=0;i<valu.toNumber();i++)
            {
                bank.loan_due_pending(i,time,false,{from:account}).then(function(result)
                {
                  bank_list                 
                    if(result[0]==true)
                        loan_bending+=1;
                                           
                    if(result[1]==true)
                        loan_expire+=1;
                    
                    document.getElementById('lp').value = loan_bending;
                    document.getElementById('de').value = loan_expire;
                 
                });
            }
        })
},

fixed_loan : function(){

  $("#op6").hide();

  var fixed_amount  = $("#fixed-amount").val().trim();
  var fixed_address = $("#fixed-address").val().trim();
  var fixed_time = $("#fixed-time").val().trim();

  if(fixed_address == "")
  {
    $("#op6").show();
    $("#op6").html("Enter the Bank Address");
    return;
  }

  if(fixed_amount <= 0)
  {
    $("#op6").show();
    $("#op6").html("Enter the Amount");
    return;
  }

  if(fixed_time <= 0){
    $("#op6").show();
    $("#op6").html("Enter the Duration");
    return;
  }

  if(fixed_address==account)
  {
    $("#op6").show();
    $("#op6").html("Enter the Another One Bank Address");
    return;
  }

  document.getElementById("loader").style.display="block";
  $("#fix-status").html("Initiating transaction... (please wait)");
  
  var self = this;
  var bank;
  Bank.deployed().then(function(instance) {
    bank = instance;
    
    return bank.Fixed_Deposit(fixed_address,fixed_time,{from:account,value: web3.toWei(fixed_amount, 'ether')});
    console.log(fixed_address);
  }).then(function(val) {
    $("#fix-status").html("Transaction complete!");
    // window.location.reload();
    document.getElementById("fixed-address").value="";
    document.getElementById("fixed-amount").value=0;
    document.getElementById("fixed-time").value=0;
    setTimeout(App.start(), 3000);;
    $("#fix-status").html("");

  }).catch(function(e) {
    console.log(e);
    document.getElementById("loader").style.display="none";
    $("#fix-status").html("Error in transaction; see log.");
  });
},

 //loan request
 bank_listcopy1: function(){
  var self = this;

  var bank;

  $("#bank_listcopy1").html('');
  $("#bank_listcopy1").append('<table class="table table-striped"><thead><tr><th>Bank Address</th><th>Bank Name</th><th>Balance</th><th>Loan Int.</tr></thead><tbody id="body_bank1"></tbody></table>');
  
  Bank.deployed().then(function(instance) {
    bank = instance;
    return instance.show_registers();
  }).then(function(val) {
     $.each(val,function(err,data){
      bank.bank_d1(data).then(function(result){
        if(result[0]!="" && data!=account)
        $("#body_bank1").append('<tr><td>'+data+'</td><td>'+result[0]+'</td><td>'+web3.fromWei(result[1].toNumber(), "ether")+" Ξ"+'</td><td>'+(result[3]/100)+" %"+'</td></tr>')
      })
     })
    
  });
},

//fixed deposite
bank_listcopy2 : function(){
  var self = this;

  var bank;

  $("#bank_listcopy2").html('');
  $("#bank_listcopy2").append('<table class="table table-striped"><thead><tr><th>Bank Address</th><th>Bank Name</th><th>Balance</th><th>Fixed Int.</th></tr></thead><tbody id="body_bank2"></tbody></table>');
  
  Bank.deployed().then(function(instance) {
    bank = instance;
    return instance.show_registers();
  }).then(function(val) {
     $.each(val,function(err,data){
      bank.bank_d1(data).then(function(result){
        if(result[0]!="" && data!=account)
        $("#body_bank2").append('<tr><td>'+data+'</td><td>'+result[0]+'</td><td>'+web3.fromWei(result[1].toNumber(), "ether")+" Ξ"+'</td><td>'+(result[4]/100)+" %"+'</td></tr>')
      })
     })
    
  });
},

fixed_list:function(){
  var self = this;
  var bank;
  $("#fixed_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.bank_client_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++)
      {
        bank.bank_owner_clients(account,i).then(function(valu,err){
          bank.bank_client_Details(account,valu).then(function(data,err){
            var myDate = new Date( (data[4].toNumber()) *1000);
            var a=(myDate.toLocaleString());
            var stus;
            if(data[3])
            {
              stus="Not Settled";
              $("#fixed_list").append('<tr><td>'+data[1]+'</td><td>'+web3.fromWei(data[2].toNumber(), "ether")+ " Ξ"+'</td><td>'+a.split(',')+'</td><td>'+stus+'</td>');
            }
          });
        });
      }
  });
},
/*
loan_list:function(){
  var self = this;
  var bank;
  $("#loan_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.ln_pro_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.ln_pro(account,i).then(function(data,err){
          $("#loan_list").append('<tr><td>'+data[0]+'</td><td>'+web3.fromWei(data[1].toNumber(), "ether")+ " Ξ"+'</td><td>'+data[3]+'</td></tr>');
        });
      }
  });
},*/

loan_list:function(){
  var self = this;
  var bank;
  $("#loan_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.loan_pro_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.loan_pro_id(account,i).then(function(valu,err){
          bank.loan(valu,account).then(function(data,err){
            var myDate = new Date( (data[6].toNumber()) *1000);
            var a=(myDate.toLocaleString());
                  
            if(data[8] != 0)  
            $("#loan_list").append('<tr><td>'+data[0]+'</td><td>'+data[2]+'</td><td>'+data[3]+'</td><td>'+web3.fromWei(data[4].toNumber(), "ether")+ " Ξ"+'</td><td>'+data[5]+'</td><td>'+a.split(',')+'</td><td>'+web3.fromWei(data[8].toNumber(), "ether")+ " Ξ"+'</td><td>'+data[7]+'</td></tr>');
        
          });
        });
      }
  });
},


get_loan_list:function(){
  var self = this;
  var bank;
  $("#get_loan_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.loan_get_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.loan_get_id(account,i).then(function(valu,err){
          bank.loan(valu).then(function(data,err){
            var myDate = new Date( ((data[6].toNumber())-60) *1000);
            var a=(myDate.toLocaleString());

            var amt=0;
            
            var time = Math.round((new Date()).getTime() / 1000); 
            
            if((data[5].toNumber()) != (data[7].toNumber()))
                amt=parseInt(data[9].toNumber());
            
            bank.loan_due_pending(valu,time,true,{from:account}).then(function(result){

              if(result[1]==true)
                amt+=parseInt(web3.toWei(0.01, "ether"));
                
              if(data[8] != 0)                 
                  $("#get_loan_list").append('<tr><td>'+data[0]+'</td><td>'+data[1]+'</td><td>'+web3.fromWei(data[4].toNumber(), "ether")+ " Ξ"+'</td><td>'+data[5]+'</td><td>'+a.split(',')+'</td><td>'+data[7]+'</td><td>'+web3.fromWei(data[8].toNumber(), "ether")+ " Ξ"+'</td><td>'+web3.fromWei(amt, "ether")+ " Ξ"+'</td></tr>');
              
            });
          });
        });
      }
  });
},


fixed_loan_list:function(){
  var self = this;
  var bank;
  $("#fixed_loan_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.my_acc_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.my_acc_details(account,i).then(function(valu,err){
          bank.bank_client_Details(valu,account).then(function(data,err){
            var myDate = new Date( (data[4].toNumber()) *1000);
            var a=(myDate.toLocaleString());
            var stus;
            if(data[3])
            {
              stus="Not Settled"
              $("#fixed_loan_list").append('<tr><td>'+data[0]+'</td><td>'+web3.fromWei(data[2].toNumber(), "ether")+ " Ξ"+'</td><td>'+a.split(',')+'</td><td>'+data[5]+'</td><td>'+stus+'</td>'); 
            }
          });
        });
      }
  });
},

pay_due:function()
{
  $('#op7').hide();

  var id = $("#Loan_id").val();

  if(id < 0 )
  {
    $('#op7').show();
    $('#op7').html("Enter the Correct Loan ID");
    return;
  }

  if(id == "")
  {
    $('#op7').show();
    $('#op7').html("Enter the Loan ID");
    return;
  }


    var self = this;
    var bank;
    Bank.deployed().then(function(instance) {
      bank = instance;

      bank.loan(id).then(function(valu,err)
      {
        if(valu[2] != account)
        {
          $('#op7').show();
          $('#op7').html("Invalid Loan ID");
          return;
        }
          console.log(valu[5].toNumber(),valu[8].toNumber());
        if((valu[5].toNumber()) > (valu[7].toNumber())+1)
        {
          $('#op7').show();
          $('#op7').html("Loan had been already settled");
          return;
        }

        var time = Math.round((new Date()).getTime() / 1000); 
        if((valu[5].toNumber()) != (valu[7].toNumber()))
        if( time < (valu[6]-60) )
        {
          $('#op7').show();
          $('#op7').html("Due time can't come");
          return;
        }
      
        document.getElementById("loader").style.display="block";
        $("#due-status").html("Initiating transaction... (please wait)");
  
        return bank.settlement(id,{from:account, gas:600000}).then(function() {
          $("#due-status").html("Transaction complete!");
          // window.location.reload();
          document.getElementById("Loan_ID").value=0;
          setTimeout(App.start(), 3000);;
          $("#due-status").html("");
      }).catch(function(e) {
        console.log(e);
        document.getElementById("loader").style.display="none";
        $("#due-status").html("Error in transaction; see log.");
      });
    });
  });
},

fix_req:function()
{
  $('#op9').hide();

  var bank_addr = $("#bank-fix-address").val().trim();

  if(bank_addr == "")
  {
    $("#op9").show();
    $('#op9').html("Enter the Bank Address");
    return;
  }

  var self = this;
  var bank;
  
  Bank.deployed().then(function(instance) {
    bank = instance;

    bank.bank_client_Details(bank_addr,account).then(function(data,err)
    {  
      if(data[3] == false)
      {
        $("#op9").show();
        $('#op9').html("You have not deposit to this bank");
        return;
      }

      document.getElementById("loader").style.display="block";
      $("#fix-req-status").html("Initiating transaction... (please wait)");
      
      return bank.fixed_amount_get(bank_addr,{from:account, gas:500000}).then(function() {
        $("#fix-req-status").html("Transaction complete!");
        // window.location.reload();
        document.getElementById("bank-fix-address").value = "";
        setTimeout(App.start(), 3000);;
        $("#fix-req-status").html("");
    
      }).catch(function(e) {
        console.log(e);
        document.getElementById("loader").style.display="none";
        $("#fix-req-status").html("Error in transaction; see log.");
      });
    });
  });
},
/*
get_token : function(){
  var amount  = parseInt($("#token-value").val().trim());
  var bank_address = $("#bank-address").val().trim();
  var token_address = $("#token-address").val().trim();
  var year = parseInt($("#year").val().trim());

  $("#token").html("Initiating transaction... (please wait)");
  
  var self = this;
  var bank;
  Bank.deployed().then(function(instance) {
    bank = instance;
    //return bank.loan_req_token(token_address,bank_address,year, web3.toWei(amount, 'ether'),{from:account,gas: 6000000});
    return bank.loan_req_token(token_address,bank_address,year,amount,{from:account,gas: 6000000});
  }).then(function(val) {
    $("#token").html("Transaction complete!");
  }).catch(function(e) {
    console.log(e);
    $("#token").html("Error in transaction; see log.");
  });
},


token_list:function(){
  var self = this;
  var bank;
  $("#token_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.tk_pro_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.tk_pro(account,i).then(function(data,err){
          $("#token_list").append('<tr><td>'+data[0]+'</td><td>'+web3.fromWei(data[1].toNumber(), "ether")+ " ?"+'</td><td>'+data[3]+'</td></tr>'+data[4]+'</td></tr>');
        });
      }
  });
},


get_token_list:function(){
  var self = this;
  var bank;
  $("#get_token_list").html('')
  Bank.deployed().then(function(instance) {
    bank = instance;
    return bank.tk_get_count(account);
  }).then(function(val) {
      for(var i=0;i<val.toNumber();i++){
        bank.tk_get(account,i).then(function(data,err){
        
          //console.log( a.split(',')[0] );
   $("#get_token_list").append('<tr><td>'+data[10]+'</td><td>'+'</td><td>'+web3.fromWei(data[1].toNumber(), "ether")+ " ?"+'</td><td>'+data[8]+'</td><td>'+'</td></tr>'+data[9]);
        });
      }
  });
},

*/


  fix_set:function()
  {
    $('#op8').hide();

    var user_addr = $("#user-fix-address").val().trim();

    if(user_addr == "")
    {
      $('#op8').show();
      $('#op8').html("Enter the User Bank Address");
      return;
    }

    var time = Math.round((new Date()).getTime() / 1000); 

    var self = this;
    var bank;
    
    
    Bank.deployed().then(function(instance) {
      bank = instance;

      bank.bank_client_Details(account,user_addr).then(function(data,err)
      {  
        if(data[3] == false)
        {
          $("#op8").show();
          $('#op8').html("User have not deposit to Your bank");
          return;
        }
        if(time < data[4])
        {
          $("#op8").show();
          $('#op8').html("User deposited time not expired");
          return;
        }

        document.getElementById("loader").style.display="block";     //$("#loader").html('<center><i class="fa fa-spinner fa-spin" style="font-size:200px;"></center>');
        $("#fix-set-status").html("Initiating transaction... (please wait)");

        return bank.amount_settlement(user_addr,{from:account, gas:500000}).then(function() {
          $("#fix-set-status").html("Transaction complete!");
          // window.location.reload();
          document.getElementById("user-fix-address").value = "";
          setTimeout(App.start(), 3000);
          $("#fix-set-status").html("");
      
        }).catch(function(e) {
          console.log(e);
          document.getElementById("loader").style.display="none";
          $("#fix-set-status").html("Error in transaction; see log.");
        });
      });
    });
  }

};


window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  setTimeout(App.start(), 3000);;
});