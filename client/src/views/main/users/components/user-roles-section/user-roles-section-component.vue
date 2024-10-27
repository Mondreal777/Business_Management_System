<template lang="pug">
body
  Sidebar(userManagementActive)
  .main-container
    Header(title="Roles")
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
            b-button(size="is-small" icon-right="plus-box-multiple" type="is-success" @click="navigateToAddItem") Add Role
        .table
          b-table(
            :data='filterData' 
            :per-page="perPage"
            :paginated="isPaginated" 
            :pagination-order="paginationOrder"
            :default-sort-direction="defaultSortDirection"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="role"
            :range-before= '1'
            :range-after='1'
            )
            b-table-column(field="role" label="Name" v-slot="props" centered sortable)
              | {{ props.row.role }} 
            b-table-column(field="role_type" label="Role Type" v-slot="props" centered sortable)
              | {{ props.row.role_type }}
            b-table-column(field="description" label="Description" v-slot="props" centered sortable)
              | {{ props.row.description }}
            b-table-column(field="permission" label="Permissions" v-slot="props" centered sortable)
              | {{ props.row.permission }}
            b-table-column(field="created_date" label="Date Time" v-slot="props" centered sortable)
              | {{ new Date(props.row.created_date).toLocaleString() }}
            b-table-column(field="action" label="Action" width="50" v-slot="props" centered)
              .actionButtons
                .editButton
                  b-button(size="is-small" icon-right="circle-edit-outline" type="is-warning" alt="Edit" @click="navigateToEditItem(props.row.role_id)")
                .deleteButton
                  b-input(v-model='toBeDeletedId' size='is-small' type='hidden' required)
                  b-button(size="is-small" icon-right="delete-outline" type="is-danger" v-on:click="addToBeDeletedInModal(props.row.role_id)")
          
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
  name: "UserRolesSectionComponent",
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
        userRoleData: [],
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
      this.$router.push('/user-management/user-roles/add');
    },
    navigateToEditItem(id) {
      this.$store.commit("setRoleId", id);
      console.log(id);
      this.$router.push('/user-management/user-roles/edit');
    },
    addToBeDeletedInModal($id){
      this.isDeleteModalActive = true
      this.toBeDeletedId = $id;
      console.log(this.toBeDeletedId);
    },
    async getRolePermissionList() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/role-permission/list`
      );

      const { rolePermissionList } = res.data.results.data;
      return rolePermissionList;
    },
    async deleteItem(){
      
      
      const res = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/role-permission/delete/${this.toBeDeletedId}`);
      const res2 = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/role/delete/${this.toBeDeletedId}`);
      console.log(res);
      console.log(res2);
      console.log("Deleted " + this.toBeDeletedId);
      var loginDetails = this.$store.getters.getLoginDetails
      this.saveAuditTrail(loginDetails["loginUserId"], 'User Roles', 'Delete role save details', null, null); 
      this.saveAuditTrail(loginDetails["loginUserId"], 'User Roles', 'Delete role permission save details', null, null); 
      
      try {
        const rolePermissionList = await this.getRolePermissionList();
        this.data = rolePermissionList;

        this.$toast.open({
            message: 'Role successfully deleted!',
            type: 'success',
            duration: 5000
            // all of other options may go here
        });
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
      const rolePermissionList = await this.getRolePermissionList();
      this.data = rolePermissionList;
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
          const description = item.description;
          const created_date = new Date(item.created_date).toLocaleString()
          if(item.role.toLowerCase().indexOf(search) !== -1 || item.role.indexOf(search) !== -1 || 
            item.role_type.toLowerCase().indexOf(search) !== -1 || item.role_type.indexOf(search) !== -1 || 
            item.description.toLowerCase().indexOf(search) !== -1 || item.description.indexOf(search) !== -1 ||
            item.permission.toLowerCase().indexOf(search) !== -1 || item.permission.indexOf(search) !== -1 ||
            created_date.toLowerCase().indexOf(search) !== -1 || created_date.indexOf(search) !== -1 ){
            console.log(created_date);
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
