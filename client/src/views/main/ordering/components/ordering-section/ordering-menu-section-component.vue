<template lang="pug">
body
    header
        Header
    Categories(v-show="mobileView")        
    main
        Categories(v-show="!mobileView")        
        .menu
            section(v-for="category in sortCategories" v-bind:data="category" v-bind:key="category.category_id" :id="category.name")
                h1 {{ category.name }}
                hr(style="width:100%; height:2px;")
                .products(v-for="product in grouped[category.name]" v-bind:data="product" v-bind:key="product.name")
                    .product
                        .image
                            img(:src="product.image_url")
                        .details
                            h2.product-name {{ product.product_name }}
                            p.product-price Php {{ product.product_price }}
                            p.description {{ product.description }}
                        .add-button
                            button.btn(@click="addItem(product.product_id)")
                                i.fa.fa-light.fa-plus
                    hr(style="width:100%; height:1px;")
        Cart(v-show="!mobileView" :cart="cart")
    Cart(v-show="mobileView" :cart="cart")
</template>

<script>
import axios from 'axios';
import Header from '@/views/main/ordering/components/ordering-section/_shared/ordering-header-component';
import Categories from '@/views/main/ordering/components/ordering-section/_shared/ordering-category-component';
import Menu from '@/views/main/ordering/components/ordering-section/_shared/ordering-menu-component';
import Cart from '@/views/main/ordering/components/ordering-section/_shared/ordering-cart-component';
import loginMixins from "../../../../../mixins/login";

export default {
    name: "OrderingMenuSection",
    components: {
        Header,
        Categories,
        Menu,
        Cart
    },
    directive: {},
    filters: {},
    mixins: [loginMixins],
    props: {},
    data() {
        return this.initData();
    },
    watch: {},
    async created() {
        try {
            this.checkLogin();
            const productList = await this.getInventoryList();
            const categoryList = await this.getCategoryList();

			this.tableId = this.$store.getters.getTableId;
			this.orderType = this.$store.getters.getOrderType;
			console.log(this.tableId);
			console.log(this.orderType);

            this.products = productList;
            this.categories = categoryList;

			this.cart = this.$store.getters.getCartItems;
        } catch (e) {
            console.error(e);
        }
    },
    methods: {
        initData() {
            return {
                categories: [],
                products: [],
                cart:[],
                mobileView: true,
				tableId: null,
				orderType: null
            }
        },
        async getCategoryList() {
        const res = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/category-list`
        );

        const { categoryList } = res.data.results.data;
        return categoryList;
        },
        async getInventoryList() {
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
				let ctr = 0;
				console.log("cart current ::> ", this.cart)
				if (this.cart.length !== 0) {
					for (let item of this.cart) {
						if(item.productId === productId) {
							item.quantity++;
							console.log('Add Quantity');
							ctr++
						}
					}

					if (ctr === 0) {
						await this.cart.push({productId, productName, productDescription, productPrice, quantity});
						console.log('Add Item');
					}
				} else {
					await this.cart.push({productId, productName, productDescription, productPrice, quantity});
					console.log('123');
				}
				
			} catch (e) {
				console.error(e);
			}
			
		},

        onResize() {
          this.mobileView = window.innerWidth < 770;
        },
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

    // third party libraries
}
</script>

<style lang="scss" scoped>

body {
    font-family: 'Poppins';
    height: 100vh;
    overflow: auto;
    scroll-behavior: smooth;
}

main {
   display: flex;
   flex-direction: row;
   padding: 30px;
   overflow: auto;
}

.menu {
    display: flex;
    flex-direction: column;
    flex-grow: 3;
    margin: 20px;
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
    align-items: center;
    margin-right: 10px;
}

.image {
    margin-right: 30px;
}

.details {
    margin-right: auto;
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

.product .image {
    min-width: 80px;
}

.product img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 15px;
    padding: 5px;
    display: block;
}

h2.product-name {
    margin-bottom: 10px;
}

p.description {
    display: flex;
    flex-wrap: wrap;
    padding-right: 10px;
}


@media only screen and (max-width: 470px) {

  .menu {
    transform: scale(1);
    transition: 0.3s;
  }

}



@media only screen and (max-width: 770px) {
    header .header-container {  
        height: 150px;
    }
    
    main {
        display: flex;
        flex-direction: column;
        padding: 0 0 100px 0;
    }

    .menu {
        transform: scale(1);
        transition: 0.3s;
    }

    .menu h1 {
        margin-top: 31px;
    }

    
}

</style>