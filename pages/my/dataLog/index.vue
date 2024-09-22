<template>
	<view class="dataLog-v">
		<view class="dataLog-tabs u-m-t-20">
			<u-tabs :list="list" :is-scroll="false" v-model="current" @change="change"></u-tabs>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '我喜欢的'
				}, {
					name: '别人喜欢的'
				}],
				current: 0
			}
		},
		computed: {
			currentUser() {
				let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo') || {}
				return hostUserInfo._id
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			/* 初始化数据 */
			async init() {
				this.money = ''
				// uni.showLoading({
				// 	title: '正在加载',
				// 	mask: true
				// })
				uniCloud.callFunction({
					name: 'getDataLog',
					data: {
						user_id: this.currentUser
					},
				}).then(res => {
					// this.close()
					let data = res.result.data || []
					console.log(data, 333);
					// this.calendar_data = data
					// this.handleDeposit()
				});
			},
			change() {

			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.dataLog-v {
		.dataLog-tabs {
			background-color: red;
			width: 100%;
			height: 100%;
		}
	}
</style>