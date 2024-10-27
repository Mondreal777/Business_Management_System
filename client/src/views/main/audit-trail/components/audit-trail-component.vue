<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Audit Trail")
    main
      .content-container
        .menu-container
          .search
            .search-table
              .search-field
                b-field(label="Username:")
                    b-select(placeholder="Filter by user" v-model="searchUser" size="is-small")
                      option(value="")
                      option(v-for="user in users" :value="user.username" :key="user.username") {{ user.username }}
              .search-request
                .search-request-type
                    b-field(label="Action:")
                        b-select(placeholder="Filter by action" v-model="searchAction" size="is-small")
                            option(value="")
                            option(v-for="action in actions" :value="action.action") {{ action.action }}
                .search-status        
                    b-field(label='Choose Date Range')
                        b-datepicker(placeholder='Click to select...' v-model='searchDates' range='' size="is-small")

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
            b-table-column(field="module" label="Module" v-slot="props" centered sortable)
              | {{ props.row.module }}
            b-table-column(field="created_date" label="Date" v-slot="props" centered sortable)
              | {{ new Date(props.row.created_date).toLocaleDateString() }}
            b-table-column(field="created_date" label="Time" v-slot="props" centered)
              | {{ new Date(props.row.created_date).toLocaleTimeString() }}
            b-table-column(field="action" label="Action" v-slot="props" centered)
              | {{ props.row.action }}
            b-table-column(field="user" label="User" v-slot="props" centered sortable)
              | {{ props.row.username }}
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
<script>
import axios from 'axios';
import moment from 'moment'
import Header from "../../../_shared/components/header-component.vue";
import Sidebar from "../../../_shared/components/sidebar-component.vue";
import loginMixins from "../../../../mixins/login";

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
    this.checkLogin()
    return this.initData();
  },
  computed: {},
  watch: {},
  methods: {
    initData() {
      return {
        isPaginated: true,
        currentPage: 1,
        perPage: 10,
        searchable: true,
        paginationOrder: 'is-centered',
        defaultSortDirection: 'desc',
        sortIcon: 'chevron-up',
        sortIconSize: '',
        //Audit
        data: [],
        searchUser: null,
        searchAction: null,
        searchDates: [],
        users: [],
        user: null,
        actions: [],
        action: null
      }
    },

    async getAuditTrailList() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/audit-trail/list`
      );

      const { auditTrailList } = res.data.results.data;
      return auditTrailList;
    },
    async getUsersList() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/user-details/list`
      );

      const { userList } = res.data.results.data;
      return userList;
    },
    async getActionsList() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/audit-trail/action-list`
      );

      const { auditTrailActionList } = res.data.results.data;
      return auditTrailActionList;
    },
  },
  async created() {
    try {
      this.checkLogin();
      const auditTrailList = await this.getAuditTrailList();
      const userList = await this.getUsersList();
      const actionList = await this.getActionsList();

      this.actions = actionList;
      this.users = userList;
      this.data = auditTrailList;
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    filterData: function () {
      var data = this.data;
      var searchUsername = this.searchUser;      
      var searchAction = this.searchAction;      
      var dates = this.searchDates;      
      if (!searchAction && !searchUsername && dates.length == 0) {
        return data;
      } else if (searchAction && searchUsername && dates.length > 0){
        data = data.filter(function(item) {
            if(item.action.indexOf(searchAction) !== -1 && item.username.indexOf(searchUsername) !== -1 && (moment(item.created_date).isBetween(dates[0], dates[1]) || moment(item.created_date).format('L') == moment(dates[0]).format('L') || moment(item.created_date).format('L') == moment(dates[1]).format('L'))){
              return item;
            }
        });
        return data;  
      } else if (searchAction && searchUsername) {
          
        data = data.filter(function(item) {
            if(item.action.indexOf(searchAction) !== -1 && item.username.indexOf(searchUsername) !== -1){
              return item;
            }
        });
        return data;
      } else if (searchAction && dates.length > 0) {
          
        data = data.filter(function(item) {
            if(item.action.indexOf(searchAction) !== -1 && (moment(item.created_date).isBetween(dates[0], dates[1]) || moment(item.created_date).format('L') == moment(dates[0]).format('L') || moment(item.created_date).format('L') == moment(dates[1]).format('L'))){
              return item;
            }
        });
        return data;
      } else if (searchUsername && dates.length > 0) {
          
        data = data.filter(function(item) {
            if(item.username.indexOf(searchUsername) !== -1 && (moment(item.created_date).isBetween(dates[0], dates[1]) || moment(item.created_date).format('L') == moment(dates[0]).format('L') || moment(item.created_date).format('L') == moment(dates[1]).format('L'))){
              return item;
            }
        });
        return data;
      } else if (searchUsername) {
        data = data.filter(function(item) {
            if(item.username.indexOf(searchUsername) !== -1){
              return item;
            }
        });
        return data;
      } else if (searchAction) {
        data = data.filter(function(item) {
            if(item.action.indexOf(searchAction) !== -1){
              return item;
            }
        });
        return data;
      } else if (dates.length > 0) {
        data = data.filter(function(item) {
            if(moment(item.created_date).isBetween(dates[0], dates[1]) || moment(item.created_date).format('L') == moment(dates[0]).format('L') || moment(item.created_date).format('L') == moment(dates[1]).format('L')){
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
