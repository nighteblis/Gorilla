<template>
  <Select v-model="consumerselector.consumerId"  filterable :placeholder="placeholder" @input="select()">
    <Option v-for="item in consumerselector.consumers" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
</template>
<script>


import kongadmin from '@/utils/kongadmin'

export default {
  name: "consumerselector",
  data() {
    return {
      consumerselector:{
      consumerId:'',
      consumers:[{label:'test1',value:'test1'},{label:'test2',value:'test2'}]
      }
    };
  },
  props:['placeholder']
,
  created:function(){

    console.log(this.consumers)

     var success = function (response,component){
       console.log(response)
        //component.pluginNames = response.data.data
          var newdata = [];
          response.data.data.forEach(
            function(data) {
              newdata.push({
                label: data.host,
                value: data.id
              });
            }
          );
        component.consumers = newdata

     }

     var fail = function (response,component){

          component.$Message.info("get services error!")
     }

    kongadmin.getConsumers(success,fail,this)
    
    console.log('=====created=========')

  },
  methods: {
    select(){
              this.$emit('input', this.consumerselector.consumerId)
    }
    
  }
};
</script>
<style scoped>
</style>
