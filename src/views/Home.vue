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
     <div class=" w-container">
       <div class="w-row">

       </div>
       <div class="w-row">

         


         <div class="column w-col w-col-6 mt-8 py-8">

            Top Burners  

          <GenericTable />



         </div>
         <div class="column-2 w-col w-col-6  ">
           
             



         </div>
       </div>
     </div>
   </div>


    <div class="section  bg-white border-b-2 border-black ">
     <div class="w-container pt-8">

          
        
         


     </div>
   </div>



    
  <Footer/>

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js' 

 
import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
import TabsBar from './components/TabsBar.vue';

import GenericTable from './components/GenericTable.vue'
  
import StarflaskAPIHelper from '../js/starflask-api-helper.js';


export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer, TabsBar, GenericTable  },
  data() {
    return {
      web3Plug: new Web3Plug() ,
      
     // selectedTab:"burns",
      burnRowsArray:[] 
      

      
    }
  },

  created(){

 
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId

        
          

         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()

         
      this.fetchBurnedAssets(  )

  },
  mounted: function () {
    
   
   
  }, 
  methods: {
          /*setActivePanel(panelId){
              if(panelId == this.activePanelId){
                this.activePanelId = null;
                return 
              }
               this.activePanelId = panelId ;
          },
          onTabSelect(tabname){
            console.log(tabname)

              this.selectedTab = tabname.toLowerCase()


          },*/

          async fetchBurnedAssets(){

            let apiURI = 'https://api.starflask.com/api/v1/testapikey'
            let inputData = {requestType: 'burned_erc20_by_token', input: { publicAddress:'0x810E096DDa9ae3Ae2b55a9c45068F9FE8eeea6db' } } 
            let results = await StarflaskAPIHelper.resolveStarflaskQuery(apiURI ,  inputData   )
            console.log(results)

          },

          clickedBidRowCallback(row){
            console.log('clicked bid row',row )

            this.$router.push({ path: `/bid/${row.signature}` })
          },

          clickedSalesRowCallback(row){
            console.log('clicked sales row',row )


            window.open(this.web3Plug.getExplorerLinkForTxHash(row.txHash, 1  ));
          } 

  }
}
</script>
