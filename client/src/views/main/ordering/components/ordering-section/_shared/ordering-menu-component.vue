<template lang="pug">
.menu
    section(v-for="category in sortCategories" v-bind:data="category" v-bind:key="category.category_id" :id="category.name")
        h1 {{ category.name }}
        hr(style="width:100%; height:2px;")
        .products(v-for="product in grouped[category.name]" v-bind:data="product" v-bind:key="product.name")
            .product
                .details
                    h2 {{ product.product_name }}
                    p ₱ {{ product.product_price }}
                    p {{ product.description }}
                .add-button
                    button.btn(@click="addItem(product.product_id)")
                        i.fa.fa-light.fa-plus
            hr(style="width:100%; height:1px;")
</template>

<script>
import axios from 'axios';
export default {
    name: "OrderingMenuComponent",
    components: {},
    directive: {},
    filters: {},
    mixins: [],
    props: {
        cart: []
    },
    data() {
        return this.initData();
    },
    watch: {},
    async created() {
        try {
            const productList = await this.getProductList();
            const categoryList = await this.getCategoryList();

            this.products = productList;
            this.categories = categoryList;
        } catch (e) {
            console.error(e);
        }
    },
    methods: {
        initData() {
            return {
                categories: [],
                products: [],
                cart: [],
            }
        },
        async getCategoryList() {
        const res = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/category-list`
        );

        const { categoryList } = res.data.results.data;
        return categoryList;
        },
        async getProductList() {
        const res = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/product/list`
        );

        const { inventoryList } = res.data.results.data;
        return inventoryList;
        },
        
        async addItem(product_id){
            try {
                const product = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/product/` + product_id);

                const productItem = product.data.results.data;

                const productId = productItem.productData.product_id;
                const productName = productItem.productData.product_name;
                const productDescription = productItem.productData.description;
                const productPrice = productItem.productData.product_price;
                let quantity = 1;

                if(this.cart.length !== 0) {
                    for (let item of this.cart) {
                        if(item.productId === productId) {
                            item.quantity++;
                            console.log('Add Quantity');
                        } else {
                            this.cart.push({productId, productName, productDescription, productPrice, quantity});
                            console.log('Add Item');
                        }
                    }
                } else {
                    this.cart.push({productId, productName, productDescription, productPrice, quantity});
                }

                
                this.$emit(this.cart);
                
                
            } catch (e) {
                console.error(e);
            }
            
        }

    },
    computed: {
        filteredProducts() {
            return this.products;
        },
        filteredCategories() {
            return this.categories;
        },
        grouped() {
        const groups = {};
        this.filteredProducts.forEach(product => {
            groups[product.category] = groups[product.category] || [];
            groups[product.category].push(product);
        })
        return groups;
        },
        sortCategories() {
        const categories = this.categories;
            return categories.sort((a, b) => (a.name > b.name) ? 1 : -1);
        }
    }

    // third party libraries
}

</script>

<style lang="scss" scoped>
.menu {
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    margin: 20px;
    max-width: 800px;
}

.menu h1 {
    font-size: 20px;
    font-weight: bold;
}

.menu h2 {
    font-size: 18px;
    font-weight: bold;
}

.products {
    margin-left: 10px;
}

.product {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 10px;
}

.product .btn {
    background-color: #D6A062; 
    border: none; 
    color: white; 
    font-size: 20px; 
    cursor: pointer; 
}

.product p {
    font-size: 15px;
}

@media only screen and (max-width: 770px) {

  .menu {
    transform: scale(1);
    transition: 0.3s;
  }

  .menu h1 {
    margin-top: 31px;
  }
}

@media only screen and (max-width: 470px) {

  .menu {
    transform: scale(1);
    transition: 0.3s;
  }

}
</style>