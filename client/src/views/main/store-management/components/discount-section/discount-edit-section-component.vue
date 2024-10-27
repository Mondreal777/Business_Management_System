<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Discount")
    main
      .content-container 
        h1 Edit Discount
        b-button(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-product-details
        form(method="post")
            b-field(label="Name:")              
              b-input(v-model='name' placeholder='Input name' size='is-small' required)
            b-field(label="Amount:")              
              b-input(v-model='amount' placeholder='Input amount' size='is-small' required type="number" min="0")
            b-field(label="Type:") 
              b-radio(v-model='type' name="type" native-value="1") FLAT (PHP)
              b-radio(v-model='type' name="type" native-value="2" select) PERCENTAGE (%)
            b-field(label="Ordering Type:") 
              b-radio(v-model='ordering_system' name="ordering_system" native-value="1") Dine In
              b-radio(v-model='ordering_system' name="ordering_system" native-value="2") Take Out
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
                                b-field(label='Successfully updated Discount!')
                              footer.modal-card-foot
                                b-button(label='Okay' type="is-link" @click="navigateBack")
</template>

<script>
import axios from 'axios';
import Header from "../../../../_shared/components/header-component.vue"
import Sidebar from "../../../../_shared/components/sidebar-component.vue"
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

const itemURL = `http://localhost:3000/discount_and_surcharges/`

export default {
    name: "discountEditSectionComponent",
    components: {
        Header,
        Sidebar
    },
    mixins: [loginMixins, auditTrailMixins],
    data() {
        this.checkLogin()
        this.getItemData();
        return {
          item: [],
          name: null,
          amount: 0,
          type: null,
          ordering_system: null,
          createdDate: null,
          isSuccessModalActive: false,
          submitStatus: null
        };
    },
    
    methods: {
        navigateBack() {
            this.$router.push('/store-management/discounts');
        },
        
        async getItemData(){
          
          const itemInput = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/discount/` + this.$store.getters.getDiscountAndSurchargesId);
          const item = itemInput.data.results.data.discountData;
          
          this.name = item.discount_name;
          this.amount = item.deduction;
          this.type = item.deduction_type_id;
          this.ordering_system = item.ordering_system;
          this.createdDate = item.createdDate;
          return item;
        },
        async updated() {
          if (!this.name || !this.amount || !this.type) {
            this.submitStatus = 'NAME_EMPTY'
          } else {
            try {
              this.isSuccessModalActive = true   
              this.submitStatus = 'NAME_EMPTY'    
              axios.post(`${process.env.VUE_APP_API_BASE_URL}/discount/save-details`, {
                discountId: this.$store.getters.getDiscountAndSurchargesId,
                discountName: this.name,
                deduction: this.amount,
                deductionTypeId: this.type,
                orderingSystem: this.ordering_system,
                createdDate: this.createdDate
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                alert(error);
                console.log(error);
              });
              var loginDetails = this.$store.getters.getLoginDetails
              this.saveAuditTrail(loginDetails["loginUserId"], 'Discount', 'Update discount', null, null);
            } catch(e) {
              console.error(e);
            }      
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
                                                                      
</style>