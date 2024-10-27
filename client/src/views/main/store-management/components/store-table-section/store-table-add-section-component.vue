<template lang="pug">
body
  Sidebar
  .main-container
    Header(title="Store Table")
    main
      .content-container 
        h1 Add New Table
        b-button(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-product-details
            form(method="post")
              b-field(label="Table Name:")              
                b-input(v-model='tableDetails.tableName' placeholder='Input table name' size='is-small' required)
              b-field(label="Table Numbers:")              
                b-input(v-model='tableDetails.tableNo' placeholder='Input table number' size='is-small' required type="number")
              b-field(label="Capacity:")              
                b-input(v-model='tableDetails.capacity' placeholder='Input Capacity' size='is-small' required type="number")
              .buttons
                  b-button(type="is-link" @click="saveNewTable()" :disabled="isSaveBtnDisabled") Save
                  b-button(type="is-danger" @click="navigateBack") Cancel

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
                                b-field(label='Successfully added new Table!')
                              footer.modal-card-foot
                                b-button(label='Okay' type="is-link" @click="navigateBack")
                

</template>

<script>
import axios from 'axios';
import Header from "../../../../_shared/components/header-component.vue"
import Sidebar from "../../../../_shared/components/sidebar-component.vue"
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

const storeTableURL = "http://localhost:3000/store_table"

export default {
    name: "StoreTableAddSectionComponent",
    components: {
        Header,
        Sidebar
    },
    mixins: [loginMixins, auditTrailMixins],
    data() {
        this.checkLogin()
        return {
			tableDetails: {
				tableNo: null,
        tableName: null,
				capacity: 0,
        occupancy: 'vacant',
			},
			isSuccessModalActive: false,
			submitStatus: null,
        };
    },
	computed: {
		isSaveBtnDisabled() {
			return (
				!this.tableDetails.tableName || !this.tableDetails.tableNo ||
				this.tableDetails.capacity === 0
			)
		},
	},
    methods: {
    	navigateBack() {
            this.$router.push('/store-management/tables');
        },
    	async saveNewTable() {
        	try {
				const res = await axios.post(
				`${process.env.VUE_APP_API_BASE_URL}/table/save`,
				{
					tableDetails: this.tableDetails
				}
				);
				const insertId = res.data.results.data.result;
				
				this.$toast.open({
					message: 'Successfully added new Table!',
					type: 'success',
					duration: 5000
					// all of other options may go here
				});
				this.isSuccessModalActive = true
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'Tables', 'Add tables', null, null);
			} catch(err) {
				this.$toast.open({
					message: `Something went wrong! ${err}`,
					type: 'error',
					duration: 5000
				});
				console.log(err);
			}
        }
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

h1 {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
}

.content-container button {
    margin-top: 10px;
    width: 100px;
}

.input-product-details {
    display: flex;
    flex-direction: column;
    margin: 20px auto 20px 20px;
    width: 540px
}

.field-label.is-normal {
    width: 100%;
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