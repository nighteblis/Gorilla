<template>
  <div>
    <noticeinformation ref="noticeinformation"></noticeinformation>

    <Tabs value="1">
      <TabPane name="1" label="服务器状态">
        <Table height="600" border :columns="serverstatus" :data="serverstatusdata"></Table>
      </TabPane>

      <TabPane name="2" label="插件状态">
        <Table height="600" border :columns="availableplugins" :data="availablepluginsdata"></Table>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>


import kongadmin from '@/utils/kongadmin'

export default {
  name: "dashboard",

  description: "仪表盘",

  data() {
    return {
      msg: "dashboard ",
      data: null,
      availableplugins: [
        { title: "插件", key: "plugin", width: 250 },
        { title: "启用状态", key: "enable" }
      ],
      availablepluginsdata: [],
      serverstatus: [
        { title: "项目", key: "item", width: 300 },
        {  title: "数值", key: "value"}
      ],
      serverstatusdata: []
    }
  },

  created: function() {


    var success = function(response, component) {
      console.log(component);
          console.log(response);
          component.data = response.data;
          console.log(component.data);
          var newdata = [];
          Object.keys(response.data.plugins.available_on_server).forEach(
            function(key) {
              newdata.push({
                plugin: key,
                enable: response.data.plugins.available_on_server[key]
              });
            }
          );

          component.availablepluginsdata = newdata;

          console.log(component.availablepluginsdata)

          newdata = [];

          Object.keys(response.data).forEach(function(key) {
            if (typeof response.data[key] != "object")
              newdata.push({ item: key, value: response.data[key] });
          });

          Object.keys(response.data.configuration).forEach(function(key) {
            if (typeof response.data.configuration[key] != "object")
              newdata.push({
                item: key,
                value: response.data.configuration[key]
              });
          });
          component.serverstatusdata = newdata;
          console.log(component.serverstatusdata)
          newdata = [];
    };

    var fail = function(response, component) {
 
      console.log(response);
      component.$refs.noticeinformation.showalert(
        "error",
        "kong 有异常请尽快修复"
      );
    };
    kongadmin.status(success, fail, this);

  },
  methods: {
    querybillloans() {
      if (this.billkey == "") {
        this.$refs.noticeinformation.showalert("error", "未输入账单编号");

        return;
      }

      var uri =
        "http://172.16.2.39:7280/api/sql/" +
        this.$store.state.selectedEnv +
        "/proxy";

      console.log(uri);

      this.axios
        .post(uri, {
          sql:
            "select * from user_loan where user_bill_id = ( select id from user_bill where proxy_serial_no = '" +
            this.billkey +
            "')"
        })

        .then(response => {
          console.log(response);

          if (response.data.status != 0) {
            this.$refs.noticeinformation.showalert(
              "error",
              response.data.message
            );
          } else {
            this.$refs.noticeinformation.showalert("success", "查询成功");

            this.data = response.data.data;
          }
        })

        .catch(e => {
          console.log(e);
        });
    },

    queryloansbill() {
      if (this.partnerloanno == "") {
        this.$refs.noticeinformation.showalert("error", "未输入三方借款编号");

        return;
      }

      var uri =
        "http://172.16.2.39:7280/api/sql/" +
        this.$store.state.selectedEnv +
        "/proxy";

      console.log(uri);

      this.axios
        .post(uri, {
          sql:
            "select * from user_bill where id = ( select user_bill_id from user_loan where partner_loan_no = '" +
            this.partnerloanno +
            "')"
        })

        .then(response => {
          console.log(response);

          if (response.data.status != 0) {
            this.$refs.noticeinformation.showalert(
              "error",
              response.data.message
            );
          } else {
            this.$refs.noticeinformation.showalert("success", "查询成功");

            this.data2 = response.data.data;
          }
        })

        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
<style scoped>
code {
}
</style>
