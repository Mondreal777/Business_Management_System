<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Store Tables")
    main
      .content-container
        .menu-container
          .search
            b-field(horizontal label="Search:")
              b-input(v-model='search' placeholder='Search...' icon='magnify' size='is-small')
            b-select(placeholder="Select" v-model='perPage' size="is-small")
              option(value='10') Show 10 Entries
              option(value='15') Show 15 Entries
              option(value='20') Show 20 Entries 
          .addButton
            b-button(size="is-small" icon-right="plus-box-multiple" type="is-success" @click="navigateToAddItem") Add Table
        .table
          b-table(
            :data='filterData' 
            :per-page="perPage" 
            :paginated="isPaginated" 
            :pagination-order="paginationOrder"
            :default-sort-direction="defaultSortDirection"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="table_name"
            :range-before= '1'
            :range-after='1'
            )
            b-table-column(field="table_name" label="Table Name" v-slot="props" centered sortable)
              | {{ props.row.table_name }}
            b-table-column(field="table_no" label="Table Number" v-slot="props" centered sortable)
              | {{ props.row.table_no }}
            b-table-column(field="capacity" label="Capacity" v-slot="props" centered sortable)
              | {{ props.row.capacity }}
            b-table-column(field="action" label="Action" width="50" v-slot="props" centered)
              .actionButtons
                .editButton
                  b-button(size="is-small" icon-right="circle-edit-outline" type="is-warning" alt="Edit" @click="navigateToEditItem(props.row.id)")
                .printButton
                  b-button(size="is-small" icon-right="printer" type="is-info" @click="print(props.row.id)")  
                .deleteButton
                  b-input(v-model='toBeDeletedId' size='is-small' type='hidden' required)
                  b-button(size="is-small" icon-right="delete-outline" type="is-danger" v-on:click="addToBeDeletedInModal(props.row.id)")
          
  b-modal.deleteModal(v-model='isDeleteModalActive' 
            has-modal-card='' trap-focus='' 
            :destroy-on-hide='false' 
            aria-role='dialog' 
            aria-label='Delete' 
            close-button-aria-label='Close' 
            aria-modal=''
            :overlay='false')
            .modal-card(style='width: auto')
              header.modal-card-head
                p.modal-card-title Delete Item
                button.delete(type='button' @click="isDeleteModalActive = false")
              section.modal-card-body
                ion-icon(name='alert-circle')
                b-field(label='Are you sure you want to delete this table?')
              footer.modal-card-foot
                b-button(label='No'  @click="isDeleteModalActive = false")
                b-button(label='Yes' id='delete_button' type="is-link" v-on:click="deleteItem()")

</template>

<script>
import axios from 'axios';
import Header from "../../../../_shared/components/header-component.vue"
import Sidebar from "../../../../_shared/components/sidebar-component.vue"
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";
//

export default {
  name: "StoreTableSectionComponent",
  components: {
    Header,
    Sidebar
  },
  directive: {},
  filters: {},
  mixins: [],
  mixins: [loginMixins, auditTrailMixins],
  props: {},
  data() {
    this.checkLogin()
    return this.initData();
  },
  computed: {},
  watch: {},
  methods: {
    initData() {
      return {
        data: [],        
        search: null,
        isPaginated: true,
        currentPage: 1,
        perPage: 10,
        searchable: true,
        paginationOrder: 'is-centered',
        defaultSortDirection: 'desc',
        sortIcon: 'chevron-up',
        sortIconSize: '',
        isDeleteModalActive: false,
        confirmDelete: null,
        toBeDeletedId: null,
      }
    },
    navigateToAddItem() {
      this.$router.push('/store-management/tables/add');
    },
    navigateToEditItem(id) {
      this.$store.commit("setTableId", id);
      this.$router.push('/store-management/tables/edit');
    },
    print(id) {
      this.$store.commit("setTableId", id);
      let route = this.$router.resolve({ path: "/store-management/tables/print" });
          window.open(route.href);
    },
    addToBeDeletedInModal(id){
      this.isDeleteModalActive = true
      this.toBeDeletedId = id;
    },
    async deleteItem() {
      
      await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/table/delete/` + this.toBeDeletedId);
      console.log("Deleted " + this.toBeDeletedId); 
      
      try {
        const tableList = await this.getTableList();
        this.$toast.open({
          message: 'Successfully deleted Table!',
          type: 'success',
          duration: 5000
          // all of other options may go here
        });
        this.data = tableList;
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'Tables', 'Delete tables', null, null);
      } catch(err) {
        this.$toast.open({
					message: `Something went wrong! ${err}`,
					type: 'error',
					duration: 5000
				});
        console.error(err);
      }
      
      this.isDeleteModalActive = false;
	},
    async getTableList() {
        try {
            const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/table/list`);

            const { tableList } = res.data.results.data;
            return tableList;
        } catch (err) {
            throw err;
        }
    }
  },
  async created() {
    try {
      const tableList = await this.getTableList();
      
      this.data = tableList;
    } catch(err) {
      console.error(err);
    }
  },
  computed: {
    filterData: function () {
      var data = this.data;
      var search = this.search;
      
      if (search) {
        data = this.data.filter(function(item){
          if(item.table_name.toLowerCase().indexOf(search) !== -1 || item.table_name.indexOf(search) !== -1 || 
            item.table_no === search)
          {
            return item;
          }   
        });
      
      }
      return data; 
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

.main-container{
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

.addButton {
  margin-left: auto;
}

.addButton button {
  background-color: #68DD62;
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
  background-color: #FFB44F;
  color: white;
  margin-right: 1px;
}

.deleteButton button {
  background-color: #F05050;
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

.printButton button:hover {
  background-color: #377db6;
  color: white;
}

.deleteButton button:hover {
  background-color: #b63b3b;
  color: white;
  margin-left: 1px;
}


label, select, input, b-select {
  font-size: 15px;
  display: inline-block;
}

input, select {
  margin-left: 10px;
  margin-right: 10px;
  height: 25px;
}

.field-label.is-normal {
  margin: 5px 0;
  padding: 0
}

header.modal-card-head p.modal-card-title {
  display: flex;
  justify-content: center;
}

ion-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #F05050;
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