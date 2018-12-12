<template>
  <div>
    <br>

    <noticeinformation ref="noticeinformation"></noticeinformation>

    <br>

    <Input v-model="billkey" placeholder="输入账单编号" style="width: 300px"/>

    <Button type="primary" @click="querybillloans()">查询账单下借款订单</Button>

    <Divider orientation="left">账单下所属订单借款查询结果</Divider>

    <Table border :columns="columns" :data="data"></Table>

    <Divider/>

    <Input v-model="partnerloanno" placeholder="输入三方借款编号" style="width: 300px"/>

    <Button type="primary" @click="queryloansbill()">查询所属的账单</Button>

    <Divider orientation="left">订单所属账单查询结果</Divider>

    <Table border :columns="columns2" :data="data2"></Table>
  </div>
</template>
<script>
export default {
  name: "billloanrelation",

  description: "订单账单关系查询",

  data() {
    return {
      msg: "Welcome to Your Vue.js App",

      partnerloanno: "",

      billkey: "",

      columns2: [
        { title: "账单代理编号", key: "proxy_serial_no" },
        { title: "主体", key: "pay_subject" },
        { title: "还款日", key: "bill_day" },
        { title: "账单账务Key", key: "account_bill_key" },
        { title: "状态", key: "status" }
      ],
      data2: [],
      data: [],

      columns: [
        { title: "三方借款编号", key: "partner_loan_no" },
        { title: "借款代理串号", key: "proxy_serial_no" },
        { title: "借款金额", key: "amount" },
        { title: "实际放款金额", key: "real_amount" },
        { title: "支付渠道", key: "pay_channel" },
        { title: "还款主体", key: "pay_subject" },
        { title: "账务借款Key", key: "account_serial_no" },
        { title: "账务检查结果", key: "account_check_status" },
        { title: "支付状态", key: "payment_confirm_status" },
        { title: "账务上报", key: "account_report_status" },
        {
          title: "备注",
          key: "comments",
          render: (h, params) => {
            return h("div", ["2:成功 0:初始化 1:处理中 其他:失败"]);
          }
        },

        {
          title: "操作",
          key: "action",
          width: 350,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.initpaymentstatus(params);
                    }
                  }
                },
                "初始化支付确认"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.initaccountreportstatus(params);
                    }
                  }
                },
                "初始化账务上报"
              )
            ]);
          }
        }
      ]
    };
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
        "/proxy"

      console.log(uri)

      this.axios
        .post(uri, {
          sql:
            "select * from user_loan where user_bill_id = ( select id from user_bill where proxy_serial_no = '" +
            this.billkey +
            "')"
        })

        .then(response => {
          console.log(response)

          if (response.data.status != 0) {
            this.$refs.noticeinformation.showalert(
              "error",
              response.data.message
            )
          } else {
            this.$refs.noticeinformation.showalert("success", "查询成功")

            this.data = response.data.data
          }
        })

        .catch(e => {
          console.log(e)
        })
    },

    queryloansbill() {
      if (this.partnerloanno == "") {
        this.$refs.noticeinformation.showalert("error", "未输入三方借款编号");

        return
      }

      var uri =
        "http://172.16.2.39:7280/api/sql/" +
        this.$store.state.selectedEnv +
        "/proxy"

      console.log(uri)

      this.axios
        .post(uri, {
          sql:
            "select * from user_bill where id = ( select user_bill_id from user_loan where partner_loan_no = '" +
            this.partnerloanno +
            "')"
        })

        .then(response => {
          console.log(response)

          if (response.data.status != 0) {
            this.$refs.noticeinformation.showalert(
              "error",
              response.data.message
            )
          } else {
            this.$refs.noticeinformation.showalert("success", "查询成功");

            this.data2 = response.data.data
          }
        })

        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
<style scoped>
code {
}
</style>
