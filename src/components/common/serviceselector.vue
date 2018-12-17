<template>
  <Select v-model="serviceId" filterable>
    <Option v-for="item in services" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
</template>
<script>


import kongadmin from '@/utils/kongadmin'

export default {
  name: "serviceselector",
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
        component.services = newdata

     }

     var fail = function (response,component){

          component.$Message.info("get services error!")
     }

    kongadmin.getServices(success,fail,this)
    
  },
  methods: {
    
  }
};
</script>
<style scoped>
</style>
