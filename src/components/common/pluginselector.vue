<template>
  <Select v-model="pluginName" remote filterable :placeholder="placeholder" @input="select()">
    <Option v-for="item in pluginNames" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
</template>
<script>


import kongadmin from '@/utils/kongadmin'

export default {
  name: "pluginselector",
  data() {
    return {
      pluginName:'',
      pluginNames:[{label:'test1',value:'test1'},{label:'test2',value:'test2'}]
    };
  },  props:['placeholder']
,
  created:function(){

     var success = function (response,component){
       console.log(response)
        //component.pluginNames = response.data.data
          var newdata = [];
          Object.keys(response.data.plugins.available_on_server).forEach(
            function(key) {
              newdata.push({
                label: key,
                value: key
              });
            }
          );
        component.pluginNames = newdata

     }

     var fail = function (response,component){

          component.$Message.info("get plugins name error!")
     }

    kongadmin.getAllPlugins(success,fail,this)
    
  },
  methods: {
        select(){
              this.$emit('input', this.pluginName)
    }
  }
};
</script>
<style scoped>
</style>
