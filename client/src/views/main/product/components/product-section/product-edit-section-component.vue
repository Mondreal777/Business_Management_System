<template lang="pug">
body
  Sidebar(productsActive=true)
  .main-container
    Header(title="Products")
    main
      .content-container 
        h1 Edit New Product
        b-button(size="is-small" type="is-link" icon-left="arrow-left" @click="navigateBack") Back
        .input-product-details
            form(method="post")
              b-field(label="Image:")
                input(@change="handleImage" class="custom-input" type="file" accept="image/*")
              b-field
                b-image(v-show="imageUrl && !this.productDetails.imageUrl" :src="imageUrl")
                b-image(v-show="this.productDetails.imageUrl" :src="this.productDetails.imageUrl")
              b-field(label="Product Name:")
                b-input(v-model='productDetails.productName' disabled)
              b-field(label="Product Description:")              
                b-input(v-model='productDetails.description' type="textarea" maxlength="200" placeholder='Input Description' size='is-small' required)
              b-field(label="Price(₱):")              
                b-input(v-model='productDetails.price' placeholder='Input Price' size='is-small' required type="number")
            .buttons
                b-button(type="is-link", @click="saveProductDetails" :disabled="isSaveBtnDisabled") Save
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
                        b-field(label='Successfully updated product!')
                      footer.modal-card-foot
                        b-button(label='Okay' type="is-link" @click="navigateBack")
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
<script>
import axios from 'axios';
import Header from "../../../../_shared/components/header-component.vue"
import Sidebar from "../../../../_shared/components/sidebar-component.vue"
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
name: "InventoryEditSectionComponent",
components: {
    Header,
    Sidebar
},
mixins: [loginMixins, auditTrailMixins],
data() {
    return {
      productDetails: {
        productName: null,
        imageUrl: null,
        productId: null,
        description: null,
        price: null
      },
      currentDetails: {
        productName: null,
        imageUrl: null,
        productId: null,
        description: null,
        price: null
      },
      imageUrl: null,
      disabledSelect: true,
      isSuccessModalActive: false,
      submitStatus: null
    };
},
async created() {
  try {
    this.checkLogin();
    this.productDetails.productId = this.$store.getters.getProductId;
    console.log("this.productDetails.productId ::> ", this.productDetails.productId);

    this.setInventoryData();
  } catch (err) {
    console.log(err);
  }
},
methods: {
  navigateBack() {
      this.$router.push('/products');
  },

  async getProductData() {
    try {
      const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product/${this.productDetails.productId}`);

      const { productData } = res.data.results.data;
      return productData;
    } catch (err) {
      console.log(err);
    }
  },

  async setInventoryData() {
    const productData = await this.getProductData();
    this.productDetails.imageUrl = productData.image_url;
    this.productDetails.description = productData.description;
    this.productDetails.price = productData.product_price;
    this.productDetails.productName = productData.product_name;
    console.log(productData.image_url);

    this.currentDetails.imageUrl = productData.image_url;
    this.currentDetails.description = productData.description;
    this.currentDetails.price = productData.product_price;
    this.currentDetails.productName = productData.product_name;
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
      console.log(this.productDetails.imageUrl);
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
      const insertId = res.data.results.data.result;

      this.setInventoryData();
      this.$toast.open({
          message: 'Product successfully saved!',
          type: 'success',
          duration: 5000
          // all of other options may go here
      });
      this.isSuccessModalActive = true;
      var loginDetails = this.$store.getters.getLoginDetails
      this.saveAuditTrail(loginDetails["loginUserId"], 'Products', 'Update products', null, null);
    } catch (err) {
      this.$toast.open({
          message: 'Something went wrong!',
          type: 'error',
          duration: 5000
      });
      console.log(err);
    }
  },
},
computed: {
  isSaveBtnDisabled() {
    return (
      this.productDetails.imageUrl === this.currentDetails.imageUrl &&
      this.productDetails.description === this.currentDetails.description &&
      this.productDetails.price === this.currentDetails.price
    )
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