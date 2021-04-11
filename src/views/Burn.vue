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


            


              <div class="text-lg font-bold"> Burn tokens to the Burnbook Record</div>
               

        <div  class=" " v-if="!connectedToWeb3">
              <NotConnectedToWeb3 />
          </div>


         
          <div id="form  " class=" " v-if="connectedToWeb3">
            
            


             <div class="mb-4">
                <label   class="block text-md font-medium font-bold text-gray-800  ">Token To Burn</label>
                

                <div class="flex flex-row">

                <GenericDropdown
                  v-bind:optionList="currencyTokensOptionsList" 
                  v-bind:onSelectCallback="onCurrencySelectCallback"
                />
                  <div class="mb-4 p-4 ml-8" v-if="formInputs.tokenContractAddress">
                    Balance: {{ getSelectedCurrencyBalanceFormatted() }}
                </div>
                </div>


            </div>

            

              
           <div class="mb-4 ">
              <label   class="block text-md font-medium font-bold text-gray-800  ">Bid Amount</label>

              <div class="flex flex-row">
              <div class="w-1/2 px-4">
                    <input type="number"   v-model="formInputs.tokenBidAmountFormatted"  class="text-gray-900 border-2 border-black font-bold px-4 text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full py-4 pl-7 pr-12   border-gray-300 rounded-md" placeholder="0.00">
                </div>

                  <div class="w-1/2 px-4" @click="approveCurrencyToken" v-if=" approveButtonVisible()">
                     <div class="select-none bg-teal-300 p-2 inline-block rounded border-black border-2 cursor-pointer"> Approve </div>
                </div>
              </div>
           
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
 
import GenericDropdown from './components/GenericDropdown.vue'

import NotConnectedToWeb3 from './components/NotConnectedToWeb3.vue'

import BuyTheFloorHelper from '../js/buythefloor-helper.js'



var updateTimer;

export default {
  name: 'Burn',
  props: [],
  components: {Navbar, Footer,NotConnectedToWeb3 , GenericDropdown},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      formInputs: {
        
        tokenContractAddress: null,
        tokenDecimals: 18,

        nftContractAddress: null,
        tokenBidAmountFormatted: 0,
       // expiresAtBlock:0 ,
        expiresInBlocks: 100000,
        
      },

      connectedToWeb3: false,
      currentBlockNumber: 0,

      maxExpiresInBlocks: 250000,
                         
      ApproveAllAmount: "1000000000000000000000000000000",
      tokensApproved:{},
      tokenBalances:{},
      currencyTokensOptionsList:[ ],
      nftOptionsList:[ ],
      submittedBidPacketResponse: null,

      
      bidSubmitComplete: false
    }
  },
  async created  () {



    


   
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
         
        this.connectedToWeb3 = this.web3Plug.connectedToWeb3()
        this.nftTypes = BuyTheFloorHelper.getClientConfigForNetworkId(this.web3Plug.getActiveNetId()).nftTypes


        let chainId = this.activeNetworkId
        if(!chainId) chainId = 1
        let contractData = this.web3Plug.getContractDataForNetworkID(chainId)

      


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

     updateTimer = setInterval(this.updateBalances.bind(this), 5000);


  },
  beforeDestroy(){
    this.web3Plug.clearEventEmitter()
  },
  methods: {
        onCurrencySelectCallback(optionData){
           
          let contractData = this.web3Plug.getContractDataForActiveNetwork()

           console.log('contractData',contractData)

          let tokenContract = contractData[optionData.name]
          
         
          this.formInputs.tokenDecimals = tokenContract.decimals
          this.formInputs.tokenContractAddress = tokenContract.address
          
          this.updateBalances();

          

          //this.restrictBidAmount()

           
        },

         selectedCurrencyIsApproved() {
 
            return (this.tokensApproved[this.formInputs.tokenContractAddress] >= parseInt(this.getTokenBidAmountRaw()))
          },

          approveButtonVisible() {
 
            return (this.tokensApproved[this.formInputs.tokenContractAddress] == 0)
          },

            getTokenBidAmountRaw(){
          return this.web3Plug.formattedAmountToRaw( this.formInputs.tokenBidAmountFormatted, this.formInputs.tokenDecimals ) 
        },


  }
}
</script>
