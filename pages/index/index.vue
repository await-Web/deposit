<template>
	<view class="index-v">
		<view class="">
			<home-head></home-head>
		</view>
		<view class="body">
			<view class="banner">
				<view class="banner-up">
					<view class="left">
						<view class="title-box">
							<view class="txt">今日存钱</view>
							<view class="txt money-symbol">￥：<text class="money-sty">{{todayTotalMoney}}</text>
							</view>
						</view>
						<view class="title-box">
							<view class="txt">累计存钱</view>
							<view class="txt">￥：<text class="money-sty">{{totalMoney}}</text></view>
						</view>
					</view>
					<view class="right">
						<image src="../../static/image/deposit.gif" mode="" class="right-image">
						</image>
					</view>
				</view>
				<view class="bottom-slogan">
					<!-- 距离暴富还有300天呦！加油宝子！你是最棒的! -->
					点击下方日历，开始存钱吧！
				</view>
			</view>

			<view class="" style="margin-top: 20rpx;">
				<uni-calendar class="uni-calendar--hook" :selected="calendar_data" :showMonth="false"
					@change="calendarChange" :start-date="tools.getYMD()" :endDate="tools.getYMD()" />
			</view>
		</view>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="存钱" v-model="money" placeholder="请输入存钱金额"
				@confirm="confirm" before-close @close="close"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	const currentUser = uniCloud.getCurrentUserInfo().uid
	const db = uniCloud.database();
	const dbCmd = db.command
	const depositTable = db.collection('deposit-sign-in')
	import homeHead from '@/components/homeHead.vue'
	export default {
		components: {
			homeHead
		},
		data() {
			return {
				info: '',
				money: '',
				calendar_data: [],
				check_ins: [],
				todayTotalMoney: 0,
				totalMoney: 0
			}
		},
		onShow() {
			this.init()
		},
		methods: {
			/* 初始化数据 */
			init() {
				uni.showLoading({
					title: '正在加载',
					mask: true
				})
				uniCloud.callFunction({
					name: 'initData',
					data: {
						user_id: currentUser
					}
				}).then(res => {
					this.close()
					let data = res.result.data || []
					this.calendar_data = data
					this.handleDeposit()
				});
			},
			/* 弹窗 */
			calendarChange() {
				this.$nextTick(() => {
					this.$refs.inputDialog.open()
				})
			},
			close() {
				this.$nextTick(() => {
					this.$refs.inputDialog.close()
				})
			},
			//新增
			async addData() {
				this.check_ins.push({
					money: this.money,
					info: '已存钱'
				})
				await depositTable.add({
					date: this.tools.getDate(new Date()).fullDate,
					info: '已存钱',
					calendar_data: this.check_ins
				})
				this.init()
			},
			/* 点击确认 */
			async confirm(e) {
				if (!Number(e)) return this.tools.toast('不可以输入汉字或小于1的数字')
				uni.showLoading({
					title: '正在存钱',
					mask: true
				})
				this.money = e
				if (this.calendar_data.length) {
					let curId = this.calendar_data[0]._id
					uniCloud.callFunction({
						name: 'updateDeposit',
						data: {
							id: curId,
							money: this.money
						}
					}).then(() => {
						this.init()
					});
				} else {
					this.addData()
				}
				uni.hideLoading()
			},
			/* 处理今日，累计存钱 */
			handleDeposit() {
				let arr = this.calendar_data
				let totalMoney = 0
				for (let i = 0; i < arr.length; i++) {
					let calendar = arr[i].calendar_data
					let today = arr[i].date
					const sum = calendar.reduce((acc, obj) => acc + Number(obj.money), 0);
					if (today === this.tools.getDate(new Date()).fullDate) this.todayTotalMoney = sum
					totalMoney += sum
				}
				this.totalMoney = totalMoney
				uni.hideLoading()
			}
		}
	}
</script>
<style lang="scss" scoped>
	.index-v {
		display: flex;
		flex-direction: column;
		/* #ifdef MP-WEIXIN */
		height: 100vh;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		height: calc(100vh - 2.85rem);
		/* #endif */
		background-color: $background-color
	}

	.body {
		flex: 1;
		overflow: hidden;
		padding: 0rpx 20rpx 20rpx 20rpx;

		.banner {
			width: 100%;
			height: 300rpx;
			background-color: #b1befc;
			border-radius: 20rpx;
			padding: 0 20rpx;

			.banner-up {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					.title-box {
						.txt {
							color: #fff;
							font-size: 28rpx;

							.money-sty {
								font-size: 32rpx;
								color: #ecef67;
							}

						}

						.money-symbol {
							margin-bottom: 28rpx;
						}
					}
				}

				.right {
					width: 220rpx;
					height: 220rpx;

					.right-image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.bottom-slogan {
				margin-top: 20rpx;
				color: #fffc80;
				font-size: 34rpx;
				text-align: center;
				font-weight: bold;
				font-family: cursive;
			}
		}
	}
</style>