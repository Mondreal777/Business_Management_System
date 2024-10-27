<template lang="pug">
body
  .main-container
    Header(title="Purchase Request")
    main
      .content-container 
        h1 Received Purchase Request
        .input-product-details
            form(method="post")
              b-field(label="Request Name:" size='is-small') {{purchaseRequestDetails.requestName}}             
              b-field(label="Request Type:") {{purchaseRequestDetails.requestType}}
              b-field(label="Requestor Name:") {{purchaseRequestDetails.requestorName}}
              b-field(label="Description:") {{purchaseRequestDetails.remarks}}
              b-field(v-if="purchaseRequestDetails.status == statuses.r" label="Reason for Rejection:") {{purchaseRequestDetails.reasonForRejection}}
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
                b-field(label="" size='is-small') {{row.received_quantity}}
              .column
                b-field(label="" size='is-small') {{row.received_unit_of_measurement}}
              .column
                b-field(label="" size='is-small') {{row.received_unit_price}}              
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script>
import axios from "axios";
import Header from "../../../../_shared/components/header-component.vue";
import Sidebar from "../../../../_shared/components/sidebar-component.vue";
import Print from 'vue-print-nb';
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
  name: "ReceivingPrintComponent",
  components: {
    Header,
    Sidebar,
  },
  mixins: [loginMixins, auditTrailMixins],
  directives: {
      Print
  },
  data() {
    this.checkLogin();
    return {
      item: [],
      date: null,
      updatedDate: null,
      printLoading: true,
      isSuccessModalActive: false,
      purchaseRequestDetails: {
        purchaseRequestId: null,
        requestName: null,
        requestType: null,
        requestorName: null,
        requestDate: null,
        remarks: null,
        requestBy: 1,
        status: null,
        referenceNo: null,
      },
      statuses: {
        o: 'Ongoing',
        c: 'Completed',
        a: 'Approved',
        r: 'Rejected',
        p: 'Pending',
        i: 'In Progress'
      },
      rows: []
    };
  },
  async created() {
    this.purchaseRequestId = this.$store.getters.getReceivingId;
    this.setPurchaseRequestData();
  },
  computed: {
  },
  methods: {
    async setPurchaseRequestData() {
      const purchaseRequestDetails = await this.getItemData();
      this.purchaseRequestDetails.purchaseRequestId = purchaseRequestDetails.purchaseRequestList.purchase_request_id;
      this.purchaseRequestDetails.referenceNo = purchaseRequestDetails.purchaseRequestList.reference_no;
      this.purchaseRequestDetails.requestName = purchaseRequestDetails.purchaseRequestList.request_name;
      this.purchaseRequestDetails.requestBy = purchaseRequestDetails.purchaseRequestList.request_by;
      this.purchaseRequestDetails.status = purchaseRequestDetails.purchaseRequestList.status;
      this.purchaseRequestDetails.requestType = purchaseRequestDetails.purchaseRequestList.request_type;
      this.purchaseRequestDetails.requestorName = purchaseRequestDetails.purchaseRequestList.requestor_name;
      this.purchaseRequestDetails.remarks = purchaseRequestDetails.purchaseRequestList.remarks;
      this.rows = purchaseRequestDetails.purchaseRequestItemsList;
      this.date = new Date(purchaseRequestDetails.purchaseRequestList.request_date);
      var loginDetails = this.$store.getters.getLoginDetails
      this.saveAuditTrail(loginDetails["loginUserId"], 'Receive', 'Print received items', null, null); 
      
      window.print();
    },
    navigateBack() {
      this.$router.push("/purchasing");
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
  width: 540px;
}

.field-label.is-normal {
  width: 100%;
}

.buttons {
  display: flex;
  flex-direction: row;
  margin-left: 100px;
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