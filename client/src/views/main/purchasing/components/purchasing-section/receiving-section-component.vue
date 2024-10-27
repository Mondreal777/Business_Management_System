<template lang="pug">
body
  Sidebar(inventoryReceiving=true)
  .main-container
    Header(title="Receiving")
    main
      .content-container
        .menu-container
          .search
            .search-table
              .search-field
                b-field(label="Search:")
                  b-input(
                    v-model="search",
                    placeholder="Search...",
                    icon="magnify",
                    size="is-small"
                  )
              .search-request
                .search-request-type
                  b-field(label="Request Type:")
                    b-select(placeholder="Select Request Type" v-model="searchRequest" size="is-small")
                      option(value="")
                      option(value="Request for purchase") Request for purchase
                      option(value="Request for quotation") Request for quotation
            b-select(placeholder="Select" v-model='perPage' size="is-small")
              option(value='10') Show 10 Entries
              option(value='15') Show 15 Entries
              option(value='20') Show 20 Entries 
        .table
          b-table(
            :data='filterData' 
            :per-page="perPage" 
            :paginated="isPaginated" 
            :pagination-order="paginationOrder"
            :default-sort-direction="defaultSortDirection"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="id"
            :range-before= '1'
            :range-after='1'
            )
            b-table-column(field="purchase_request_id" label="Request ID" v-slot="props" numeric centered sortable)
              | {{ props.row.purchase_request_id }}
            b-table-column(field="request_name" label="Request Name" v-slot="props" centered sortable)
              | {{ props.row.request_name }}
            b-table-column(field="request_type" label="Request Type" v-slot="props" centered sortable)
              | {{ props.row.request_type }}
            b-table-column(field="requestor_name" label="Requestor Name" v-slot="props" centered sortable)
              | {{ props.row.requestor_name }}
            b-table-column(field="request_date" label="Request Date" v-slot="props" centered sortable)
              | {{ props.row.request_date }}
            b-table-column(field="approver" label="Approver" v-slot="props" centered sortable)
              | {{ props.row.approved_by_username }}
            b-table-column(field="status" label="Status" v-slot="props" centered sortable)
              | {{ props.row.status }}
            b-table-column(field="Description" label="Description" v-slot="props" centered sortable)
              | {{ props.row.remarks }}
            
            b-table-column(field="action" label="Action" width="50" v-slot="props" centered)
              .actionButtons
                .editButton
                  b-button(v-if="props.row.received == 0" size="is-small" icon-right="circle-edit-outline" type="is-warning" alt="Edit" @click="navigateToEditItem(props.row.reference_no, props.row.purchase_request_id)")
                .viewButton
                  b-button(v-if="props.row.received == 1" size="is-small" icon-right="eye" type="is-warning" alt="Edit" @click="navigateToViewItem(props.row.reference_no, props.row.purchase_request_id)")
                .printButton
                  b-button(v-if="props.row.received == 1" size="is-small" icon-right="printer" type="is-danger" v-on:click="navigateToPrintRequest(props.row.reference_no, props.row.purchase_request_id)")
</template>

<script>
import axios from "axios";
import Header from "../../../../_shared/components/header-component.vue";
import Sidebar from "../../../../_shared/components/sidebar-component.vue";
import loginMixins from "../../../../../mixins/login";

export default {
  name: "ReceivingComponent",
  components: {
    Header,
    Sidebar,
  },
  directive: {},
  filters: {},
  mixins: [loginMixins],
  props: {},
  data() {
    return this.initData();
  },
  computed: {},
  watch: {},
  methods: {
    initData() {
      var loginDetails = this.$store.getters.getLoginDetails
      return {
        data: [],
        categories: [],
        category: null,
        search: null,
        searchRequest: null,
        searchStatus: null,
        requestType: null,
        isPaginated: true,
        currentPage: 1,
        perPage: 10,
        searchable: true,
        paginationOrder: "is-centered",
        defaultSortDirection: "desc",
        sortIcon: "chevron-up",
        sortIconSize: "",
        isDeleteModalActive: false,
        confirmDelete: null,
        toBeDeletedId: null,
        userId: loginDetails["loginUserId"],
        userRoleId: loginDetails["loginUserRoleId"],
      };
    },
    navigateToEditItem(referenceNo, id) {
      console.log(id);
      this.$store.commit('setReceivingReferenceNo', referenceNo);
      this.$store.commit('setReceivingId', id);
      this.$router.push("/receiving/edit/");
    },
    navigateToViewItem(referenceNo, id) {
      this.$store.commit('setReceivingReferenceNo', referenceNo);
      this.$store.commit('setReceivingId', id);
      this.$router.push("/receiving/view/");
    },
    navigateToPrintRequest(referenceNo, id) {
      this.$store.commit('setReceivingReferenceNo', referenceNo);
      this.$store.commit('setReceivingId', id);
      window.open("/receiving/print/", '_blank');
    },
    async getPurchaseRequestStatusCompleteList() {
      var loginDetails = this.$store.getters.getLoginDetails
      const res = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/purchase-request-list-complete`,
        {
          userId: loginDetails["loginUserId"],
          userRoleId: loginDetails["loginUserRoleId"]
        }
      );
      const  { purchaseRequestList } = res.data.results.data;
      return purchaseRequestList;
    }
  },
  async created() {
    try {
      this.checkLogin()
      const purchaseReuqestList = await this.getPurchaseRequestStatusCompleteList();

      this.data = purchaseReuqestList;
      console.log(this.data);
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    filterData: function () {
      var data = this.data;
      var search = this.search;
      var searchRequest = this.searchRequest;
      if (!search && !searchRequest) {
        return data;
      } else if (search && searchRequest) {
        data = data.filter(function(item) {
          if(item.request_type.indexOf(searchRequest) !== -1 || item.request_name.indexOf(search) !== -1 && item.request_type.indexOf(searchRequest) !== -1){
            return item;
          }
        });
      return data;
      } else if (search) {
        data = data.filter(function(item) {
          if(item.request_type.indexOf(searchRequest) !== -1 || item.request_name.indexOf(search) !== -1){
            return item;
          }
        });
      return data;
      } else if (searchRequest) {
        data = data.filter(function(item) {
          if(item.request_type.indexOf(searchRequest) !== -1){
            return item;
          }
        });
      return data;
      } else {
        data = data.filter(function(item) {
          if(item.request_type.indexOf(searchRequest) !== -1){
            return item;
          }
        });
      return data;
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
  padding: 15px;
  flex-direction: column;
}

.menu-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}

.search {
  display: flex;
  flex-direction: column;
  margin-right: auto;
}

.search-table, .search-request {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.search-table .search-field, .search-table .search-request-type, .search-table .search-status {
  margin: 0 20px 20px 0;
}

.addButton {
  margin-left: auto;
}

.addButton button {
  background-color: #68dd62;
  border: none;
  font-size: 15px;
  border-radius: 5px;
  color: white;
}

.actionButtons {
  display: flex;
  justify-content: center;
}

.viewButton button {
  background-color: #FFB44F;
  color: white;
  margin-right: 1px;
}

.viewButton button {
  background-color: #F05050;
  color: white;
  margin-left: 15px;
  padding-left: 15px;
}

.viewButton button:hover {
  background-color: #dd9b45;
  color: white;
  margin-left: 15px;
  padding-left: 15px;
}

.viewButton button:hover {
  background-color: #b63b3b;
  color: white;
  margin-left: 15px;
  padding-left: 15px;
}

.viewButton button:hover {
  background-color: #dd9b45;
  color: white;
  margin-left: 15px;
  padding-left: 15px;
}

.viewButton button:hover {
  background-color: #b63b3b;
  color: white;
  margin-left: 15px;
  padding-left: 15px;
}

label,
select,
input,
b-select {
  font-size: 15px;
  display: inline-block;
}

input,
select {
  margin-left: 10px;
  margin-right: 10px;
  height: 25px;
}

.field-label.is-normal {
  margin: 5px 0;
  padding: 0;
}

header.modal-card-head p.modal-card-title {
  display: flex;
  justify-content: center;
}

ion-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f05050;
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

@media only screen and (max-width: 770px) {

    .search-table {
      flex-direction: column;
      max-width: 180px;
    }

}
</style>
