<template lang="pug">
body
  Sidebar(inventoryPurchasing=true)
  .main-container
    Header(title="Received Purchase Request")
    main
      .content-container 
        h1 Received purchase Request
        b-button(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-product-details
            form(method="post")
              b-field(label="Request Name:" size='is-small') {{purchaseRequestDetails.requestName}}             
              b-field(label="Request Type:") {{purchaseRequestDetails.requestType}}
              b-field(label="Requestor Name:") {{purchaseRequestDetails.requestorName}}
              b-field(label="Description:") {{purchaseRequestDetails.remarks}}
              b-field(label="Status:") {{ purchaseRequestDetails.status }}
              b-field(label="Request Date:") {{new Date(date).toLocaleDateString()}}
              b-field(label="Purchaser Remarks:") {{ purchaseRequestDetails.purchaserRemarks }}
              .row
                .column
                  b-field(label="Item Name" size='is-small')
                .column
                  b-field(label="Quantity" size='is-small')
                .column
                  b-field(label="Unit of Measurement" size='is-small')
                .column
                  b-field(label="Unit Price" size='is-small')
              .row(v-for="(row, index) in rows")
                .column
                  b-field(label="" size='is-small') {{row.item_name}}
                .column
                  b-input(v-model='row.received_quantity', min="1" placeholder='Input Quantity' size='is-small' required type="number")
                .column
                  b-input(v-model='row.received_unit_of_measurement' placeholder='Input Unit Of Measurement' size='is-small' required)
                .column
                  b-input(v-model='row.received_unit_price' placeholder='Input Price' size='is-small' required type="number")
              b-field(label="")
              .buttons
                b-button(type="is-link" @click="updateItemsReceived", :disabled="isSaveBtnDisabled") Save
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
                                b-field(label='Successfully approved request!')
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
  name: "PurchasingEditComponent",
  components: {
    Header,
    Sidebar,
  },
  mixins: [loginMixins, auditTrailMixins],
  data() {
    var loginDetails = this.$store.getters.getLoginDetails
    return {
      item: [],
      date: null,
      updatedDate: null,
      isSuccessModalActive: false,
      isRejectModalActive: false,
      isCheckItemsModalActive: false,
      purchaseRequestDetails: {
        purchaseRequestId: null,
        requestName: null,
        requestType: null,
        requestorName: null,
        requestDate: null,
        remarks: null,
        requestBy: null,
        status: null,
        referenceNo: null,
        reasonForRejection: null,
        receivedQuantity: null,
        receivedUnitOfMeasurement: null,
        receivedUnitPrice: null
      },
      userId: loginDetails["loginUserId"],
      userRoleId: loginDetails["loginUserRoleId"],
      statuses: {
        o: 'Ongoing',
        c: 'Completed',
        a: 'Approved',
        r: 'Rejected',
        p: 'Pending',
        i: 'In Progress'
      },
      reasonForRejection: '',
      rows: [],
      purchaserRemarks: null,
      rowsDisabled: null,
    };
  },
  async created() {
    this.checkLogin()
    this.setPurchaseRequestData();
  },
  computed: {
    isBtnRejectBtnDisabled() {
      return (!this.reasonForRejection);
    },
    isSaveBtnDisabled(){
      this.rowsDisabled = false;
      var result = this.rows.forEach((value, index) => {
          if(!value.received_quantity || value.received_quantity < 0 || !value.received_unit_of_measurement || !value.received_unit_price || value.received_unit_price < 0){
            this.rowsDisabled = true;
          }
          
      });
      return this.rowsDisabled;
      
    },
  },
  methods: {
    async updateItemsReceived(){
      const res = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/purchasing-received-items`,
        {
          items: this.rows,
          purchaseRequestId: this.$store.getters.getReceivingId, 
          referenceNo: this.$store.getters.getReceivingReferenceNo,
        }
      );
      var loginDetails = this.$store.getters.getLoginDetails
      this.saveAuditTrail(loginDetails["loginUserId"], 'Receive', 'Update purchase received', null, null); 
      
      this.isSuccessModalActive = true;
    },
    async setPurchaseRequestData() {
      const purchaseRequestDetails = await this.getItemData();
      this.purchaseRequestDetails.purchaseRequestId = purchaseRequestDetails.purchaseRequestList.purchase_request_id;
      this.purchaseRequestDetails.referenceNo = purchaseRequestDetails.purchaseRequestList.reference_no;
      this.purchaseRequestDetails.requestName = purchaseRequestDetails.purchaseRequestList.request_name;
      this.purchaseRequestDetails.requestBy = purchaseRequestDetails.purchaseRequestList.request_by;
      this.purchaseRequestDetails.status = purchaseRequestDetails.purchaseRequestList.status;
      this.purchaseRequestDetails.requestType = purchaseRequestDetails.purchaseRequestList.request_type;
      this.purchaseRequestDetails.requestorName = purchaseRequestDetails.purchaseRequestList.requestor_name;
      this.purchaseRequestDetails.itemName = purchaseRequestDetails.purchaseRequestList.item_name;
      this.purchaseRequestDetails.quantity = purchaseRequestDetails.purchaseRequestList.quantity;
      this.purchaseRequestDetails.unitOfMeasurement = purchaseRequestDetails.purchaseRequestList.unit_of_measurement;
      this.purchaseRequestDetails.unitPrice = purchaseRequestDetails.purchaseRequestList.unit_price;
      this.purchaseRequestDetails.remarks = purchaseRequestDetails.purchaseRequestList.remarks;
      this.purchaseRequestDetails.reasonForRejection = purchaseRequestDetails.purchaseRequestList.reason_for_rejection;
      this.purchaseRequestDetails.purchaserRemarks = purchaseRequestDetails.purchaseRequestList.purchaser_remarks;
      this.rows = purchaseRequestDetails.purchaseRequestItemsList;
      this.date = new Date(purchaseRequestDetails.purchaseRequestList.request_date);
     
    },
    navigateBack() {
      this.$router.push("/receiving");
    },
    async getItemData() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/get-purchase-request-by-reference-no-and-id/` + this.$store.getters.getReceivingReferenceNo + "/" + this.$store.getters.getReceivingId
      );
      const purchaseRequestDetail = res.data.results.data;
      return purchaseRequestDetail;
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  font-family: "Poppins";
  font-size: 15px;
  min-height: 100vh;
  display: flex;
  background-color: #f5f5f5;
}

.row{
  width: 1000px;
  margin-left: 0;
  margin-bottom: -20px;
}

.column{
  display: flex;
  justify-content: center;
}

.column_two{
  display: flex;
  justify-content: center;
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #d9d9d9;
}

.main-container {
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

.buttons button.is-danger {
  background-color: #f05050;
}

header.modal-card-head p.modal-card-title {
  display: flex;
  justify-content: center;
}

ion-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #68dd62;
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