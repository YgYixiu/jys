<template>
  <div :class="['filter-wrap',{large: size === 'large'}]" id="bgs">
    <div
        :class="['filter-item', {active: filter.value === activeFilter}, {underline: underline}]"
        v-for="filter in filters" :key="filter.name"
        @click="handleFilter(filter)"
    >
      {{ $t('home')[filter.name] }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterBar',
  props:{
    size: {
      type: String,
      default: ''
    },
    underline: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      filters: [
        // {
        //   name: 'forex',
        //   type: 0
        // },
        // {
        //   name: 'commodity',
        //   type: 1
        // },
        // {
        //   name: 'index',
        //   type: 2
        // },
        // {
        //   name: 'cryptocurrency',
        //   type: 3
        // },
      ],
      activeFilter: 0
    }
  },
  async mounted(){
    await this.getTabs()
    const tabIndex = Number(localStorage.getItem('tabIndex'))
    if(tabIndex){
      this.activeFilter = tabIndex
    } else{
      const firstTab = this.filters[0]
      localStorage.setItem('tabIndex', firstTab.value)
    }
  },
  watch: {
    activeFilter:{
      handler: function (val){
        this.$emit('change', val)
      },
      immediate: true
    }
  },
  methods:{
    getTabs(){
      return this.$http.get("/api/currency/type").then((res)=>{
        const {type,message} = res.data
        if(type === 'ok'){
          const intlKeys = ['forex', 'commodity', 'index', 'cryptocurrency']
          this.filters = message.sort((a,b)=>a.sort-b.sort).map(item=>{
            item.name = intlKeys[item.value]
            return item
          })
        }
      })
    },
    handleFilter(obj){
      const {value:type} = obj
      this.activeFilter = type
      localStorage.setItem('tabIndex', type)
    },
  }
}
</script>

<style lang="scss" scoped>
.filter-wrap{
  padding: 10px 10px;
  overflow-x: auto;
  width: 100%;
  flex-wrap: nowrap;
  font-size: 12px;
  color: #c7cce6;
  display: flex;
  // align-items: center;
  // justify-content: space-between;
  &.large{
    font-size: 16px;
    .filter-item{
      padding: 6px 20px;
    }
  }
}
.filter-item{
  padding: 6px;
  white-space: nowrap;
  &.active{
    color: #00a4d8;
    &.underline{
      border-bottom: 2px solid #1da2b4;
    }
  }
}
</style>
