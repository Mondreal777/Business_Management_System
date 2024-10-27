<template lang="pug">
header
  .page-title
    b-button(v-show="mobileView" @click="showSidebar()" size="is-large" icon-right="menu")
    h1.title {{ title }}
  div(v-show="!mobileView")
    .user-name Welcome, {{ userDetails.first_name }}!

</template>

<script>

import sidebar from './sidebar-component.vue'

export default {
  name: "header-component",
  props: ['title'],
  data() {
    return this.initData();
  },
  components:{
    sidebar
  },
  created() {
    const { userDetails } = this.$store.getters.getLoginDetails
    const { user_details } = userDetails;
    this.userDetails = user_details;
  },
  methods: {
    initData() {
        return {
          mobileView: true,
		  userDetails: null
        }
    },
    showSidebar() {
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
header{
  font-family: 'Poppins';
  height: 70px;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px;
  position: -webkit-sticky;
  position: sticky;
  z-index: 5;
}

.page-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 30px;
  font-weight: 600;
  margin-right: auto;
} 

.user-name {
  font-size: 25px;
  font-weight: 600;
  color: #00084E;
  margin-left: auto;
}

i, h1.title {
  font-size: 30px;
  padding-right: 15px;
  vertical-align: middle;
}

label {
  font-size: 30px;
}

ul {
  padding: 0;
}

.page-title button {
  border: none
}

@media only screen and (max-width: 770px) {

    Header h1.title{
      width: 100vw;
    }

}
</style>