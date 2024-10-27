<template lang="pug">
body
  Sidebar(userManagementActive)
  .main-container
    Header(title="Users")
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
            b-button(size="is-small" icon-right="plus-box-multiple" type="is-success" @click="navigateToAddItem") Add User
        .table
          b-table(
            :data='filterData' 
            :per-page="perPage" 
            :paginated="isPaginated" 
            :pagination-order="paginationOrder"
            :default-sort-direction="defaultSortDirection"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="first_name"
            :range-before= '1'
            :range-after='1'
            )
            b-table-column(field="first_name" label="Name" v-slot="props" centered sortable)
              | {{ props.row.first_name }} {{ props.row.last_name }}
            b-table-column(field="username" label="Username" v-slot="props" centered sortable)
              | {{ props.row.username }}
            b-table-column(field="role" label="User Role" v-slot="props" centered sortable)
              | {{ props.row.role }}
            b-table-column(field="created_date" label="Date Created" v-slot="props" centered sortable)
              | {{ props.row.created_date }}
            b-table-column(field="status" label="Status" v-slot="props" centered sortable)
              | {{ props.row.status === 'A' ? 'Active' : 'Inactive' }}
            b-table-column(field="action" label="Action" width="50" v-slot="props" centered)
              .actionButtons
                .editButton
                  b-button(size="is-small" icon-right="circle-edit-outline" type="is-warning" alt="Edit" @click="navigateToEditItem(props.row.user_id)")
                .deleteButton
                  b-input(v-model='toBeDeletedId' size='is-small' type='hidden' required)
                  b-button(size="is-small" icon-right="delete-outline" type="is-danger" v-on:click="addToBeDeletedInModal(props.row.user_id)")
          
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
                b-field(label='Are you sure you want to delete this item?')
              footer.modal-card-foot
                b-button(label='Cancel'  @click="isDeleteModalActive = false")
                b-button(label='Delete' id='delete_button' type="is-link" v-on:click="deleteItem()")

</template>

<script>
import axios from 'axios';
import Header from "../../../../_shared/components/header-component.vue"
import Sidebar from "@/views/_shared/components/sidebar-component.vue"
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";
//

export default {
  name: "UsersSectionComponent",
  components: {
    Header,
    Sidebar
  },
  directive: {},
  filters: {},
  mixins: [loginMixins, auditTrailMixins],
  props: {},
  data() {
    this.checkLogin()
    return this.initData();
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    initData() {
      return {
        userroledata: [],
        data: [],        
        roles: [],
        role: null,
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
        roleData:null
      }
    },
    navigateToAddItem() {
      this.$router.push('/user-management/users/add');
    },
    navigateToEditItem(id) {
      this.$store.commit("setUsersId", id);
      this.$router.push('/user-management/users/edit/');
    },
    addToBeDeletedInModal($id){
      this.isDeleteModalActive = true
      this.toBeDeletedId = $id;
    },
    async getUserDetailList() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/user-details/list`
      );

      const { userList } = res.data.results.data;
      return userList;
    },
    async deleteItem(){
      
      await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/delete-user/${this.toBeDeletedId}`);
      console.log("Deleted " + this.toBeDeletedId); 
      
      try {
        const userList = await this.getUserDetailList();
        this.data = userList;

        this.$toast.open({
            message: 'User successfully deleted!',
            type: 'success',
            duration: 5000
            // all of other options may go here
        });
        var loginDetails = this.$store.getters.getLoginDetails
            this.saveAuditTrail(loginDetails["loginUserId"], 'Users', 'Delete users', null, null); 
      } catch(err) {
        this.$toast.open({
            message: `Something went wrong! ${err}`,
            type: 'error',
            duration: 5000
        });
        console.error(err);
      }
      this.isDeleteModalActive = false;
    }
  },
  async created() {
    try {
      //this is where code for api integration 
      const userList = await this.getUserDetailList();
      this.data = userList;
    } catch(e) {
      console.error(e);
    }
  },
  computed: {
    filterData: function () {
      var data = this.data;
      var search = this.search;
      
      if (!search) { 
        return data;
      } else {
        data = data.filter(function(item) {
          if(item.first_name.toLowerCase().indexOf(search) !== -1 || item.first_name.indexOf(search) !== -1 ||
            item.last_name.toLowerCase().indexOf(search) !== -1 || item.last_name.indexOf(search) !== -1 ||
            item.username.toLowerCase().indexOf(search) !== -1 || item.username.indexOf(search) !== -1 || 
            item.role.toLowerCase().indexOf(search) !== -1 || item.role.indexOf(search) !== -1 ||
            item.created_date.toLowerCase().indexOf(search) !== -1 || item.created_date.indexOf(search) !== -1){
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
