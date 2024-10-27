<template lang="pug">
.sidebar-page
  section.sidebar-layout
    b-sidebar(v-show="!mobileView"
              type="is-light" 
              :fullheight="true" 
              position="static" 
              mobile="hide" 
              open
              )   
          .title
            h1 POS-itive
          b-menu.is-custom-mobile
            b-menu-list
              b-menu-item(v-for="menu in menuList" v-if="permissions.includes(menu.name)" v-bind:key="menu.id" :icon="menu.icon" :active="menu.active" :expanded="menu.expanded" :label="menu.name" @click="menuRoute(menu.path, menu.id)")
                b-menu-item(v-for="children in menu.children" v-bind:key="children.id" :icon="children.icon" :active="children.active" :label=" children.name" @click="navigateChildren(children.path, children.id)")
            b-menu-list
              b-menu-item(icon="logout" label="Logout" @click="isLogoutModalActive = true")


            b-modal(v-model='isLogoutModalActive' 
                    has-modal-card='' trap-focus='' 
                    :destroy-on-hide='false' 
                    aria-role='dialog' 
                    aria-label='Logout' 
                    close-button-aria-label='Close' 
                    aria-modal='')
                    .modal-card(style='width: auto')
                      header.modal-card-head
                        p.modal-card-title Logout
                        button.delete(type='button' @click="isLogoutModalActive = false")
                      section.modal-card-body
                        ion-icon(name='warning')
                        b-field(label='Are you sure you want to logout?')
                      footer.modal-card-foot
                        b-button(label='Cancel' @click="isLogoutModalActive = false")
                        b-button(label='Yes, Log me out' type="is-link" @click="navigateLogout()")
  
    b-sidebar(v-show="mobileView"
              type="is-light"
              :fullheight="true"
              :overlay="overlay"
              :open="sidebarOpen"
              :right="right"
              :destroy-on-hide='false' 
              )   
          .title
            h1 POS-itive
            b-button(@click="closeSidebar()" size="is-large" icon-right="arrow-left")
          b-menu.is-custom-mobile
            b-menu-list
              b-menu-item(v-for="menu in menuList" v-if="permissions.includes(menu.name)" v-bind:key="menu.id" :icon="menu.icon" :active="menu.active" :expanded="menu.expanded" :label="menu.name" @click="menuRoute(menu.path, menu.id)")
                b-menu-item(v-for="children in menu.children" v-bind:key="children.id" :icon="children.icon" :active="children.active" :label=" children.name" @click="navigateChildren(children.path, children.id)")
            b-menu-list
              b-menu-item(icon="logout" label="Logout" @click="isLogoutModalActive = true")


            b-modal(v-model='isLogoutModalActive' 
                    has-modal-card='' trap-focus='' 
                    :destroy-on-hide='false' 
                    aria-role='dialog' 
                    aria-label='Logout' 
                    close-button-aria-label='Close' 
                    aria-modal='')
                    .modal-card(style='width: auto')
                      header.modal-card-head
                        p.modal-card-title Logout
                        button.delete(type='button' @click="isLogoutModalActive = false")
                      section.modal-card-body
                        ion-icon(name='warning')
                        b-field(label='Are you sure you want to logout?')
                      footer.modal-card-foot
                        b-button(label='Cancel' @click="isLogoutModalActive = false")
                        b-button(label='Yes, Log me out' type="is-link" @click="navigateLogout()")

</template>

<script>
import axios from 'axios'

export default {
  name: "SidebarComponent",
  components: {},
  directive: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
        return this.initData();
    },
  watch: {},
  async created() {
    const menuId = this.$store.getters.getMenuId;
    const menuChildId = this.$store.getters.getMenuChildId;
	const { userDetails } = this.$store.getters.getLoginDetails
    const { user_details } = userDetails;
    this.userDetails = user_details;

	const permissionArr = await this.getPermissionByRoleId();
	permissionArr.push('Dashboard');
	this.permissions = permissionArr;

    if (this.menuList[menuId-1].hasChildren === false) {
      this.menuList[menuId-1].active = true;
    } else {
      this.menuList[menuId-1].children[menuChildId-1].active = true
      this.menuList[menuId-1].expanded = true;
    }
  },
  methods: {
        initData() {
            return {
              menuId: null,
			        permissions: ['Dashboard'],
              menuList: [
                {
                  "id": 1,
                  "icon": "view-dashboard",
                  "name": "Dashboard",
                  "children": [],
                  "path": "/dashboard",
                  "expanded": null,
                  "active": null ,
                  "hasChildren": false
                },
                {
                  "id": 2,
                  "icon": "laptop",
                  "name": "POS",
                  "children": [],
                  "path": "/pos",
                  "expanded": null,
                  "active": null,
                  "hasChildren": false
                },
                {
                  "id": 3,
                  "icon": "store",
                  "name": "Store Management",
                  "children": [
                    {
                      "id": 1,
                      "name": "Tables",
                      "icon": "",
                      "active": null,
                      "path": "/store-management/tables"
                    },
                    {
                      "id": 2,
                      "name": "Discounts",
                      "icon": "",
                      "active": null,
                      "path": "/store-management/discounts"
                    },
                    {
                      "id": 3,
                      "name": "Surcharges",
                      "icon": "",
                      "active": null,
                      "path": "/store-management/surcharges"
                    },
                    {
                      "id": 4,
                      "name": "Promos",
                      "icon": "",
                      "active": null,
                      "path": "/store-management/promos"
                    }
                  ],
                  "expanded": null,
                  "path": "",
                  "active": null,
                  "hasChildren": true
                },
                {
                  "id": 4,
                  "icon": "cart",
                  "name": "Products",
                  "children": [],
                  "expanded": null,
                  "path": "/products",
                  "active": null,
                  "hasChildren": false
                },
                {
                  "id": 5,
                  "icon": "clipboard-text",
                  "name": "Inventory",
                  "children": [],
                  "expanded": null,
                  "path": "/inventory",
                  "active": null,
                  "hasChildren": false
                },
                {
                  "id": 6,
                  "icon": "cart-plus",
                  "name": "Purchasing",
                  "children": [],
                  "expanded": null,
                  "path": "/purchasing",
                  "active": null,
                  "hasChildren": false
                },
                {
                  "id": 7,
                  "icon": "clipboard",
                  "name": "Receiving",
                  "children": [],
                  "expanded": null,
                  "path": "/receiving",
                  "active": null,
                  "hasChildren": false
                },
                {
                  "id": 8,
                  "icon": "account-multiple",
                  "name": "User Management",
                  "children": [
                    {
                      "id": 1,
                      "name": "Users",
                      "icon": "",
                      "active": null,
                      "path": "/user-management/users"
                    },
                    {
                      "id": 2,
                      "name": "User Roles",
                      "icon": "",
                      "active": null,
                      "path": "/user-management/user-roles"
                    },
                  ],
                  "expanded": null,
                  "path": "/user-management/users",
                  "active": null,
                  "hasChildren": true
                },
                {
                  "id": 9,
                  "icon": "chart-box",
                  "name": "Reports",
                  "children": [
                    {
                      "id": 1,
                      "name": "Sales",
                      "icon": "",
                      "active": null,
                      "path": "/sales-reports"
                    },
                    {
                      "id": 2,
                      "name": "Inventory",
                      "icon": "",
                      "active": null,
                      "path": "/inventory-reports"
                    },
                  ],
                  "expanded": null,
                  "path": "",
                  "active": null,
                  "hasChildren": true
                },                
                {
                  "id": 10,
                  "icon": "magnify",
                  "name": "Audit Trail",
                  "children": [],
                  "expanded": null,
                  "path": "/audit-trail",
                  "active": null,
                  "hasChildren": false
                },                
                
              ],
              overlay: true,
              isLogoutModalActive: false,
              right: false,
              mobileView: true,
			  userDetails: null
            }
        },
		async getPermissionByRoleId() {
			const res = await axios.get(
				`${process.env.VUE_APP_API_BASE_URL}/role-permission/${this.userDetails.role_id}`
			);

			const { roleData } = res.data.results.data;
			this.$store.commit('setRole', roleData.role);
			const permissionStr = roleData.permission;
			const permissionArr = permissionStr.split(',')
      		return permissionArr;
		},

        menuRoute(path, id) {  
          this.$store.commit('setMenuId', id);

          if (this.menuList[id-1].hasChildren === false) {
            this.$router.push(path);
            this.closeSidebar()
          }
        },
        navigateChildren(path, id){
          this.$store.commit('setMenuChildId', id);
          this.$router.push(path);
          this.closeSidebar()
        },

        navigateLogout() {
          this.$store.commit('setLoginDetails', null);
          const path = '/'
          if (this.$route.path !== path) this.$router.push(path);         
        },
        closeSidebar() {
          if (this.$store.getters.getOpenSidebar === false) {
            this.$store.commit('setOpenSidebar', true);
          } else {
            this.$store.commit('setOpenSidebar', false);
          }
        },
        onResize() {
          this.mobileView = window.innerWidth < 770;
        },
 
  },
  computed: {
    sidebarOpen() {
      return this.$store.getters.getOpenSidebar 
    },

  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, { passive: true });
    }
  },

}
</script>

<style lang="scss" scoped>

.sidebar-page {
  background-color: #00084E;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  .sidebar-layout {
        display: flex;
        flex-direction: row;
        min-height: 100%;
    }
}

.title {
  display: flex;
  align-content: center;
  margin: 0;
  justify-content: space-between;
  padding: 0 20px;
}

.title h1 {
  color: white;
  font-family: 'Poppins';
  font-weight: bold;
  margin: 20px 0 0 0;
}

.title button {
  background: transparent;
  color: white;
  border: none;
  margin: 10px 0 0 0;
}

header.modal-card-head p.modal-card-title {
  display: flex;
  justify-content: center;
}

ion-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: orange;
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