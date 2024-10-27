<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Sales Reports")
    main
      .content-container
        .menu-container
          .search
            .search-field
              b-field(label="Search Date:")
                b-datetimepicker(v-model="dateTime" size="is-small" placeholder='Select Date...' 
                :max-datetime='maxDateTime')
            b-select(placeholder="Select" v-model='perPage' size="is-small")
              option(value='10') Show 10 Entries
              option(value='15') Show 15 Entries
              option(value='20') Show 20 Entries 
        .table
          b-table(
            :data="filterData",
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
            b-table-column(field="receipt_number" label="ID" v-slot="props" numeric centered sortable width="40")
              | {{ props.row.receipt_number }}
            b-table-column(field="table_no" label="Table Name" v-slot="props" centered sortable)
              | {{ props.row.table_no }}
            b-table-column(field="date_time" label="Date & Time" v-slot="props" centered sortable)
              | {{ new Date(props.row.created_date).toLocaleString() }}
            b-table-column(field="item_quantity" label="Item Quantity" v-slot="props" centered sortable)
              | {{ props.row.item_quantity }}
            b-table-column(field="items_price" label="Items Price" v-slot="props" centered sortable)
              | {{ props.row.items_price }}
            b-table-column(field="discount" label="Discount" v-slot="props" centered sortable)
              | {{ props.row.discount_value }}
            b-table-column(field="total_price" label="Total Amount" v-slot="props" centered sortable)
              | {{ props.row.total_price }}
            b-table-column(field="order_type" label="Type of Order" v-slot="props" centered sortable)
              | {{ props.row.order_type }}
            b-table-column(field="payment_method" label="Type of Payment" v-slot="props" centered sortable)
              | {{ props.row.payment_method }}
            b-table-column(field="action" label="Action" v-slot="props" centered)
              .actionButtons
                .viewButton
                  b-button(size="is-small" icon-right="eye" type="is-info" alt="view" @click="view(props.row.transaction_id)")
                .downloadButton
                  b-button(size="is-small" icon-right="download" type="is-info" @click="download(props.row.transaction_id)")
                .printButton
                  b-button(size="is-small" icon-right="printer" type="is-info" @click="print(props.row.transaction_id)")
  
  b-modal(
    v-model="isViewModalActive",
    has-modal-card="",
    trap-focus="",
    :destroy-on-hide="false",
    aria-role="dialog",
    aria-label="Table",
    close-button-aria-label="Close",
    aria-modal=""
    )
      .modal-card(:width="300")
        header.modal-card-head.transaction-items
          p.modal-card-title Transaction {{ this.transactionID }}
          button.delete(type="button" @click="isViewModalActive = false")
        section.modal-card-body.details
          b-field(:label="`Order Type: ` + this.orderType")
          b-field(label="Items:")
          .table
            b-table(:data="this.items" :range-before="1" :range-after="1")
              b-table-column(field="id" label="ID" width="40" v-slot="props" numeric centered)
                | {{ props.row.product_id }}
              b-table-column(field="product_name" label="Description" v-slot="props" centered)
                | {{ props.row.product_name }}
              b-table-column(field="quantity" label="QTY" v-slot="props" centered)
                | {{ props.row.quantity }}
              b-table-column(field="unit_price" label="Price" v-slot="props" centered)
                | {{ props.row.unit_price }}   
          b-field(:label="`Items Price: ` + this.itemsPrice")
          b-field(:label="`Discount: ` + this.discountValue")
          b-field(:label="`Surcharge: ` + this.surcharge")
          .discount-details(v-show="this.discountCardNumber")
            b-field(:label="`Remarks: ` + this.discountRemarks")
            b-field(:label="`Discount Type: ` + `Senior`")
            b-field(:label="`Card Number: ` + this.cardDiscountNumber")
            b-field(:label="`Discount Value: ` + 20")
            b-field(label="Card Details:")
                b-image(src="https://buefy.org/static/img/placeholder-1280x960.png"
                ratio="2by1")
            b-button.is-info(size="is-small" label="View Image" @click="isDiscountImageModalActive = true")
        section.modal-card-body.total-price
          b-field(:label="`Total Amount: Php ` + this.totalAmount")
</template>

<script>
import axios from "axios";
import Header from "../../../../../_shared/components/header-component.vue";
import Sidebar from "../../../../../_shared/components/sidebar-component.vue";
import loginMixins from "../../../../../../mixins/login";

export default {
  name: "TransactionReportsSectionComponent",
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
          minDatetime: new Date(),
          maxDateTime: new Date(),
          dateTime: null,

          items: [],
          transactionID: null,
          orderType: null,
          
          //Discount
          discountValue: null,
          discountCardNumber: null,
          discountDiscountType: null,
          cardDiscountNumber: null,
          cardDiscountImage: null,
          selectedDiscountType: null,
          discountType: null,
          discountRemarks: null,

          surcharge: null,
          itemsPrice: null,
          totalAmount: null,

          isViewModalActive: false,

          //Date
          maxDatetime: max
        };
    },
    async getSalesReports() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/sales-report/list?status=DONE`
      );
      
      const { salesList } = res.data.results.data;
      return salesList;
    },
    async view(transaction_id) {
      try {
        const orderInput = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/order-item/list/` + transaction_id
        );

        const transactionData = orderInput.data.results.data;
        const transaction = transactionData.orderItemsListData;
        this.transactionID = transaction[0].transaction_id;
        this.orderType = transaction[0].order_type;
        this.items = transaction;
        this.discountValue = transaction[0].discount_value;
        this.surcharge = transaction[0].service_charge;
        this.itemsPrice = transaction[0].items_price;
        this.totalAmount = transaction[0].total_price;

        if (transaction[0].service_charge === null) {
            this.surcharge = 0;
        } else {
            this.surcharge = transaction[0].service_charge;
        }

        if (transaction[0].discount_value === null) {
            this.discountValue = 0;
        } else {
            this.discountValue = transaction[0].discount_value;
        }

        if (transaction[0].service_charge === null) {
            this.surcharge = 0;
        } else {
            this.surcharge = transaction[0].service_charge;
        }

        if (transaction[0].discount_value === null) {
            this.discountValue = 0;
        } else {
            this.discountValue = transaction[0].discount_value;
        }

        console.log(orderInput);

        this.isViewModalActive = true;


        return orderInput;
      } catch (error) {
        console.error(error);
      }
    },
    //Print
    async print(transaction_id) {
        try {
          const orderInput = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/order-item/list/` + transaction_id
          );

          const transactionData = orderInput.data.results.data;
          const transaction = transactionData.orderItemsListData;
          this.transactionID = transaction[0].transaction_id;
          this.orderType = transaction[0].order_type;
          this.items = transaction;
          this.discountValue = transaction[0].discount_value;
          this.surcharge = transaction[0].service_charge;
          this.itemsPrice = transaction[0].items_price;
          this.totalAmount = transaction[0].total_price;

          if (transaction[0].service_charge === null) {
            this.surcharge = 0;
          } else {
              this.surcharge = transaction[0].service_charge;
          }

          if (transaction[0].discount_value === null) {
              this.discountValue = 0;
          } else {
              this.discountValue = transaction[0].discount_value;
          }

          this.$store.commit("setReceiptNo", this.transactionID);
          this.$store.commit("setItems", this.items);
          this.$store.commit("setDiscount", this.discountValue);
          this.$store.commit("setSurcharge", this.surcharge);
          this.$store.commit("setTotalPrice", this.totalAmount);
          this.$store.commit("setOrderType", this.orderType);

          let route = this.$router.resolve({ path: "/sales-reports-print" });
          window.open(route.href);

          return orderInput;
        } catch (error) {
          console.error(error);
        }
    },
    //Download
    async download(transaction_id) {
        try {
          const orderInput = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/order-item/list/` + transaction_id
          );

          const transactionData = orderInput.data.results.data;
          const transaction = transactionData.orderItemsListData;
          this.transactionID = transaction[0].transaction_id;
          this.orderType = transaction[0].order_type;
          this.items = transaction;
          this.discountValue = transaction[0].discount_value;
          this.surcharge = transaction[0].service_charge;
          this.itemsPrice = transaction[0].items_price;
          this.totalAmount = transaction[0].total_price;

          if (transaction[0].service_charge === null) {
              this.surcharge = 0;
          } else {
              this.surcharge = transaction[0].service_charge;
          }

          if (transaction[0].discount_value === null) {
              this.discountValue = 0;
          } else {
              this.discountValue = transaction[0].discount_value;
          }

          this.$store.commit("setReceiptNo", this.transactionID);
          this.$store.commit("setItems", this.items);
          this.$store.commit("setDiscount", this.discountValue);
          this.$store.commit("setSurcharge", this.surcharge);
          this.$store.commit("setTotalPrice", this.totalAmount);
          this.$store.commit("setOrderType", this.orderType);

          let route = this.$router.resolve({ path: "/sales-reports-download" });
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
      const salesReportList = await this.getSalesReports();

      this.data = salesReportList;
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    filterData: function () {
      var data = this.data;
      var dateTime = this.dateTime;
      
      if (!dateTime) {
        return data;
      } else if (search && dates.length) { 
        data = data.filter(function(item){
        if(new Date(item.date_created).toString().indexOf(dateTime) !== -1)
          {
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
