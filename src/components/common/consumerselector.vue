<template>
  <Select v-model="consumerId" filterable>
    <Option v-for="item in consumers" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
</template>
<script>


import kongadmin from '@/utils/kongadmin'

export default {
  name: "consumerselector",
  data() {
    return {
      serviceId:'',
      services:[]
    };
  },
  created:function(){

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
    
  },
  methods: {
    
  }
};
</script>
<style scoped>
</style>
