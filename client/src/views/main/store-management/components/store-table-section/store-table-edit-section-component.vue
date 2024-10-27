<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Store Tables")
    main
      .content-container 
        h1 Edit Table
        b-button(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-product-details
        form(method="post")
          b-field(label="Table Name:")              
            b-input(v-model='currentDetails.tableName' placeholder='Input table name' size='is-small' required)
          b-field(label="Table No:")              
            b-input(v-model='currentDetails.tableNo' placeholder='Input table number' size='is-small' required type="number")
          b-field(label="Capacity:")              
            b-input(v-model='currentDetails.capacity' placeholder='Capacity' size='is-small' required)
          .buttons
            b-button(type="is-link", @click="updated()" :disabled="isSaveBtnDisabled") Save
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
                b-field(label='Successfully updated Table!')
              footer.modal-card-foot
                b-button(label='Okay' type="is-link" @click="navigateBack")
</template>

<script>
import axios from 'axios';
import Header from "../../../../_shared/components/header-component.vue"
import Sidebar from "../../../../_shared/components/sidebar-component.vue"
import loginMixins from "../../../../../mixins/login";
import { STATUS } from '../../../../../constants/status/status';
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
  name: "StoreTableEditSectionComponent",
  components: {
    Header,
    Sidebar
  },
  mixins: [loginMixins, auditTrailMixins],
  data() {
    this.checkLogin();
    return {
      item: [],
      tableDetails: {
        tableId: null,
        tableNo: null,
        tableName: null,
        capacity: 0,
        occupancy: null,
        status: STATUS.ACTIVE
      },
      currentDetails: {
        tableId: null,
        tableNo: null,
        tableName: null,
        capacity: 0,
        occupancy: null,
      },
      isSuccessModalActive: false,
      submitStatus: null
    };
  },

  methods: {
    navigateBack() {
      this.$router.push('/store-management/tables');
    },

    async getTableData() {
      try {
        const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/table/${this.tableDetails.tableId}`);

        const { tableData } = res.data.results.data;
        return tableData[0];
      } catch (err) {
        console.log(err);
      }
    },

    async setTableData() {
      const tableData = await this.getTableData();
      this.tableDetails.tableNo = tableData.table_no;
      this.tableDetails.tableName = tableData.table_name;
      this.tableDetails.capacity = tableData.capacity;
      this.tableDetails.occupancy = tableData.occupancy;

      this.currentDetails.tableNo = tableData.table_no;
      this.currentDetails.tableName = tableData.table_name;
      this.currentDetails.capacity = tableData.capacity;
      this.currentDetails.occupancy = tableData.occupancy;
    },

    async updated() {
      try {
        this.tableDetails.tableNo = this.currentDetails.tableNo;
        this.tableDetails.tableName = this.currentDetails.tableName;
        this.tableDetails.capacity = this.currentDetails.capacity;
        this.tableDetails.occupancy = this.currentDetails.occupancy;

        const res = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/table/save`,
          {
            tableDetails: this.tableDetails
          }
        );
        const status = res.data.results.data.result;

        console.log(status);

        this.setTableData();
        this.$toast.open({
          message: 'Successfully updated Table!',
          type: 'success',
          duration: 5000
          // all of other options may go here
        });

        this.isSuccessModalActive = true
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'Tables', 'Update tables', null, null);
      } catch (err) {
        this.$toast.open({
          message: `Something went wrong! ${err}`,
          type: 'error',
          duration: 5000
        });
        console.log(err);
      }
    }
  },
  async created() {
    try {
      this.tableDetails.tableId = this.$store.getters.getTableId;
      console.log("this.tableDetails.tableId ::> ", this.tableDetails.tableId);
      this.setTableData();
    } catch (err) {

    }
  },
  computed: {
    isSaveBtnDisabled() {
      return (
        this.tableDetails.tableName === this.currentDetails.tableName && this.tableDetails.tableNo === this.currentDetails.tableNo &&
        this.tableDetails.capacity === this.currentDetails.capacity
      )
    },
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