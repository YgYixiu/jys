<template>
  <div class="filter-wrap" id="bgs">
    <div
        :class="['filter-item', {active: filter.type === activeFilter}]"
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
  data(){
    return {
      filters: [
        {
          name: 'forex',
          type: 0
        },
        {
          name: 'commodity',
          type: 1
        },
        {
          name: 'index',
          type: 2
        },
        {
          name: 'cryptocurrency',
          type: 3
        },
      ],
      activeFilter: 0
    }
  },
  mounted(){
    const tabIndex = Number(localStorage.getItem('tabIndex'))
    if(tabIndex){
      this.activeFilter = tabIndex
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
    handleFilter(obj){
      const {type} = obj
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
}
.filter-item{
  padding: 6px;
  white-space: nowrap;
  &.active{
    color: #00a4d8;
    border-bottom: 2px solid #1da2b4;
  }
}
</style>
