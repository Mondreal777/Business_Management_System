<template lang="pug">
body
  Sidebar(productsActive)
  .main-container
    Header(title="Products")
    main
      .content-container 
        h1 Add New Product
        b-button(
          size="is-small",
          type="is-link",
          icon-left="arrow-left",
          @click="navigateBack"
        ) Back
        .input-product-details
          form(method="post")
            b-field(label="Image:")
              input(@change="handleImage" class="custom-input" type="file" accept="image/*")
            b-field
              b-image(v-show="imageUrl" :src="imageUrl")
            b-field(label="Product Name:") 
              b-select(
                :disabled="disabledSelect",
                v-model="productDetails.productId",
                placeholder="Select Product Name",
                size="is-small"
              )
                option(v-for="item in items", :value="item.product_id") {{ item.product_name }}
            b-field(label="Product Description:") 
              b-input(
                v-model="productDetails.description",
                type="textarea",
                maxlength="200",
                placeholder="Input Description",
                size="is-small",
                required
              )
            b-field(label="Price(₱):") 
              b-input(
                v-model="productDetails.price",
                placeholder="Input Price",
                size="is-small",
                required,
                type="number"
              )
            .buttons
              b-button(type="is-link", @click="saveProductDetails" :disabled="isSaveBtnDisabled") Save
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
          button.delete(type="button", @click="isSuccessModalActive = false")
        section.modal-card-body
          ion-icon(name="checkmark-circle")
          b-field(label="Successfully added product!")
        footer.modal-card-foot
          b-button(label="Okay", type="is-link", @click="navigateBack")
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
<script>
import axios from "axios";

import Header from "../../../../_shared/components/header-component.vue";
import Sidebar from "../../../../_shared/components/sidebar-component.vue";
import { PRODUCT_MENU_STATUS } from '../../../../../constants/status/status';
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
  name: "InventoryAddSectionComponent",
  components: {
    Header,
    Sidebar,
  },
  mixins: [loginMixins, auditTrailMixins],
  data() {
    return {
      items: null,
      productDetails: {
        imageUrl: null,
        productId: null,
        description: null,
        price: null
      },
      imageUrl: null,
      disabledSelect: true,
      isSuccessModalActive: false,
      submitStatus: null,
    };
  },
  methods: {
    navigateBack() {
      this.$router.push("/products");
    },
    async getInventoryList() {
      const res = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/inventory/not-product/list`
      );

      const { inventoryList } = res.data.results.data;
      if (inventoryList.length === 0 || inventoryList === null) {
        this.disabledSelect = true;
      } else {
        this.disabledSelect = false;
      }
      return inventoryList;
    },
    async clearFields() {
      this.productDetails.imageUrl = null
      this.productDetails.productId = null
      this.productDetails.price = null
      this.productDetails.description = null
    },
    async updateInventoryToProductStatus() {
      try {
        await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/inventory/on-product/${this.productDetails.productId}`,
          {
            onProduct: PRODUCT_MENU_STATUS.ON_PRODUCTS
          }
        );
      } catch (err) {
        console.log(err);
      }
    },

    handleImage(e) {
      const selectedImage = e.target.files[0]; // get first file
      this.createBase64Image(selectedImage);
      // const imageUrl = URL.createObjectURL(selectedImage)
      
    },
    
    createBase64Image(fileObject) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imageUrl = e.target.result;
        this.productDetails.imageUrl = e.target.result;
      };
      reader.readAsDataURL(fileObject);
    },
    
    async saveProductDetails() {
      try {
        const res = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/product/save-details`,
          {
            productDetails: this.productDetails
          }
        );
        // const insertId = res.data.results.data.result;

        // this.productDetails.productId = insertId;

        console.log(this.productDetails.productId);
        
        await this.updateInventoryToProductStatus();
        this.clearFields();

        const inventoryList = await this.getInventoryList();
        this.items = inventoryList;

        this.$toast.open({
            message: 'Product successfully saved!',
            type: 'success',
            duration: 5000
            // all of other options may go here
        });
        this.isSuccessModalActive = true;
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'Products', 'Add products', null, null);
      } catch (err) {
        this.$toast.open({
            message: 'Something went wrong!',
            type: 'error',
            duration: 5000
        });
        console.log(err);
      }
    },
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1)
    }
  },
  async created() {
    try {
      this.checkLogin();
      const inventoryList = await this.getInventoryList();
      this.items = inventoryList;
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    isSaveBtnDisabled() {
      return (
        !this.productDetails.productId ||
        !this.productDetails.price ||
        !this.productDetails.description ||
        !this.productDetails.imageUrl
      )
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

.buttons button.is-link {
  background-color: #485fc7;
  color: #fff;
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

.custom-input button{
  border-radius: 50px;
}
</style>