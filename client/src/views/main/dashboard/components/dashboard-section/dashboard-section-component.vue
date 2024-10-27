<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Dashboard")
    main
      .content-container
        .menu-container
        .notification(v-show="!filterData")
          h1 All inventory are above threshold       
        .table(v-show="filterData")
          b-table(
            :data="filterData",
            :per-page="perPage",
            :paginated="isPaginated",
            :pagination-order="paginationOrder",
            :default-sort-direction="defaultSortDirection",
            :sort-icon="sortIcon",
            :sort-icon-size="sortIconSize",
            default-sort="product_no",
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
            b-table-column(field="action" label="Action" v-slot="props" centered)
              .actionButtons
                .viewButton
                  b-button(size="is-small" icon-right="eye" type="is-info" alt="view" @click="view()")
</template>

<script>
import axios from "axios";
import Header from "../../../../_shared/components/header-component.vue";
import Sidebar from "../../../../_shared/components/sidebar-component.vue";
import loginMixins from "../../../../../mixins/login";

export default {
  name: "DashboardSectionComponent",
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
      return {
        data: [],
        categories: [],
        category: null,
        search: null,
        searchCategory: null,
        isPaginated: true,
        currentPage: 1,
        perPage: 10,
        searchable: true,
        paginationOrder: "is-centered",
        defaultSortDirection: "desc",
        sortIcon: "chevron-up",
        sortIconSize: "",
      };
    },
    async getInventoryReports() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/inventory-report/list`
      );

      const { inventoryReportList } = res.data.results.data;

      return inventoryReportList;
    },
    view() {
      this.$router.push(`/inventory`);
      this.$store.commit('setMenuId', 5);
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
    filterData: function () {
      var data = this.data;
      data = data.filter(function(item) {
          if(item.quantity <= item.threshold){
              return item;
            }
        });
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

.notification {
  display: flex;
  justify-content: center;
}

.notification h1 {
  font-size: 15px;
  font-weight: 500;
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

.editButton button {
  background-color: #ffb44f;
  color: white;
  margin-right: 1px;
}

.deleteButton button {
  background-color: #f05050;
  color: white;
  margin-left: 1px;
}

.editButton button:hover {
  background-color: #dd9b45;
  color: white;
  margin-right: 1px;
}

.deleteButton button:hover {
  background-color: #b63b3b;
  color: white;
  margin-left: 1px;
}

.editButton button:hover {
  background-color: #dd9b45;
  color: white;
  margin-right: 1px;
}

.deleteButton button:hover {
  background-color: #b63b3b;
  color: white;
  margin-left: 1px;
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
</style>
