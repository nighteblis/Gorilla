<template>
<div>

<Input v-model="userkey" placeholder="输入用户user_key" style="width: 300px" />

<Button type="primary" @click="handleSubmit(false)"> 查询用户业务锁 </Button>

</br>
<noticeinformation ref="noticeinformation"></noticeinformation>
</br>

<Table border :columns="columns" :data="data"></Table>
<Divider />


<Collapse v-model="value1">
        <Panel name="1">
            业务锁互斥关系
            <p slot="content" style="white-space: pre-line; text-align:left;">
账单还款 BILL_REPAY 与  “BILL_REPAY, ORDER_REPAY, ORDER_DERATE, ORDER_IN_BILL, BILL_MERGE”  互斥
订单还款 ORDER_REPAY 与  “BILL_REPAY, ORDER_REPAY, ORDER_DERATE, ORDER_IN_BILL, BILL_MERGE”  互斥
借款 LOAN 与  “BILL_REPAY, ORDER_REPAY, LOAN, ORDER_IN_BILL, BILL_MERGE”  互斥
订单减免 ORDER_DERATE 与  “BILL_REPAY, ORDER_REPAY, ORDER_DERATE, ORDER_IN_BILL, BILL_MERGE”  互斥
订单合并至账单 ORDER_IN_BILL 与  “BILL_REPAY, ORDER_REPAY, LOAN, ORDER_DERATE, ORDER_IN_BILL, BILL_MERGE”  互斥
合并账单 BILL_MERGE 与  “BILL_REPAY, ORDER_REPAY, LOAN, ORDER_DERATE, ORDER_IN_BILL, BILL_MERGE”  互斥


            </p>
        </Panel>
    </Collapse>


</div>
</template>
<script>

export default {
  name: 'businessLock',
  description:'清除业务锁',
  data () {
    return {
    value1:"1",

      msg: 'Welcome to Your Vue.js App',
      userkey:'',
      data:[],
      columns:[{
      title: '锁名称',
      key: 'key'
      },{
      title: '业务锁内容',
      key: 'value'
      },  {
            title: '操作',
            key: 'action',
            width: 350,
            align: 'center',
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                this.delrediskey(params)
                            }
                        }
                    }, '删除业务锁')
                ]);
            }

            }

            ]
    }
  },
  methods:{

delrediskey(params){

console.log(params)

  var uri = 'http://172.16.2.39:7280/api/redis/'+this.$store.state.selectedEnv+''
  console.log(uri)

  this.axios.post(uri,
   {"command":"del","arguments":""+params.row.key+""}
  )
  .then(response => {
  console.log(response)
  if(response.data.count <=0 || response.data.status != 0 ) {
     this.$refs.noticeinformation.showalert('alert',response.data.message)
  }
  else
  {
  this.$refs.noticeinformation.showalert('success','执行成功')
  this.handleSubmit(true)
  }
  })
  .catch(e => {

  console.log(e)

  })


},


handleSubmit(showoriginalalert){


console.log(this)
console.log("------")
console.log(this.$refs.noticeinformation)

if(this.userkey == ''){

this.$refs.noticeinformation.showalert('error','未输入用户user_key')

return
}


  console.log(this.$store.state.selectedEnv)

  var uri = 'http://172.16.2.39:7280/api/redis/'+this.$store.state.selectedEnv+''
  console.log(uri)

  this.axios.post(uri,
   {"command":"keys","arguments":"*BusinessLockService*"+this.userkey+"*"}
 )
 .then(response => {
 console.log(response)

 if( response.data.status != 0 ) {
     this.$refs.noticeinformation.showalert('error',response.data.message)
 }
 else
 {

if(!showoriginalalert)
this.$refs.noticeinformation.showalert('success','查询成功,不要轻易删除业务锁，除非你知道原因')
 this.data=response.data.data
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

code{



}

</style>
