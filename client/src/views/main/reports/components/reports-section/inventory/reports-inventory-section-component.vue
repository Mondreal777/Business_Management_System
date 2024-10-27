<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Inventory Reports")
    main
      .content-container
        .menu-container
          .search
            .search-field
              b-field(label="Search Date:")
                b-datetimepicker(size="is-small" placeholder='Select Date...' 
                :max-datetime='maxDateTime')
            b-select(placeholder="Select" v-model='perPage' size="is-small")
              option(value='10') Show 10 Entries
              option(value='15') Show 15 Entries
              option(value='20') Show 20 Entries
        .table
          b-table(
            :data="this.data",
            :per-page="perPage",
            :paginated="isPaginated",
            :pagination-order="paginationOrder",
            :default-sort-direction="defaultSortDirection",
            :sort-icon="sortIcon",
            :sort-icon-size="sortIconSize",
            default-sort="id",
            :range-before="1",
            :range-after="1"
          )
            b-table-column(field="product_no" label="Product No." v-slot="props" centered sortable)
              | {{ props.row.product_no }}
            b-table-column(field="product_name" label="Item Name" v-slot="props" centered sortable)
              | {{ props.row.product_name }}
            b-table-column(field="quantity" label="Stock Quantity" v-slot="props" centered sortable)
              | {{ props.row.quantity }}
            b-table-column(field="threshold" label="Threshold" v-slot="props" centered sortable)
              | {{ props.row.threshold }}
            b-table-column(field="created_date" label="Date and Time" v-slot="props" centered sortable)
              | {{ new Date(props.row.created_date).toLocaleString() }}
            b-table-column(field="action" label="Action" v-slot="props" centered)
              .actionButtons
                .printButton
                  b-button(size="is-small" icon-right="printer" type="is-info" @click="print(props.row.product_id)")
                .downloadButton
                  b-button(size="is-small" icon-right="download" type="is-info" @click="download(props.row.product_id)")
</template>

<script>
import axios from "axios";
import Header from "../../../../../_shared/components/header-component.vue";
import Sidebar from "../../../../../_shared/components/sidebar-component.vue";
import loginMixins from "../../../../../../mixins/login";

export default {
  name: "InventoryReportsSectionComponent",
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
      const max = new Date()
      max.setDate(max.getDate())
      max.setHours(18)
      max.setMinutes(0)
      max.setSeconds(0)
        return {
          perPage: 10,
          data: [],
          isPaginated: true,
          currentPage: 1,
          perPage: 10,
          searchable: true,
          paginationOrder: 'is-centered',
          defaultSortDirection: 'desc',
          sortIcon: 'chevron-up',
          sortIconSize: '',

          //Inventory
          inventoryId: null,
          itemNo: null,
          itemName: null,
          quantity: null,
          threshold: null,
          createdDate: null,
          modifiedDate: null,

          //Date
          maxDateTime: max
        };
    },
    async getInventoryReports() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/inventory-report/list`
      );

      const { inventoryReportList } = res.data.results.data;

      return inventoryReportList;
    },
    //Print
    async print(product_id) {
        try {
          const inventoryInput = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/inventory/` + product_id
          );

          const InventoryData = inventoryInput.data.results.data;
          const inventory = InventoryData.inventoryData;
          
          this.inventoryId = inventory.product_id;
          this.itemNo = inventory.product_no;
          this.itemName = inventory.product_name;
          this.quantity = inventory.quantity;
          this.threshold = inventory.threshold;
          this.createdDate = inventory.stocks_created_date;
          this.modifiedDate = inventory.stocks_modified_date;
          
          this.$store.commit("setInventoryId", this.inventoryId);
          this.$store.commit("setProductId", this.itemNo);
          this.$store.commit("setProductName", this.itemName);
          this.$store.commit("setStockQuantity", this.quantity);
          this.$store.commit("setStockThreshold", this.threshold);
          this.$store.commit("setStockCreatedDate", this.createdDate);
          this.$store.commit("setStockModifiedDate", this.modifiedDate);

          let route = this.$router.resolve({ path: "/inventory-reports-print" });
          window.open(route.href);

          return orderInput;
        } catch (error) {
          console.error(error);
        }
    },
    //Download
    async download(product_id) {
        try {
          const inventoryInput = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/inventory/` + product_id
          );

          const InventoryData = inventoryInput.data.results.data;
          const inventory = InventoryData.inventoryData;
          
          this.inventoryId = inventory.product_id;
          this.itemNo = inventory.product_no;
          this.itemName = inventory.product_name;
          this.quantity = inventory.quantity;
          this.threshold = inventory.threshold;
          this.createdDate = inventory.stocks_created_date;
          this.modifiedDate = inventory.stocks_modified_date;
          
          this.$store.commit("setInventoryId", this.inventoryId);
          this.$store.commit("setProductId", this.itemNo);
          this.$store.commit("setProductName", this.itemName);
          this.$store.commit("setStockQuantity", this.quantity);
          this.$store.commit("setStockThreshold", this.threshold);
          this.$store.commit("setStockCreatedDate", this.createdDate);
          this.$store.commit("setStockModifiedDate", this.modifiedDate);

          let route = this.$router.resolve({ path: "/inventory-reports-download" });
          window.open(route.href);

          

          return orderInput;
        } catch (error) {
          console.error(error);
        }
    },
  },
  async created() {
    try {
      this.checkLogin();
      const inventoryList = await this.getInventoryReports();

      this.data = inventoryList;
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
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

.search-field {
  margin: 0 20px 20px 0;
}

.addButton {
  margin-left: auto;
}

.actionButtons {
  display: flex;
  justify-content: center;
  
}

.actionButtons button {
  color: white;
  margin: 0 1px;
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

// Modal
header.modal-card-head.transaction-items p.modal-card-title {
    display: flex;
    justify-content: center;
    font-weight: 800;
    font-size: 30px;
    align-content: center;
}

section.modal-card-body.total-price {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

</style>
