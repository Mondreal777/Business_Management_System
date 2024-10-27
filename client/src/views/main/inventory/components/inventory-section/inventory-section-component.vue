<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Inventory")
    main
      .content-container
        .menu-container
          .search
            b-field(horizontal, label="Search:")
              b-input(
                v-model="search",
                placeholder="Search...",
                icon="magnify",
                size="is-small"
              )
            b-field(horizontal, label="Category:")
              b-select(
                placeholder="Select Category",
                v-model="searchCategory",
                size="is-small"
              )
                option(value="") 
                option(
                  v-for="category in categories",
                  :value="category.name"
                ) {{ category.name }}
            b-select(placeholder="Select", v-model="perPage", size="is-small")
              option(value="10") Show 10 Entries
              option(value="15") Show 15 Entries
              option(value="20") Show 20 Entries
          .addButton
            b-button(
              size="is-small",
              icon-right="plus-box-multiple",
              type="is-success",
              @click="navigateToAddItem"
            ) Add new item
        .table
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
            b-table-column(
              field="product_no",
              label="Product No",
              v-slot="props",
              numeric,
              centered
            )
              | {{ props.row.product_no }}
            b-table-column(
              field="product_name",
              label="Product Name",
              v-slot="props",
              centered
            )
              | {{ props.row.product_name }}
            b-table-column(
              field="quantity",
              label="Quantity",
              v-slot="props",
              centered,
              sortable
            )
              | {{ props.row.quantity }}
            b-table-column(
              field="category",
              label="Category",
              v-slot="props",
              centered
            )
              | {{ props.row.category }}
            b-table-column(
              field="expiry_date",
              label="Expiry Date",
              v-slot="props",
              centered
              sortable
            )
              | {{ new Date(props.row.expiry_date).toLocaleDateString() }}
            b-table-column(
              field="action",
              label="Action",
              width="50",
              v-slot="props",
              centered
            )
              .actionButtons
                .editButton
                  b-button(
                    size="is-small",
                    icon-right="circle-edit-outline",
                    type="is-warning",
                    alt="Update",
                    @click="navigateToEditItem(props.row.product_id, props.row.product_no)"
                  )
                .deleteButton
                  b-input(
                    v-model="toBeDeletedId",
                    size="is-small",
                    type="hidden",
                    required
                  )
                  b-button(
                    size="is-small",
                    icon-right="delete-outline",
                    type="is-danger",
                    v-on:click="addToBeDeletedInModal(props.row.product_id)"
                  )

  b-modal.deleteModal(
    v-model="isDeleteModalActive",
    has-modal-card="",
    trap-focus="",
    :destroy-on-hide="false",
    aria-role="dialog",
    aria-label="Delete",
    close-button-aria-label="Close",
    aria-modal="",
    :overlay="false"
  )
    .modal-card(style="width: auto")
      header.modal-card-head
        p.modal-card-title Delete Item
        button.delete(type="button", @click="isDeleteModalActive = false")
      section.modal-card-body
        ion-icon(name="alert-circle")
        b-field(label="Are you sure you want to delete this item?")
        
      footer.modal-card-foot
        b-button(label='No'  @click="isDeleteModalActive = false")
        b-button#delete_button(
          label="Yes",
          type="is-link",
          v-on:click="deleteItem()"
        )
</template>

<script>
import axios from "axios";
import Header from "../../../../_shared/components/header-component.vue";
import Sidebar from "../../../../_shared/components/sidebar-component.vue";
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
  name: "InventorySectionComponent",
  components: {
    Header,
    Sidebar,
  },
  directive: {},
  filters: {},
  mixins: [loginMixins, auditTrailMixins],
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
        isDeleteModalActive: false,
        confirmDelete: null,
        toBeDeletedId: null,
      };
    },
    navigateToAddItem() {
      this.$router.push("/inventory/add");
    },
    navigateToEditItem(id, product_no) {
      this.$store.commit('setProductId', id);
      this.$router.push("/inventory/edit-item/"+ product_no);
    },
    addToBeDeletedInModal($id) {
      this.isDeleteModalActive = true;
      this.toBeDeletedId = $id;
    },
    async getCategoryList() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/category-list`
      );

      const { categoryList } = res.data.results.data;
      return categoryList;
    },
    async getInventoryList() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/inventory-list`
      );

      const { inventoryList } = res.data.results.data;
      return inventoryList;
    },
    async deleteItem() {
      await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/delete-inventory-item/${this.toBeDeletedId}`);
      console.log("Deleted " + this.toBeDeletedId);

      this.$toast.open({
            message: 'Item Successfully Deleted!',
            type: 'success',
            duration: 5000
            // all of other options may go here
        });

      try {
        const inventoryList = await this.getInventoryList();
        const categoryList = await this.getCategoryList();

        this.data = inventoryList;
        this.categories = categoryList;
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'Inventory', 'Delete inventory', null, null);
      } catch (e) {
        this.$toast.open({
            message: 'Something went wrong!',
            type: 'error',
            duration: 5000
        });
        console.error(e);
      }
      this.isDeleteModalActive = false;
    },
  },
  async created() {
    try {
      this.checkLogin();
      const inventoryList = await this.getInventoryList();
      const categoryList = await this.getCategoryList();

      this.data = inventoryList;
      this.categories = categoryList;
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    filterData: function () {
      var data = this.data;
      var search = this.search;
      var searchCategory = this.searchCategory;
      if (!search && !searchCategory) {
        return data;
      } else if (search && searchCategory) {
        data = data.filter(function(item) {
          if(item.category){
            if(item.product_name.toLowerCase().indexOf(search) !== -1 && item.category.indexOf(searchCategory) !== -1 || item.product_name.indexOf(search) !== -1 && item.category.indexOf(searchCategory) !== -1){
              return item;
            }
          }
        });
      return data;
      } else if (search) {
        data = data.filter(function(item){
          if(item.category){
            if(item.product_name.toLowerCase().indexOf(search) !== -1 || item.product_name.indexOf(search) !== -1 || item.category.toLowerCase().indexOf(search) !== -1 || item.category.indexOf(search) !== -1 || item.quantity.toLowerCase().indexOf(search) !== -1 || item.expiry_date.toLowerCase().indexOf(search) !== -1){
              return item;
            }
          }   
        });
      return data;
      } else {
        data = data.filter(function(item) {
          if(item.category){
            if(item.category.indexOf(searchCategory) !== -1){
              return item;
            }
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
