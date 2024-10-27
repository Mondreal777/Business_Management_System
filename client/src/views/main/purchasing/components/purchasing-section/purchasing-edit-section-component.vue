<template lang="pug">
body
  Sidebar(inventoryPurchasing=true)
  .main-container
    Header(title="Purchase Request")
    main
      .content-container 
        h1 Update Request
        b-button(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-product-details
            form(method="post")
              b-field(label="Request Name:" size='is-small') {{purchaseRequestDetails.requestName}}             
              b-field(label="Request Type:") {{purchaseRequestDetails.requestType}}
              b-field(label="Requestor Name:") {{purchaseRequestDetails.requestorName}}
              b-field(label="Description:") {{purchaseRequestDetails.remarks}}
              b-field(v-if="purchaseRequestDetails.status == statuses.r" label="Reason for Rejection:") {{purchaseRequestDetails.reasonForRejection}}
              b-field(label="Status:") {{ purchaseRequestDetails.status }}
              b-field(label="Request Date:") {{new Date(date).toLocaleDateString()}}
              b-field(v-if="userRoleId != 5 && (purchaseRequestDetails.status == statuses.i || purchaseRequestDetails.status == statuses.c)" label="Purchaser Remarks:") {{ purchaseRequestDetails.purchaserRemarks }}
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
                  b-field(label="" size='is-small') {{row.quantity}}
                .column
                  b-field(label="" size='is-small') {{row.unit_of_measurement}}
                .column
                  b-field(label="" size='is-small') {{row.unit_price}}
              b-field(label="")
              b-field(v-if="userRoleId == 5 && purchaseRequestDetails.status == statuses.i" label="Purchaser Remarks:")              
                  b-input(v-if="userRoleId == 5 && purchaseRequestDetails.status == statuses.i" v-model='purchaseRequestDetails.purchaserRemarks' type="textarea" placeholder='Input Purchaser Remarks' required size='is-small')        
              .buttons
                b-button(v-if="userRoleId == 5 && purchaseRequestDetails.status == statuses.i" type="is-link" @click="updatePurchaseRemarks") Save
                b-button(v-if="userRoleId == 5 && (purchaseRequestDetails.status == statuses.a || purchaseRequestDetails.status == statuses.i)" type="is-link" @click="updateStatusPurchaseRequest(statuses.c)") {{ statuses.c }}
                b-button(v-if="userRoleId == 5 && purchaseRequestDetails.status == statuses.a" type="is-link" @click="updateStatusPurchaseRequest(statuses.i)" ) {{ statuses.i }}
                b-button(v-if="(userRoleId == 1 || userRoleId == 2) && purchaseRequestDetails.status == statuses.p" type="is-link" @click="updateStatusPurchaseRequest(statuses.a)" ) {{ statuses.a }}
                b-button(v-if="(userRoleId == 1 || userRoleId == 2) && purchaseRequestDetails.status == statuses.p" type="is-link" @click="isRejectModalActive = true" ) {{ statuses.r }}
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
              b-modal.deleteModal(v-model='isRejectModalActive' 
                            has-modal-card='' trap-focus='' 
                            :destroy-on-hide='false' 
                            aria-role='dialog' 
                            aria-label='Logout' 
                            close-button-aria-label='Close' 
                            aria-modal=''
                            :overlay='false')
                            .modal-card(style='width: auto')
                              header.modal-card-head
                                p.modal-card-title Comment Box
                                button.delete(type='button' @click="isRejectModalActive = false")
                              section.modal-card-body
                                b-field(label="Reason for rejection:")              
                                b-input(v-model='reasonForRejection' type="textarea" placeholder='Input Reason for rejection' required)
                              footer.modal-card-foot
                                b-button(label='Close' type="is-link" @click="isRejectModalActive = false")
                                b-button(label='Submit' type="is-link" @click="updateStatusPurchaseRequest(statuses.r)" :disabled="isBtnRejectBtnDisabled")
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
        reasonForRejection: null
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
      purchaserRemarks: null
    };
  },
  async created() {
    this.checkLogin()
    this.setPurchaseRequestData();
  },
  computed: {
    isBtnRejectBtnDisabled() {
      return (!this.reasonForRejection);
    }
  },
  methods: {
    async updatePurchaseRemarks(){
      const res = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/purchasing-check-items`,
        {
          purchaserRemarks: this.purchaseRequestDetails.purchaserRemarks,
          purchaseRequestId: this.$store.getters.getPurchaseRequestId  
        }
      );
      this.isSuccessModalActive = true;
      this.isCheckItemsModalActive = false;
      var loginDetails = this.$store.getters.getLoginDetails
      this.saveAuditTrail(loginDetails["loginUserId"], 'Purchase Request', 'Update purchaser remarks', null, null); 
      
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
      console.log(this.rows);
      this.date = new Date(purchaseRequestDetails.purchaseRequestList.request_date);
     
    },
    navigateBack() {
      this.$router.push("/purchasing");
    },
    async getItemData() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/get-purchase-request-by-reference-no-and-id/` + this.$store.getters.getPurchaseRequestReferenceNo + "/" + this.$store.getters.getPurchaseRequestId
      );
      const purchaseRequestDetail = res.data.results.data;
      return purchaseRequestDetail;
    },
    async updateStatusPurchaseRequest(status) {
      try {
        if(status != this.statuses.r){
          this.isSuccessModalActive = true;
          this.reasonForRejection = '';
        }
        const res = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/update-status-purchase-request`,
          {
            purchaseRequestDetails: { purchaseRequestId: this.$store.getters.getPurchaseRequestId, referenceNo: this.$store.getters.getPurchaseRequestReferenceNo, status: status, reasonForRejection: this.reasonForRejection},
            userId: this.userId,
            userRoleId: this.userRoleId

          }
        );
        
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'Purchase Request', status + ' purchase requests', null, null); 
      
        if(status == this.statuses.r){
          this.isRejectModalActive = false;
        }
        this.setPurchaseRequestData();
        this.$toast.open({
          message: "Purchase Request successfully updated!",
          type: "success",
          duration: 5000,
          // all of other options may go here
        });
      } catch (err) {
        this.$toast.open({
          message: "Something went wrong!",
          type: "error",
          duration: 5000,
        });
      }
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