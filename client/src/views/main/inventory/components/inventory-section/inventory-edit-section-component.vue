<template lang="pug">
body
  Sidebar(inventoryActive)
  .main-container
    Header(title="Inventory")
    main
      .content-container 
        h1 Edit Item
        b-button(
          size="is-small",
          type="is-link",
          icon-left="arrow-left",
          @click="navigateBack"
        ) Back
        .input-product-details
          b-field(label="Product No:") 
            b-input(
              v-model="inventoryDetails.productNo",
              placeholder="Input product no",
              size="is-small",
              required
            )
          b-field(label="Product Name:") 
            b-input(
              v-model="inventoryDetails.productName",
              placeholder="Input product name",
              size="is-small",
              required,
              maxlength='45'
            )
          b-field(label="Quantity:") 
            b-input(
              v-model="inventoryDetails.quantity",
              placeholder="Input Quantity",
              size="is-small",
              required,
              type="number"
              min="1"
            )
          b-field(label="Category:") 
            b-select(
              v-model="inventoryDetails.categoryId",
              placeholder="Select Category",
              size="is-small"
            )
              option(
                v-for="category in categories",
                :value="category.category_id"
              ) {{ category.name }}
          b-field(label="Expiry Date:")
            b-datepicker(
              v-model="date",
              :first-day-of-week="1",
              placeholder="Click to select...",
              size="is-small"
            )
          .buttons
            b-button(
              type="is-link",
              @click="saveInventoryDetails()",
              :disabled="isSaveBtnDisabled"
            ) Update
            b-button(type="is-danger", @click="navigateBack") Cancel

          b-modal.deleteModal(
            v-model="isSuccessModalActive",
            has-modal-card="",
            trap-focus="",
            :destroy-on-hide="false",
            aria-role="dialog",
            aria-label="Logout",
            close-button-aria-label="Close",
            aria-modal="",
            :overlay="false"
          )
            .modal-card(style="width: auto")
              header.modal-card-head
                p.modal-card-title Success!
                button.delete(
                  type="button",
                  @click="isSuccessModalActive = false"
                )
              section.modal-card-body
                ion-icon(name="checkmark-circle")
                b-field(label="You successfully UPDATED an item!")
              footer.modal-card-foot
                b-button(label="Okay", type="is-link", @click="navigateBack")
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
<script>
import axios from "axios";
import moment from "moment";
import Header from "../../../../_shared/components/header-component.vue";
import Sidebar from "../../../../_shared/components/sidebar-component.vue";
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
  name: "InventoryEditSectionComponent",
  components: {
    Header,
    Sidebar,
  },
  mixins: [loginMixins, auditTrailMixins],
  data() {
    return {
      item: [],
      categories: this.getCategories(),
      productID: null,
      date: null,
      updatedDate: null,
      isSuccessModalActive: false,
      inventoryDetails: {
        productName: null,
        productNo: null,
        quantity: null,
        categoryId: null,
        expiryDate: null,
        imageUrl: null,
        organizationId: 1
      },
      updatedInventoryDetails: {
        productName: null,
        productNo: null,
        quantity: null,
        categoryId: null,
        expiryDate: null,
      },
    };
  },
  async created() {
    this.checkLogin();
    this.productID = this.$store.getters.getProductId;
    const categoryList = await this.getCategories();
    
    this.categories = categoryList;
    this.setinventoryData();
  },
  computed: {
    isSaveBtnDisabled() {
      return (
        this.inventoryDetails.productNo ===
          this.updatedInventoryDetails.productNo &&
        this.inventoryDetails.productName ===
          this.updatedInventoryDetails.productName &&
        this.inventoryDetails.quantity ===
          this.updatedInventoryDetails.quantity &&
        this.inventoryDetails.categoryId ===
          this.updatedInventoryDetails.categoryId &&
        this.date === this.updatedDate || 
        !this.inventoryDetails.productNo ||
        !this.inventoryDetails.productName ||
        !this.inventoryDetails.quantity ||
        this.inventoryDetails.quantity < 1 ||
        !this.inventoryDetails.categoryId ||
        !this.date
      );
    },
  },
  methods: {
    async setinventoryData() {
      const inventoryDetails = await this.getItemData();
      this.inventoryDetails.productNo = inventoryDetails.inventoryData.product_no;
      this.inventoryDetails.productName = inventoryDetails.inventoryData.product_name;
      this.inventoryDetails.quantity = inventoryDetails.inventoryData.quantity;
      this.inventoryDetails.categoryId = inventoryDetails.inventoryData.category_id;
      this.date = new Date(inventoryDetails.inventoryData.expiry_date);

      this.updatedInventoryDetails.productNo = inventoryDetails.inventoryData.product_no;
      this.updatedInventoryDetails.productName = inventoryDetails.inventoryData.product_name;
      this.updatedInventoryDetails.quantity = inventoryDetails.inventoryData.quantity;
      this.updatedInventoryDetails.categoryId = inventoryDetails.inventoryData.category_id;
      this.updatedDate = this.date;
    },
    navigateBack() {
      this.$router.push("/inventory");
    },
    async getCategories() {
      const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/category-list`);
      const { categoryList } = res.data.results.data;
      return categoryList;
    },
    async getItemData() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/inventory/${this.productID}`
      );
      const inventoryDetail = res.data.results.data;
      return inventoryDetail;
    },
    async saveInventoryStocks(productId) {
      try {
        const quantity = this.inventoryDetails.quantity
        const res = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/save-inventory-stocks`, 
          { 
            stocksDetails: {
              productId,
              quantity
            } 
          }
        )
        
        console.log("res :: ", res);
      } catch (err) {
        console.log(err)
      }
    },
    async saveInventoryDetails() {
      try {
        this.inventoryDetails.expiryDate = moment(this.date).format(
          "YYYY-MM-DD hh:mm:ss"
        );
        const res = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/save-inventory-details`,
          {
            inventoryDetails: { productId: this.productID, ...this.inventoryDetails }
          }
        );
        this.saveInventoryStocks(this.productID);
        this.setinventoryData();
        console.log(res);
        this.$toast.open({
          message: "Product successfully saved!",
          type: "success",
          duration: 5000,
          // all of other options may go here
        });
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'Inventory', 'Update inventory', null, null);
      } catch (err) {
        this.$toast.open({
          message: "Something went wrong!",
          type: "error",
          duration: 5000,
        });
        console.log(err);
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
  width: 540px;
}

.field-label.is-normal {
  width: 100%;
}

.buttons {
  display: flex;
  flex-direction: row;
}

.buttons button.is-danger {
  background-color: #f05050;
}

header.modal-card-head p.modal-card-title {
  display: flex;
  justify-content: center;
}

ion-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #68dd62;
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