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

         


         <div class="  w-col   mt-8 py-8">

           <div> Top Burners </div>

            <div class="my-2 mb-8 bg-teal-500 px-1 border-2 border-black text-white rounded inline-block"> 0xBTC </div>

          <GenericTable 
          v-bind:labelsArray="['from', 'amount']"
          v-bind:rowsArray="burnRowsArray"
          
          />



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
            let inputData = {requestType: 'burned_ERC20_by_token', input: { token:'0xb6ed7644c69416d67b522e20bc294a9a9b405b31' } } 
            let results = await StarflaskAPIHelper.resolveStarflaskQuery(apiURI ,  inputData   )
            console.log('results',results)
            
            let burns = results.output 

            this.burnRowsArray = [] 

            for(let burn of burns){

              this.burnRowsArray.push({from: burn.from,  amount:burn.amount   })
            }



          } 

       

  }
}
</script>
