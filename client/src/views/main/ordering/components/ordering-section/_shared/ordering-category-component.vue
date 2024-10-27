<template lang="pug">
.categories
    .content
        b-button(v-show="!mobileView" type="header" icon-right="silverware-fork-knife" expanded) CATEGORIES
        a(v-for="category in sortCategories" v-bind:key="category.category_id" v-bind:href="'#' + category.name") {{ category.name }}
</template>

<script>
import axios from 'axios';

export default {
    name: "OrderingCategoriesComponent",
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
        try {
            const productList = await this.getInventoryList();
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
                mobileView: true,
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
}
</script>

<style lang="scss" scoped>

.categories {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 170px;
    margin: 10px;
}


.categories button.header {
    display: flex;
    justify-content: space-between;
    background-color: #D6A062;
    color: white;
}

.categories .content a {
    display: flex;
    justify-content: flex-start;
    height: 40px;
    font-size: 15px;
    color: #4A4A4A;
    margin: 0;
    padding: 7px 16px;
    transition: 0.3s;
    border: 1px solid #cfcfcf;
    border-radius: 5px;
}

.categories .content a:hover {
    color: #D6A062;
    transition: 0.3s;
    text-decoration: none;
}

.categories .content a:focus {
    color: #D6A062;
    transition: 0.3s;
    text-decoration: none;
}

@media only screen and (max-width: 770px) {
 
 .categories{
    display: flex;
    overflow: auto;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: white;
  }

  .categories .content{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    min-width: 770px;
  }

  .categories .content a {
    display: flex;
    height: 30px;
    font-size: 15px;
    padding: unset;
    transition: 0.3s;
    border: unset;
  }

  .categories .content a:focus { 
    text-decoration: underline;
  }
  
}
</style>