<template lang="pug">
body
  Sidebar(inventoryPurchasing=true)
  .main-container
    Header(title="Purchase Request")
    main
      .content-container 
        h1 Add New Request
        b-button(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-product-details
            form(method="post")
              b-field(label="Request Name:" size='is-small')              
                b-input(v-model='purchaseRequestDetails.requestName' placeholder='Input Request Name' size='is-small' required maxlength='45')
              b-field(label="Request Type:")
                b-select(placeholder="Select Request Type" v-model="purchaseRequestDetails.requestType" size="is-small" required)
                  option(value="")
                  option(value="Request for purchase") Request for purchase
                  option(value="Request for quotation") Request for quotation                 
              b-field(label="Requestor Name:")              
                b-input(v-model='purchaseRequestDetails.requestorName' placeholder='Input Requestor Name' size='is-small' required maxlength='45')
              b-field(label="Request Date:")
                b-datepicker(v-model="date" :first-day-of-week="1" placeholder="Click to select..." size="is-small")
              b-field(label="Description:")              
                b-input(v-model='purchaseRequestDetails.remarks' placeholder='Input Description' size='is-small' required maxlength='45')
              
              .row(v-for="(row, index) in rows")
                .column
                  b-field(label="Item Name:")     
                    b-input(v-model='row.itemName' placeholder='Input Item Name' size='is-small' required maxlength='45')
                .column
                  b-field(label="Quantity:")              
                    b-input(v-model='row.quantity' placeholder='Input Quantity' size='is-small' required type="number" min="1")
                .column
                  b-field(label="Unit of measurement:")              
                    b-input(v-model='row.unitOfMeasurement' placeholder='Input Unit of Measurement' size='is-small' required maxlength='45')
                .column
                  b-field(label="Unit Price:")              
                    b-input(v-model='row.unitPrice' placeholder='Input Unit Price' size='is-small' required type="number" min="1")
                .column
                  b-field(label="")              
                  ion-icon(name='close-circle' type="is-danger" class="close-cirle" v-model="row.hasIcon" @click="removeElement(index)")         
              .row
                .column
                  b-field(label="")              
                .column
                  b-field(label="")              
                .column
                  b-field(label="")              
                .column
                  b-field(label="")
                .column  
                  b-field(label="")              
                  b-button(type="is-link" size="is-small" href="#" icon-right="plus-box-multiple" class="purchase-add-item" @click="addRowItem()") Add Item
              .buttons
                b-button(type="is-link" @click="savePurchaseRequestDetails()", :disabled="isSaveBtnDisabled") Save
                b-button(type="is-danger", @click="navigateBack") Cancel

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
                                b-field(label='Successfully added Request for approval!')
                              footer.modal-card-foot
                                b-button(label='Okay' type="is-link" @click="navigateBack")

</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
<script>
import axios from "axios";
import moment from "moment";
import Header from "../../../../_shared/components/header-component.vue";
import Sidebar from "../../../../_shared/components/sidebar-component.vue";
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
  name: "PurchasingAddComponent",
  components: {
    Header,
    Sidebar,
  },
  mixins: [loginMixins, auditTrailMixins],
  data() {
    this.checkLogin()
    var loginDetails = this.$store.getters.getLoginDetails
    return {
      item: [],
      purchaseRequestDetails: {
        requestName: null,
        requestType: null,
        requestorName: null,
        requestDate: null,
        requestBy: loginDetails["loginUserId"],
        referenceNo: null
      },
      date: null,
      isSuccessModalActive: false,
      submitStatus: null,
      rows: [],
      rowsDisabled
    };
  },
  methods: {
    navigateBack() {
      this.$router.push("/purchasing");
    },
    async clearFields() {
      this.purchaseRequestDetails.requestName = null
      this.purchaseRequestDetails.requestorName = null
      this.purchaseRequestDetails.requestDate = null
      this.date = null
    },
    async savePurchaseRequestDetails() {
      var loginDetails = this.$store.getters.getLoginDetails
      this.saveAuditTrail(loginDetails["loginUserId"], 'Purchase Request', 'Add purchase requests', null, null); 
        
      this.isSuccessModalActive = true;
      try {
        this.purchaseRequestDetails.requestDate = moment(this.date).format('YYYY-MM-DD hh:mm:ss');
        let random = (Math.random() + 1).toString(36).substring(7);
        this.purchaseRequestDetails.referenceNo = 'pr_00' + random;
        const res = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/save-purchase-request`,
          {
            purchaseRequestDetails: this.purchaseRequestDetails,
            purchaseRequestItems: this.rows
          }
        );
        this.clearFields();
      } catch (err) {
        console.log(err);
        this.$toast.open({
            message: 'Something went wrong!',
            type: 'error',
            duration: 5000
        });
        console.log(err);
      }
    },
    addRowItem(){
      this.rows.push({
        hasIcon: true,
        itemName: null,
        quantity: 0,
        unitOfMeasurement: null,
        unitPrice: 0, 
      });  
      console.log(this.rows.length)    
    },
    removeElement: function(index) {
      this.rows.splice(index, 1);
      console.log(this.rows.length)    
    }
  },
  computed: {
    isSaveBtnDisabled() {
      this.rowsDisabled = false;
      if(!this.date || !this.purchaseRequestDetails.requestName || !this.purchaseRequestDetails.requestorName || !this.purchaseRequestDetails.requestType){
        return true;
      } else {
        if(this.rows.length > 0){
          this.rows.forEach((value, index) => {
              if(!value.itemName || !value.quantity || !value.unitOfMeasurement || !value.unitPrice){
                this.rowsDisabled = true;
              }
          });
          return this.rowsDisabled;
        } else {
          return true;
        }
      }
    }
    
  },
  async created() {
    this.rows.push({
      hasIcon: false,
      itemName: null,
      quantity: 0,
      unitOfMeasurement: null,
      unitPrice: 0, 
    });
    
  },
};
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
  width: 1000px;
  margin-left: 0;
  margin-bottom: -20px;
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #D9D9D9;
}

.main-container {
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 100vh;
  overflow-y:auto;
}

.main-container::-webkit-scrollbar {
    display: none;
}

.content-container {
  display: flex;
  flex-grow: 1;
  background-color: white;
  margin: 15px;
  border-radius: 10px;
  overflow: auto;
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
    width: 790px;
}

.field-label.is-normal {
    width: 100vw;
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
  margin-top: -15px;
  color:#F05050;
}
.purchase-add-item{
  margin-left: -60px;
  width: 800px;
  cursor: pointer;
  border: 0px;
}
</style>