<template>

<div>

   <div class="section  bg-white border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>

  

   <div class="section  bg-white border-b-2 border-black">
     <div class="autospacing w-container">
        
       <div class="w-column">
 


              <div class="text-lg font-bold"> Get some toast </div>
               

        <div  class=" " v-if="!connectedToWeb3">
              <NotConnectedToWeb3 />
          </div>


         
          <div id="form  " class=" my-4 " v-if="connectedToWeb3">
            
            
               <div class="mb-4 ">
              <label   class="block text-md font-medium font-bold text-gray-800  "> Scribble Message</label>

              <div class="flex flex-row">
              <div class="w-1/2 px-4">
                    <input type="text"   v-model="formInputs.scribbleMessage"  class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="I love toast">
                </div>

                 
              </div>
           
            </div>
           
        <hr>
          <div class="py-4" v-if=" connectedToWeb3 && !claimSubmitComplete">
             
   
            
                 <div class="  p-4">
                     <div @click="claimToast" class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> 🍞 Claim Toast   </div>
                </div>


          </div>


           <div class="py-4" v-if=" connectedToWeb3 && claimSubmitComplete">

              <div class="py-4"> You've got toast! 🍞</div>
              
           </div>


          </div>

          
       </div>
     </div>
   </div>


    


    
  <Footer/>

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js' 


import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
  
import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'

import BurnbookHelper from '../js/burnbook-helper.js'

var DigitalToastABI = require('../contracts/DigitalToastABI.json')

 

var updateTimer;

export default {
  name: 'ClaimToast',
  props: [],
  components: {Navbar, Footer,NotConnectedToWeb3  },
  data() {
    return {
      web3Plug: new Web3Plug() ,
      formInputs: {
        scribbleMessage: ""
         
        
      },

      connectedToWeb3: false,
      currentBlockNumber: 0,
      claimSubmitComplete:false

       
 
    }
  },
  async created  () {



    


   
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
         
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        this.nftTypes = BurnbookHelper.getClientConfigForNetworkId(this.web3Plug.getActiveNetId()).nftTypes


        let chainId = this.activeNetworkId
        if(!chainId) chainId = 1
        let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

        if(this.connectedToWeb3){
           this.currencyTokensOptionsList= BurnbookHelper.getClientConfigForNetworkId(this.activeNetworkId).currencyTokens 
         
        }


      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
        
      }.bind(this));


    //await this.web3Plug.reconnectWeb()


    let chainId = this.web3Plug.getActiveNetId()
    if(!chainId){
      chainId = 1
    }

    
    let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

      

  }, 
  async mounted(){
     await this.web3Plug.reconnectWeb()

     //updateTimer = setInterval(this.updateBalances.bind(this), 5000);


  },
  beforeDestroy(){
    this.web3Plug.clearEventEmitter()
  },
  methods: {

        async updateBalances(){

          let chainId = this.web3Plug.getActiveNetId()
          
          let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

          let activeAddress = this.web3Plug.getActiveAccountAddress()
          let currencyAddress = this.formInputs.tokenContractAddress

          console.log('contractData',contractData)

          let bbContractAddress = contractData['burnbook'].address

          console.log('currencyAddress',currencyAddress)
          
          this.tokenBalances[currencyAddress] = await this.web3Plug.getTokenBalance(currencyAddress,activeAddress)
          this.tokensApproved[currencyAddress] = await this.web3Plug.getTokenAllowance(currencyAddress,bbContractAddress,activeAddress)

           this.currentBlockNumber = await this.web3Plug.getBlockNumber()
        

          console.log('approve', this.tokensApproved)
          this.$forceUpdate()

        },


        
          async approveCurrencyToken(){
              let contractData = this.web3Plug.getContractDataForActiveNetwork()

              let activeAddress = this.web3Plug.getActiveAccountAddress()
              let currencyAddress = this.formInputs.tokenContractAddress

              let bbContractAddress = contractData['burnbook'].address
              let currencyTokenContract = this.web3Plug.getTokenContract(currencyAddress)
             
             console.log('new approve' , bbContractAddress, this.ApproveAllAmount)
              await currencyTokenContract.methods.approve(bbContractAddress, this.ApproveAllAmount ).send({from:activeAddress})

          },


         selectedCurrencyIsApproved() {
 
            return (this.tokensApproved[this.formInputs.tokenContractAddress] >= parseInt(this.getTokenBidAmountRaw()))
          },

        getSelectedCurrencyBalance(){
          return this.tokenBalances[this.formInputs.tokenContractAddress]
        },
          getSelectedCurrencyBalanceFormatted(){
          return this.web3Plug.rawAmountToFormatted( this.getSelectedCurrencyBalance(), this.formInputs.tokenDecimals ) 
        },

       approveButtonVisible() {
            let chainId = this.web3Plug.getActiveNetId()
            let approveAndCall = false 

            let currencyAddress = this.formInputs.tokenContractAddress
            if(currencyAddress){
              let tokenContractData = BurnbookHelper.getConfigFromContractAddress( currencyAddress , chainId  )
              approveAndCall = tokenContractData.approveAndCall

            }
            
 
            return (!approveAndCall && this.tokensApproved[this.formInputs.tokenContractAddress] == 0)
        },

        getTokenBurnAmountRaw(){
          return this.web3Plug.formattedAmountToRaw( this.formInputs.tokenBidAmountFormatted, this.formInputs.tokenDecimals ) 
        },

        getTokenBurnAmountFormatted(){
          return this.web3Plug.rawAmountToFormatted( this.getTokenBurnAmountRaw(), this.formInputs.tokenDecimals ) 
        },

        async claimToast(){

              let chainId = this.web3Plug.getActiveNetId()

              let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

              let digitaltoastContractAddress = contractData['digitaltoast'].address

             

              let activeAddress = this.web3Plug.getActiveAccountAddress()
              

              let toastContract = this.web3Plug.getCustomContract(DigitalToastABI, digitaltoastContractAddress)
  

              let scribbleMessage = this.formInputs.scribbleMessage

               

                let result =  await toastContract.methods.mint(activeAddress,scribbleMessage).send({from: activeAddress })
                this.claimSubmitComplete = true 
               


        },
        resetForm(){
           this.claimSubmitComplete = false 
        },



  }
}
</script>
