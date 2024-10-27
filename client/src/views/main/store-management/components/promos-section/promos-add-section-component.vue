<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Promos")
    main
      .content-container 
        h1 Add New Promo
        b-button(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-product-details
            form(method="post")
              b-field(horizontal label="Name:")              
                b-input(v-model='name' placeholder='Input name' size='is-small' required)
              b-field(horizontal label="Products:")                       
                b-button(href="#" size="is-small" type="is-success" @click="addRowItem()") Add Products   
              .row(v-for="(row, index) in rows")
                .column
                  b-field(horizontal)              
                    b-select(v-model='row.product' placeholder='Select Products' size='is-small' required)
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
                b-input(v-model='description' placeholder='Input Description' size='is-small' required)
              b-field(horizontal label="Price:")              
                b-input(v-model='price' placeholder='Input Price' size='is-small' required type="number" ref="price" min="0")
              b-field(horizontal label="Order Limit:")              
                b-input(v-model='orderLimit' placeholder='Input Order Limit' size='is-small' type="number" min="1")
              b-field(horizontal label="Start Date:")
                b-datetimepicker(v-model="start_date"  placeholder="Click to select..." size='is-small' range format="yyyy-MM-dd H:i" ref="startdate" id="start_date")
              b-field(horizontal label="End Date:")
                b-datetimepicker(v-model="end_date" placeholder="Click to select..." size='is-small' range format="yyyy-MM-dd H:i" ref="datetimepicker_two")
              .buttons
                  b-button(type="is-link" @click="created()") Save
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
                                b-field(label='Successfully added new Promo!')
                              footer.modal-card-foot
                                b-button(label='Okay' type="is-link" @click="navigateBack")
                

</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
<script>
import axios from 'axios';
import moment from 'moment'
import Header from "../../../../_shared/components/header-component.vue"
import Sidebar from "../../../../_shared/components/sidebar-component.vue"
import loginMixins from "../../../../../mixins/login";
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'
import auditTrailMixins from "../../../../../mixins/audit-trail";

const itemURL = `http://localhost:3000/promos/`
const productsUrl = "http://localhost:3000/products"
export default {
    name: "promosAddSectionComponent",
    components: {
        Header,
        Sidebar,
        VueTimepicker
    },
    mixins: [loginMixins, auditTrailMixins],
    data() {
        this.checkLogin()
        var loginDetails = this.$store.getters.getLoginDetails
        return {
          item: [],
          products: this.getProducts(),
          name: null,
          description: null,
          product: null,
          price: 0,
          duration: null,
          isSuccessModalActive: false,
          submitStatus: null,
          dates:[],
          start_date:null,
          end_date:null,
          pickerVisible: false,
          orderLimit: null,
          time: new Date(),
          rows: [],
          createdBy: loginDetails["loginUserId"],
          config: {
              time: true,
              format: 'yyyy-MM-dd HH:mm:ss'
          },
          showPicker: true,
          responseId: null,
          postData: []
        };
    },
    methods: {
        addRowItem(){
          this.rows.push({
            hasIcon: true,
            product: null
          });     
        },
        removeElement: function(index) {
          this.rows.splice(index, 1);
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
          
          this.rows.push({
            hasIcon: true,
            product: null
          });
          
          return inventoryList;
        },
        async created() {
            
          if (!this.name || !this.description) {
            this.submitStatus = 'NAME_EMPTY'
          } else {
            this.submitStatus = null
            try {
              this.postData = {
                id: null,
                name: this.name,
                description: this.description,
                product: this.product,
                price: this.price,
                orderLimit: this.orderLimit,
                createdBy: this.createdBy,
                duration: moment(this.start_date).format('MM/DD/yyyy hh:mm:ss') + " - " + moment(this.end_date).format('MM/DD/yyyy hh:mm:ss'),
                status: 'A',
                promoProducts: this.rows
              }
              this.isSuccessModalActive = true
              const res = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/save-promos`, this.postData)
              
              var loginDetails = this.$store.getters.getLoginDetails
              this.postData.id = res.data.results.data.result;
              this.saveAuditTrail(loginDetails["loginUserId"], 'Promos', 'Add promos', JSON.stringify(this.postData), null);
            
            } catch(e) {
              console.error(e);
            }
            
            
          }
        }
    
    }
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