<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Promos")
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
              .search-promo
                .search-promo-date
                  b-field(label='Select date range')
                    b-datepicker(
                      placeholder='Click to select...' 
                      v-model='dates' 
                      range='' 
                      size="is-small"
                      )
                    b-button(size="is-small" type="is-info" label="Reset" @click="dates = []")
            b-select(placeholder="Select" v-model='perPage' size="is-small")
              option(value='10') Show 10 Entries
              option(value='15') Show 15 Entries
              option(value='20') Show 20 Entries 
          .addButton
            b-button(size="is-small" icon-right="plus-box-multiple" type="is-success" @click="navigateToAddItem") Add Promo
        .table
          b-table(
            :data='filterData' 
            :per-page="perPage" 
            :paginated="isPaginated" 
            :pagination-order="paginationOrder"
            :default-sort-direction="defaultSortDirection"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="name"
            :range-before= '1'
            :range-after='1'
            )
            b-table-column(field="name" label="Name" v-slot="props" centered sortable)
              | {{ props.row.name }}
            b-table-column(field="description" label="Description" v-slot="props" centered sortable)
              | {{ props.row.description }}
            b-table-column(field="price" label="Price" v-slot="props" centered sortable)
              | {{ props.row.price }}
            b-table-column(field="duration" label="Duration" v-slot="props" centered sortable)
              | {{ props.row.duration}}
            b-table-column(field="status" label="Status" v-slot="props" centered sortable)
                b-switch(v-model='props.row.status' true-value='A' false-value='DIS' @input="handleSwitch(props.row)")
            b-table-column(field="action" label="Action" width="50" v-slot="props" centered)
              .actionButtons
                .editButton
                  b-button(size="is-small" icon-right="circle-edit-outline" type="is-warning" alt="Edit" @click="navigateToEditItem(props.row.id)")
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
                b-field(label='Are you sure you want to delete this promo?')
              footer.modal-card-foot
                b-button(label='No'  @click="isDeleteModalActive = false")
                b-button(label='Yes' id='delete_button' type="is-link" v-on:click="deleteItem()")

</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
<script>
import moment from 'moment'
import axios from 'axios';
import Header from "../../../../_shared/components/header-component.vue"
import Sidebar from "../../../../_shared/components/sidebar-component.vue"
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
  name: "promosSectionComponent",
  components: {
    Header,
    Sidebar
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
        dates: []
      }
    },
    async handleSwitch(item) {
        const status = item.status;
        await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/update-promo-status/${item.id}`,
            {
                status
            }
        );
        this.$toast.open({
            message: "Promo status is updated!",
            type: "success",
            duration: 5000,
            // all of other options may go here
        });
    },
    navigateToAddItem() {
      this.$router.push('/store-management/promos/add');
    },
    navigateToEditItem(id) {
      this.$store.commit("setPromosId", id);
      this.$router.push('/store-management/promos/edit');
    },
    addToBeDeletedInModal($id){
      this.isDeleteModalActive = true
      this.toBeDeletedId = $id;
    },
    async deleteItem(){
      await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/delete-promos/` + this.toBeDeletedId);
      console.log("Deleted " + this.toBeDeletedId);
      
      this.$toast.open({
            message: 'Item Successfully Deleted!',
            type: 'success',
            duration: 5000
            // all of other options may go here
        });

      try {
        const promosList = await this.getPromosList();

        this.data = promosList;
      } catch (e) {
        this.$toast.open({
            message: 'Something went wrong!',
            type: 'error',
            duration: 5000
        });
        console.error(e);
      }
      var promoData = this.getPromoData(this.toBeDeletedId);
      var loginDetails = this.$store.getters.getLoginDetails
      this.saveAuditTrail(loginDetails["loginUserId"], 'Promos', 'Delete promos', JSON.stringify(promoData), null);
      this.isDeleteModalActive = false;
    },
    async getPromoData(id) {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/get-promos-by-id/` + id
      );
      const promosDetail = res.data.results.data;
      return promosDetail.promosList;
    },
    async getPromosList() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/promos`
      );
      const  { promosList } = res.data.results.data;
      console.log(promosList)
      return promosList;
    },
  
  },
  async created() {
    try {
      this.checkLogin()
      const promosList = await this.getPromosList();

      this.data = promosList;
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    filterData: function () {
      var data = this.data;
      var search = this.search;
      var dates = this.dates;
      var dateRange = moment(this.dates[0]).format('L') + " - " + moment(this.dates[1]).format('L');
      
      if (!search && !dates.length) {
        return data;
      } else if (search && dates.length) { 
        data = data.filter(function(item){
        if(item.name.toLowerCase().indexOf(search) !== -1 && item.duration.indexOf(dateRange) !== -1 || item.name.indexOf(search) !== -1 && item.duration.indexOf(dateRange) !== -1 || 
            item.description.toLowerCase().indexOf(search) !== -1 && item.duration.indexOf(dateRange) !== -1 || item.description.indexOf(search) !== -1 && item.duration.indexOf(dateRange) !== -1 ||
            item.price == search && item.duration.indexOf(dateRange) !== -1 || 
            item.created_by_username.toLowerCase().indexOf(search) !== -1 && item.duration.indexOf(dateRange) !== -1 || item.created_by_username.indexOf(search) !== -1 && item.duration.indexOf(dateRange) !== -1)
          {
          return item;
          } 
        });
        return data;
      } else if (search) {
        data = data.filter(function(item){
        if(item.name.toLowerCase().indexOf(search) !== -1 || item.name.indexOf(search) !== -1 || 
            item.description.toLowerCase().indexOf(search) !== -1 || item.description.indexOf(search) !== -1 ||
            item.price == search || 
            item.created_by_username.toLowerCase().indexOf(search) !== -1 || item.created_by_username.indexOf(search) !== -1 )
          {
          return item;
          } 
        });
        return data;
      } else {
        data = data.filter(function(item) {
          if(item.duration.indexOf(dateRange) !== -1){
            return item;
          }
        });
        console.log(dateRange);
      return data;
      
      }
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

.search-table, .search-promo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.search-promo {
  width: 200px;
}

.search-table .search-field, .search-table .search-promo-date, .search-table .search-promo-time {
  margin: 0 20px 20px 0;
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