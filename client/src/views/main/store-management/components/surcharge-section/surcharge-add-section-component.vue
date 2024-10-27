<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Surcharges")
    main
      .content-container 
        h1 Add New Surcharges
        b-button(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-product-details
            form(method="post")
              b-field(label="Name:")              
                b-input(v-model='name' placeholder='Input name' size='is-small' required)
              b-field(label="Amount:")              
                b-input(v-model='amount' placeholder='Input amount' size='is-small' required type="number" min="0")
              b-field(label="Type:") 
                b-radio(v-model='type' name="type" native-value="1") FLAT (PHP)
                b-radio(v-model='type' name="type" native-value="2") PERCENTAGE (%)
              b-field(label="Ordering Type:") 
                b-radio(v-model='ordering_system' name="ordering_system" native-value="Dine In") Dine In
                b-radio(v-model='ordering_system' name="ordering_system" native-value="Take Out") Take Out
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
                                b-field(label='Successfully added new Surcharge!')
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
import auditTrailMixins from "../../../../../mixins/audit-trail";

const itemURL = `http://localhost:3000/discount_and_surcharges/`

export default {
    name: "discountAddSectionComponent",
    components: {
        Header,
        Sidebar
    },
    mixins: [loginMixins, auditTrailMixins],
    data() {
        this.checkLogin()
        return {
          name: null,
          amount: 0,
          type: null,
          ordering_system: null,
          isSuccessModalActive: false,
          submitStatus: null,
        };
    },
    methods: {
        navigateBack() {
            this.$router.push('/store-management/surcharges');
        },
        async created() {
          if (!this.name || !this.amount || !this.type) {
            this.submitStatus = 'NAME_EMPTY'
          } else {
            this.submitStatus = null
            try {
              this.isSuccessModalActive = true

              axios.post(`${process.env.VUE_APP_API_BASE_URL}/surcharges/save-details`, {
                surchargesName: this.name,
                deduction: this.amount,
                deductionTypeId: this.type,
                orderingSystem: this.ordering_system,
                surchargesTypeId: 1,
                createdDate: moment(this.date).format('L')
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
              var loginDetails = this.$store.getters.getLoginDetails
              this.saveAuditTrail(loginDetails["loginUserId"], 'Surcharges', 'Add surcharges', null, null);
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
                                                                      
</style>