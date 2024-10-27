<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Inventory")
    main
      .content-container 
        h1 Edit Promo
        b-button(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-product-details
            form(method="post")
              b-field(horizontal label="Name:")              
                b-input(v-model='promosDetails.name' placeholder='Input name' size='is-small' required)  
              b-field(horizontal label="Products:")                       
                b-button(href="#" size="is-small" type="is-success" @click="addRowItem()") Add Products     
              .row(v-for="(row, index) in promoProducts")
                .column
                  b-field(horizontal)  
                    b-select(v-model='row.product_id' placeholder='Select Products' size='is-small' required)
                      option(value="")                 
                      option(v-for="product in products" :value="product.product_id") {{ product.product_name }}              
                .column
                  b-field(label="")              
                  ion-icon(name='close-circle' type="is-danger" class="close-cirle" v-model="row.hasIcon" @click="removeElement(index)")         
                .column
                  b-field(label="")              
                .column
                  b-field(label="")                
              b-field(horizontal label="Description:")              
                b-input(v-model='promosDetails.description' placeholder='Input Description' size='is-small' required)
              b-field(horizontal label="Price:")              
                b-input(v-model='promosDetails.price' placeholder='Input Price' size='is-small' required type="number" min="0")
              b-field(horizontal label="Order Limit:")              
                b-input(v-model='promosDetails.orderLimit' placeholder='Input Order Limit' size='is-small' type="number" min="1")
              b-field(horizontal label="Start Date:")
                b-datetimepicker(v-model="start_date" placeholder="Click to select..." size='is-small' format="yyyy-MM-dd H:i")
              b-field(horizontal label="End Date:")
                b-datetimepicker(v-model="end_date" placeholder="Click to select..." size='is-small' range format="yyyy-MM-dd H:i" )
              .buttons
                b-button(type="is-link", @click="updated()") Save
                b-button(type="is-danger" @click="navigateBack") Cancel
                
                b-modal.deleteModal(v-model='isSuccessModalActive' 
                                has-modal-card='' trap-focus='' 
                                :destroy-on-hide='false' 
                                aria-role='dialog' 
                                aria-label='Logout' 
                                close-button-aria-label='Close' 
                                aria-modal=''
                                :overlay='false')
                                .modal-card(style='width: auto')
                                  header.modal-card-head
                                    p.modal-card-title Success!
                                    button.delete(type='button' @click="isSuccessModalActive = false")
                                  section.modal-card-body
                                    ion-icon(name='checkmark-circle')
                                    b-field(label='Successfully updated Promo!')
                                  footer.modal-card-foot
                                    b-button(label='Okay' type="is-link" @click="navigateBack")
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
<script>
import axios from 'axios';
import moment from 'moment';
import Header from "../../../../_shared/components/header-component.vue"
import Sidebar from "../../../../_shared/components/sidebar-component.vue"
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
    name: "promosEditSectionComponent",
    components: {
        Header,
        Sidebar
    },
    mixins: [loginMixins, auditTrailMixins],
    data() {
        this.getItemData();
          
        return {

          item: [],
          products: this.getProducts(),
          promosDetails: {
            name: null,
            description: null,
            product: null,
            price: 0,
            duration: null,
            start_date: null,
            end_date: null,
            time: null,
            createdBy: null,
            id: null,
            orderLimit: null,
            status: null,
            timepicker: {
              enableSeconds: true,
              hourFormat : 24
            }
          },
          oldPromosDetails: {
            name: null,
            description: null,
            product: null,
            price: 0,
            duration: null,
            start_date: null,
            end_date: null,
            time: null,
            createdBy: null,
            id: null,
            orderLimit: null,
            status: null,
          },
          isSuccessModalActive: false,
          submitStatus: null,
          dates:[],
          start_date: null,
          end_date: null,
          time: null,
          promoProducts: [],
          rows: [],
          postData: []
        };
    },
    async created() {
      this.checkLogin()
      this.setPromosData();
      this.promoProducts = this.getPromoProducts();
    },
    methods: {
        addRowItem(){
          if(this.promoProducts.length > 0){
            this.promoProducts.push({
              hasIcon: true,
              product_id: null
            });    
          } else {
            this.rows.push({
              hasIcon: true,
              product_id: null
            });  
            this.promoProducts = this.rows;
          }
        },
        removeElement: function(index) {
          this.promoProducts.splice(index, 1);
        },
        async setPromosData() {
            const purchaseRequestDetails = await this.getItemData();
            this.promosDetails.name = purchaseRequestDetails.name;
            this.promosDetails.description = purchaseRequestDetails.description;
            this.promosDetails.product = purchaseRequestDetails.product_id;
            this.promosDetails.price = purchaseRequestDetails.price;
            this.promosDetails.duration = purchaseRequestDetails.duration;
            this.promosDetails.time = purchaseRequestDetails.time;
            this.promosDetails.createdBy = purchaseRequestDetails.created_by;
            this.promosDetails.orderLimit = purchaseRequestDetails.order_limit;
            this.promosDetails.status = purchaseRequestDetails.status;
            this.promosDetails.id = purchaseRequestDetails.id;
            
            
            this.oldPromosDetails.name = purchaseRequestDetails.name;
            this.oldPromosDetails.description = purchaseRequestDetails.description;
            this.oldPromosDetails.product = purchaseRequestDetails.product_id;
            this.oldPromosDetails.price = purchaseRequestDetails.price;
            this.oldPromosDetails.duration = purchaseRequestDetails.duration;
            this.oldPromosDetails.time = purchaseRequestDetails.time;
            this.oldPromosDetails.createdBy = purchaseRequestDetails.created_by;
            this.oldPromosDetails.orderLimit = purchaseRequestDetails.order_limit;
            this.oldPromosDetails.status = purchaseRequestDetails.status;
            this.oldPromosDetails.id = purchaseRequestDetails.id;
            
            var dateData = this.promosDetails.duration.split(" - ");
            this.start_date = new Date(dateData[0]);
            this.end_date = new Date(dateData[1]);
            
        },
        
        async getItemData() {
          const res = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/get-promos-by-id/` + this.$store.getters.getPromosId
          );
          const promosDetail = res.data.results.data;
          return promosDetail.promosList;
        },
        navigateBack() {
            this.$router.push('/store-management/promos');
        },
        async getProducts(){
          const res = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/product/list`
          );
          const  { inventoryList } = res.data.results.data;
          this.products = inventoryList;
          return inventoryList;
        },
        async getPromoProducts(){
          const res = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/promo-products/` + this.$store.getters.getPromosId
          );
          const  promoProductsList = res.data.results.data;
          this.promoProducts = promoProductsList;
          return promoProductsList;
        },
        async updated() {
          try {
            if (!this.promosDetails.name || !this.promosDetails.description) {
            this.submitStatus = 'NAME_EMPTY'
          } else {
              var promosDetails = this.promosDetails;
              this.isSuccessModalActive = true;
              this.postData = {
                promoProducts: this.promoProducts,
                name: this.promosDetails.name,
                description: this.promosDetails.description,
                product: this.promosDetails.product,
                price: this.promosDetails.price,
                duration: moment(this.start_date).format('MM/DD/yyyy hh:mm:ss') + " - " + moment(this.end_date).format('MM/DD/yyyy hh:mm:ss'),
                time: this.time,
                id: this.promosDetails.id,
                orderLimit: this.promosDetails.orderLimit,
                status: this.promosDetails.status,  
              };

              const res = await axios.post(
                `${process.env.VUE_APP_API_BASE_URL}/save-promos`, this.postData);
              this.$toast.open({
                message: "Purchase Request successfully updated!",
                type: "success",
                duration: 5000,
                // all of other options may go here
              });
              var loginDetails = this.$store.getters.getLoginDetails
              this.saveAuditTrail(loginDetails["loginUserId"], 'Promos', 'Update promos', JSON.stringify(this.postData), JSON.stringify(this.oldPromosDetails));
            }
          } catch (err) {
            this.$toast.open({
              message: "Something went wrong!",
              type: "error",
              duration: 5000,
            });
          }
          
        }
    },
  }
</script>

<style lang="scss" scoped>
body {
  font-family: 'Poppins';
  font-size: 15px;
  min-height: 100vh;
  display: flex;
  background-color: #F5F5F5;
}

.row{
  margin-left: 75px;
  margin-bottom: -30px;
  padding-bottom: 20px;
  display: flex; 
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #D9D9D9;
}

.main-container{
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 100vh;
  overflow: auto;
}

.content-container {
  display: flex;
  flex-grow: 1;
  background-color: white;
  margin: 15px;
  border-radius: 10px;
  padding: 15px;
  flex-direction: column;
}

h1 {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
}

.content-container button {
    margin-top: 10px;
    width: 100px;
}

.input-product-details {
    display: flex;
    flex-direction: column;
    margin: 20px auto 20px 20px;
    width: 540px
}

.field-label.is-normal {
    width: 100%;
}

.buttons {
    display: flex;
    flex-direction: row;
}

.buttons button.is-link {
  background-color: #485FC7;
  color: #fff;
}

.buttons button.is-danger {
  background-color: #F05050;
}

header.modal-card-head p.modal-card-title {
  display: flex;
  justify-content: center;
}

ion-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #68DD62;
  font-size: 100px;
}

section.modal-card-body {
  display: flex;
  align-items: center;
  flex-direction: column;
}

header.modal-card-head p.modal-card-title {
  font-weight: 800;
  align-content: center;
}

.close-cirle{
  width: 30px;
  margin-top: -45px;
  color:#F05050;
  margin-left: -20px;
}
.promos-add-item{
  margin-top: 40px;
  margin-left: 0px;
  width: 800px;
  color:#485FC7;
  text-decoration: underline;
  cursor: pointer;
  border: none;
  display: flex;
}

.content-container button.is-small.is-success {
  margin-top: unset;
}
                                                                     
</style>