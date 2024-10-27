<template lang="pug">
body
  Sidebar(userManagementActive)
  .main-container
    Header(title="Users")
    main
      .content-container 
        h1 Edit Users
        b-button.back(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-product-details
            form(method="post")
              b-field(label="Username:")              
                b-input(v-model='username' placeholder='Input Username' size='is-small' required)
              b-field(label="User Role")
                b-select(v-model='userRole' placeholder='Select Role' size='is-small')              
                  option(v-for="role in roles", :value="role.role_id") {{ role.role }}
              b-field(label="First Name")              
                b-input(v-model='firstname' placeholder='Input First Name' size='is-small' required)
              b-field(label="Last Name")              
                b-input(v-model='lastname' placeholder='Input Last Name' size='is-small' required)
              .buttons
                  b-button(type="is-danger" @click="navigateBack") Cancel
                  b-button(type="is-link" @click="saveUserDetails()" :disabled="isSaveBtnDisabled") Update User
                  
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
          b-field(label='Successfully updated user!')
        footer.modal-card-foot
          b-button(label='Okay' type="is-link" @click="navigateBack")
                  
  
  </template>
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
  <script>
  import axios from 'axios';
  import moment from 'moment'
  import Header from "../../../../_shared/components/header-component.vue"
  import Sidebar from "@/views/_shared/components/sidebar-component.vue"
  import { ORGANIZATION_ID } from "@/constants/enum/defaults.js"
  import loginMixins from "../../../../../mixins/login";
  import auditTrailMixins from "../../../../../mixins/audit-trail";

  export default {
    name: "usersEditSectionComponent",
    components: {
        Header,
        Sidebar
    },
    mixins: [loginMixins, auditTrailMixins],
    data() {
        this.checkLogin();
        return {
          item: [],
          username: null,
          userRole: null,
          userId: null,
          roles: [],
          firstname: null,
          lastname: null,
          isSuccessModalActive: false,
          submitStatus: null,
          old: {
            username: null,
            userRole: null,
            lastname: null,
            firstname: null
          }
        };
    },
    methods: {
        navigateBack() {
            this.$router.push('/user-management/users');
        },
        async getUserData(userId) {
          try {
            const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/user-details/${userId}`)
            const { userData } = res.data.results.data;
            return userData;
          } catch (err) {
            throw err;
          }
        },
        async setUserData() {
          const userData = await this.getUserData(this.userId);
          this.username = userData.username;
          this.lastname = userData.last_name;
          this.firstname = userData.first_name;
          this.userRole = userData.role_id;

          this.old.username = userData.username;
          this.old.lastname = userData.last_name;
          this.old.firstname = userData.first_name;
          this.old.userRole = userData.role_id;

        },
        async getRoleList() {
          try {
            const res = await axios.get(
              `${process.env.VUE_APP_API_BASE_URL}/role/list`
            );
  
            const { roleList } = res.data.results.data;
            return roleList;
          } catch (err) {
            throw err;
          }
        },
        async saveUserDetails() {
         await axios.post(
           `${process.env.VUE_APP_API_BASE_URL}/update-user`,
            {
              userId: this.userId,
              firstName: this.firstname,
              lastName: this.lastname,
              username: this.username,
              userRole: this.userRole,
              organizationId: ORGANIZATION_ID,
              status: 'A'
            }
          ).then(() => {
            this.isSuccessModalActive = true
            this.clearFields();
            this.setUserData();
            this.$toast.open({
                message: 'User successfully updated!',
                type: 'success',
                duration: 5000
                // all of other options may go here
            });
            var loginDetails = this.$store.getters.getLoginDetails
            this.saveAuditTrail(loginDetails["loginUserId"], 'Users', 'Update users', null, null); 
          }).catch(err => {
            this.$toast.open({
              message: `Something went wrong! \n${err}`,
              type: 'error',
              duration: 5000
            });
            console.error(err);
          });
        },
        clearFields() {
          this.username = null;
          this.lastname = null;
          this.userRole = null;
          this.username = null;
      },
    },
    async created() {
      try {
        this.userId = this.$store.getters.getUsersId;
        const roleList = await this.getRoleList();
        await this.setUserData();
        this.roles = roleList;
      } catch (err) {
        this.$toast.open({
            message: `Something went wrong! ${err}`,
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
          this.username === this.old.username &&
          this.userRole === this.old.userRole &&
          this.firstname === this.old.firstname &&
          this.lastname === this.lastname
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
  
  .content-container button.back {
      margin-top: 10px;
      width: 100px;
  }
  
  .input-product-details {
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