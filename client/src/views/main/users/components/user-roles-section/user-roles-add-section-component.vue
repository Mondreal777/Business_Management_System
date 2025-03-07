<template lang="pug">
body
  Sidebar(userManagementActive)
  .main-container
    Header(title="Roles")
    main
      .content-container 
        h1 Add Role
        b-button(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-user-details
          b-field(label="Role Name:")              
            b-input(v-model='role' placeholder='Input Role' size='is-small' required)
          b-field(label="Role Type:")              
            b-input(v-model='roleType' placeholder='Input Type' size='is-small' required)
          b-field(label="Description:")              
            b-input(v-model='description' placeholder='Input Description' size='is-small' required)
          b-field(label="Role Permission")
            section
              .block
                .permissions(v-for='permission in permissionList')
                  b-checkbox(v-model="permissions" :native-value="permission.permission_id")
                    | {{ permission.permission }}
          .buttons
              b-button(type="is-danger" @click="navigateBack") Cancel
              b-button(type="is-link" @click="saveRole()" :disabled="isSaveBtnDisabled") Add Role
                  
    b-modal.deleteModal(v-model='isSuccessModalActive' 
                            has-modal-card='' trap-focus='' 
                            :destroy-on-hide='false' 
                            aria-role='dialog' 
                            aria-label='Logout' 
                            close-button-aria-label='Close' 
                            aria-modal=''
                            :overlay='false')
                            .modal-card(style='width: auto')
                              header.modal-card-head
                                p.modal-card-title Success!
                                button.delete(type='button' @click="isSuccessModalActive = false")
                              section.modal-card-body
                                ion-icon(name='checkmark-circle')
                                b-field(label='You successfully ADDED a new role!')
                              footer.modal-card-foot
                                b-button(label='Okay' type="is-link" @click="navigateBack")
                

</template>

<script>
import axios from 'axios';
import Header from "../../../../_shared/components/header-component.vue"
import Sidebar from "@/views/_shared/components/sidebar-component.vue"
import { ORGANIZATION_ID } from "@/constants/enum/defaults.js"
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
  name: "userRolesAddSectionComponent",
  components: {
      Header,
      Sidebar
  },
  mixins: [loginMixins, auditTrailMixins],
  data() {
      this.checkLogin()
      return {
        role: null,
        roleType: null,
        description: null,
        permissionList: [],
        permissions: [],
        isSuccessModalActive: false,
        submitStatus: null,
      };
  },
  methods: {
      navigateBack() {
          this.$router.push('/user-management/user-roles');
      },
      async getPermissionList() {
        try {
          const res = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/permission/list`
          );
          const { permissionList } = res.data.results.data;
          return permissionList;
        } catch (err) {
          throw err;
        }
      },
      async saveRole() {
       const res = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/role/save-details`,
          {
            role: this.role,
            roleType: this.roleType,
            description: this.description,
            organizationId: ORGANIZATION_ID
          }
        )
      var loginDetails = this.$store.getters.getLoginDetails
      this.saveAuditTrail(loginDetails["loginUserId"], 'User Roles', 'Add role save details', null, null); 
      const roleId = res.data.results.data.result;
      await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/role-permission/save-details`,
        {
          roleId: roleId,
          permissionId: this.permissions,
        }
      )     
      .then(() => {
          
          this.isSuccessModalActive = true
          this.clearFields();
          this.$toast.open({
              message: 'User successfully saved!',
              type: 'success',
              duration: 5000
              // all of other options may go here
          });
        }
      ).catch(err => {
          this.$toast.open({
            message: `Something went wrong! \n${err}`,
            type: 'error',
            duration: 5000
          });
          console.error(err);
        });
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'User Roles', 'Add role permisssion save details', null, null); 
        
      },
      clearFields() {
        this.roleName = null;
        this.roleType= null;
        this.description = null;
        this.permissions = [];
    },
  },
  async created() {
    try {
      const permissionList = await this.getPermissionList();
      this.permissionList = permissionList;
    } catch (err) {
      this.$toast.open({
          message: 'Something went wrong!',
          type: 'error',
          duration: 5000
      });
      console.log(err);
    }
  },
  computed: {
    isSaveBtnDisabled() {
      return (
        // !this.productDetails.image ||
        !this.role ||
        !this.roleType ||
        !this.description ||
        this.permissions === []
      )
    },
  },
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

.main-container {
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 100vh;
  overflow-y:auto;
}

.main-container::-webkit-scrollbar {
    display: none;
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

h1 {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
}

.content-container button {
    margin-top: 10px;
    width: 100px;
}

.input-user-details {
    display: flex;
    flex-direction: column;
    margin: 20px 0;
}

.field-label.is-normal {
    width: 100vw;
}

.buttons {
    display: flex;
    flex-direction: row;
}

.buttons button.is-link {
  background-color: #485FC7;
  color: #fff;
}

.buttons button.is-danger {
  background-color: #F05050;
}

header.modal-card-head p.modal-card-title {
  display: flex;
  justify-content: center;
}

ion-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #68DD62;
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