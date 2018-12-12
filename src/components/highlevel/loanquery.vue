<template>
  <div>
    <Input v-model="partnerloanno" placeholder="三方借款编号" style="width: 300px"/>

    <Button type="primary" @click="handleSubmit(false)">查询</Button>
    <Divider/>
    <Alert
      type="success"
      v-if="alert.success.display"
      @on-close="closealert($event)"
      show-icon
    >{{alert.success.message}}</Alert>
    <Alert
      type="warning"
      v-if="alert.warning.display"
      @on-close="closealert($event)"
      show-icon
    >{{alert.warning.message}}</Alert>
    <Alert
      type="error"
      v-if="alert.error.display"
      @on-close="closealert($event)"
      show-icon
    >{{alert.error.message}}</Alert>

    <Table border :columns="userloancolumns" :data="userloandata"></Table>
    <Divider orientation="left">借款流程Job查询结果</Divider>

    <Table border :columns="columns" :data="data"></Table>
  </div>
</template>
<script>
export default {
  name: "loanquery",
  lable: "借款Job查询",
  data() {
    return {
      alert: {
        success: {
          display: false,
          message: ""
        },
        warning: {
          display: false,
          message: ""
        },
        error: {
          display: false,
          message: ""
        }
      },
      partnerloanno: "",
      userloandata: [],
      userloancolumns: [
        { title: "借款代理串号", key: "proxy_serial_no" },
        { title: "账单编号", key: "bill_proxy_serial_no" },
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
            return h("div", ["2:成功 0:初始化 1:处理中 其他:失败"])
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
                      this.initpaymentstatus(params)
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
                      this.initaccountreportstatus(params)
                    }
                  }
                },
                "初始化账务上报"
              )
            ]);
          }
        }
      ],
      data: [],
      columns: [
        {
          title: "JobId",
          key: "id"
        },
        {
          title: "Job名称",
          key: "machine_status"
        },
        {
          title: "代理串号",
          key: "proxy_serial_no"
        },
        {
          title: "Job状态",
          key: "job_status"
        },
        {
          title: "错误",
          key: "last_error"
        },
        {
          title: "执行次数",
          key: "execute_times"
        },
        {
          title: "job参数",
          key: "job_param"
        },
        {
          title: "操作",
          key: "action",
          width: 200,
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
                      this.initjob(params)
                    }
                  }
                },
                "重新执行"
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
                      this.failjob(params)
                    }
                  }
                },
                "置为失败"
              )
            ]);
          }
        }
      ]
    };
  },

  methods: {
    closealert(event) {
      console.log(event)
    },

    initpaymentstatus(params) {
      var uri =
        "http://172.16.2.39:7280/api/sql/" +
        this.$store.state.selectedEnv +
        "/proxy"
      console.log(uri)

      this.axios
        .post(uri, {
          sql:
            "update  user_loan  set payment_confirm_status = 0, payment_confirm_time=null where proxy_serial_no ='" +
            params.row.proxy_serial_no +
            "'"
        })
        .then(response => {
          console.log(response)
          if (response.data.count <= 0 || response.data.status !== 0) {
            this.showalert("alert", response.data.message)
          } else {
            this.showalert("success", "执行成功")
            this.handleSubmit(true)
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    initaccountreportstatus(params) {
      var uri =
        "http://172.16.2.39:7280/api/sql/" +
        this.$store.state.selectedEnv +
        "/proxy"
      console.log(uri)

      this.axios
        .post(uri, {
          sql:
            "update  user_loan  set account_report_status = 0,account_report_time=null where proxy_serial_no ='" +
            params.row.proxy_serial_no +
            "'"
        })
        .then(response => {
          console.log(response)
          if (response.data.count <= 0 || response.data.status !== 0) {
            this.showalert("alert", response.data.message)
          } else {
            this.showalert("success", "执行成功")
            this.handleSubmit(true)
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    showalert(alert, message) {
      this.alert.success.display = false
      this.alert.warning.display = false
      this.alert.error.display = false
      this.alert[alert].message = message
      this.alert[alert].display = true
    },

    disappearalert(alert) {
      this.alert[alert].display = false
    },

    initjob(params) {
      console.log(params.row.id)
      var uri =
        "http://172.16.2.39:7280/api/sql/" +
        this.$store.state.selectedEnv +
        "/proxy"
      console.log(uri)

      this.axios
        .post(uri, {
          sql:
            "update  job  set job_status = 0,last_error = '手动修改为0重新执行' where id =" +
            params.row.id +
            ""
        })
        .then(response => {
          console.log(response)
          if (response.data.count <= 0 || response.data.status !== 0) {
            this.showalert("alert", response.data.message)
          } else {
            this.showalert("success", "执行成功")
            this.handleSubmit(true)
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    failjob(params) {
      console.log(params.row.id)
      var uri =
        "http://172.16.2.39:7280/api/sql/" +
        this.$store.state.selectedEnv +
        "/proxy"
      console.log(uri)

      this.axios
        .post(uri, {
          sql:
            "update  job  set job_status = -1 ,last_error = '手动修改为-1' where id =" +
            params.row.id +
            ""
        })
        .then(response => {
          console.log(response)
          if (response.data.count <= 0 || response.data.status !== 0) {
            this.showalert("alert", response.data.message)
          } else {
            this.showalert("success", "执行成功")
            this.handleSubmit(true)
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    handleSubmit(showoriginalalert) {
      if (this.partnerloanno == "") {
        this.showalert("error", "未输入三方借款编号或者账单编号")

        return
      }

      console.log(this)
      console.log(this.$selectedEnv)

      var uri =
        "http://172.16.2.39:7280/api/sql/" +
        this.$store.state.selectedEnv +
        "/proxy"
      console.log(uri)

      this.axios
        .post(uri, {
          sql:
            "select * from job where proxy_serial_no = (select proxy_serial_no from user_loan where partner_loan_no = '" +
            this.partnerloanno +
            "')"
        })
        .then(response => {
          console.log(response)

          if (response.data.status != 0) {
            this.showalert("error", response.data.message)
          } else {
            if (!showoriginalalert) this.showalert("success", "查询成功")
            this.data = response.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
      // select from user_loan Table

      uri =
        "http://172.16.2.39:7280/api/sql/" +
        this.$store.state.selectedEnv +
        "/proxy"
      console.log(uri)

      this.axios
        .post(uri, {
          sql:
            "select * from ( select ul.*,ub.proxy_serial_no as bill_proxy_serial_no from ( select * from user_loan where partner_loan_no = '" +
            this.partnerloanno +
            "') as ul  left join  user_bill ub on ul.user_bill_id = ub.id ) as newtable "
        })
        .then(response => {
          console.log(response)

          if (response.data.status !== 0) {
            this.showalert('error', response.data.message)
          } else {
            if (!showoriginalalert) this.showalert('success', '查询成功')

            this.userloandata = response.data.data
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
</style>
