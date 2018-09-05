<template>
    <div>
    
        <Input v-model="accountloankey" placeholder="输入账务借款Key" style="width: 300px" />

        <Button type="primary" @click="handleSubmit(false)"> 查询借款还款计划 </Button>
    
        <br/>
        <noticeinformation ref="noticeinformation"></noticeinformation>
        <br/>
        
        <Table border :columns="columns2" :data="data2"></Table>

        <Divider />
    
        <Table border :columns="columns" :data="data"></Table>
    
                
    </div>
</template>
<script>
    export default {
    
        name: 'accountqueryloanplan',
    
        data() {
    
            return {
    
    
    
                transformdate: '',
    
                msg: 'accountqueryloanplan',
    
                accountloankey: '',
    
                data: [],
    
                columns: [{
    
                        title: '期次',
    
                        key: 'period',
    
                        width: 50,
    
                        fixed: 'left'
    
                    },
    
                    {
    
                        title: '状态',
    
                        key: 'status',
    
                        fixed: 'left',
    
                        width: 100
    
                    },
    
                    {
    
                        title: '还款日',
    
                        key: 'due_date',
    
                        fixed: 'left',
    
                        width: 100
    
                    },
    
                    {
    
                        title: '还款类型',
    
                        key: 'repay_type',
    
                        fixed: 'left',
    
                        width: 80
    
                    },
    
                    {
    
                        title: '本金',
    
                        key: 'principal',
    
                        width: 90
    
                    },
    
                    {
    
                        title: '利息',
    
                        key: 'interest',
    
                        width: 100
    
                    },
    
                    {
    
                        title: '管理费',
    
                        key: 'mgmt_fee',
    
                        width: 90
    
                    },
    
                    {
    
                        title: '其他费用',
    
                        key: 'other_fee',
    
                        width: 100
    
    
    
                    },
    
                    {
    
                        title: '剩余本金',
    
                        key: 'left_principal',
    
                        width: 100
    
                    }, {
    
                        title: '剩余利息',
    
                        key: 'left_interest',
    
                        width: 100
    
                    },
    
                    {
    
                        title: '剩余管理费',
    
                        key: 'left_mgmt_fee',
    
                        width: 100
    
                    },
    
                    {
    
                        title: '剩余逾期利息',
    
                        key: 'left_overdue_interest',
    
                        width: 100
    
                    },
    
                    {
    
                        title: '剩余逾期管理费',
    
                        key: 'left_overdue_mgmt_fee',
    
                        width: 100
    
                    },
    
                    {
    
                        title: '减免本金',
    
                        key: 'derate_principal',
    
                        width: 100
    
                    }, {
    
                        title: '减免利息',
    
                        key: 'derate_interest',
    
                        width: 100
    
                    },
    
                    {
    
                        title: '减免管理费',
    
                        key: 'derate_mgmt_fee',
    
                        width: 100
    
                    },
    
                    {
    
                        title: '减免逾期利息',
    
                        key: 'derate_overdue_interest',
    
                        width: 100
    
                    },
    
                    {
    
                        title: '减免逾期管理费',
    
                        key: 'derate_overdue_mgmt_fee',
    
                        width: 100
    
                    },
    
    
    
    
    
                    {
    
                        title: '操作',
    
                        key: 'action',
    
                        width: 150,
    
                        align: 'center',
    
                        fixed: 'right',
    
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
    
                                            this.initjob(params)
    
                                        }
    
                                    }
    
                                }, '  '),
    
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
    
                                            this.failjob(params)
    
                                        }
    
                                    }
    
                                }, '  ')
    
                            ]);
    
                        }
    
                    }
    
    
    
    
    
                ],
    
                data2: [],
    
                columns2: [{
    
                        title: '金额',
    
                        key: 'amount'
    
                    },
    
                    {
    
                        title: '支付渠道',
    
                        key: 'pay_channel'
    
                    },
    
                    {
    
                        title: '借款状态',
    
                        key: 'status'
    
                    },
    
                    {
    
                        title: '总期数',
    
                        key: 'periods'
    
                    },
    
                    {
    
                        title: '剩余期数',
    
                        key: 'left_periods'
    
                    },
    
                    {
    
                        title: '是否锁定',
    
                        key: 'is_locked'
    
                    }
    
                ]
    
            }
    
        },
    
        methods: {
    
    
    
            changeDatetoString(date) {
    
    
    
    
    
                return new Date(date)
    
    
    
            },
    
    
    
    
    
    
    
    
    
            handleSubmit(showoriginalalert) {
    
    
    
                if (this.accountloankey == '') {
    
    
    
                    this.$refs.noticeinformation.showalert('error', '未输入账务借款key')
    
    
    
                    return
    
                }
    
    
    
    
    
                console.log(this)
    
                console.log(this.$selectedEnv)
    
    
    
                var uri = 'http://172.16.2.39:7280/api/sql/' + this.$store.state.selectedEnv + '/account'
    
                console.log(uri)
    
    
    
                this.axios.post(uri, {
    
                        "sql": "select * from repay_plan where loan_key = '" + this.accountloankey + "'"
    
                    })
    
                    .then(response => {
    
                        console.log(response)
    
    
    
                        if (response.data.status != 0) {
    
                            this.$refs.noticeinformation.showalert('error', response.data.message)
    
                        } else {
    
    
    
                            response.data.data.forEach(function(element) {
    
    
    
                                var convertdate = new Date(element.due_date)
    
    
    
                                element.due_date = convertdate.getFullYear() + '-' + convertdate.getMonth() + '-' + convertdate.getDate()
    
    
    
                            })
    
    
    
                            this.data = response.data.data
    
                        }
    
    
    
    
    
                    })
    
                    .catch(e => {
    
    
    
                        console.log(e)
    
    
    
                    })
    
    
    
                // select from user_loan Table
    
    
    
                uri = 'http://172.16.2.39:7280/api/sql/' + this.$store.state.selectedEnv + '/account'
    
                console.log(uri)
    
    
    
                this.axios.post(uri, {
    
                        "sql": "select * from loan where loan_key = '" + this.accountloankey + "'"
    
                    })
    
                    .then(response => {
    
                        console.log(response)
    
    
    
                        if (response.data.status != 0) {
    
                            this.$refs.noticeinformation.showalert('error', response.data.message)
    
                        } else {
    
    
    
                            if (!showoriginalalert)
    
                                this.$refs.noticeinformation.showalert('success', '查询成功')
    
    
    
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
    code {}
</style>
