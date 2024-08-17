<template>
	<view class="tool-v">
		<view class="statusBar" :style="{height:system.getStatusBarHeight()+'px'}"></view>
		<view class="tool-content">
			<view class="title">
				完美去水印
			</view>

			<view class="u-m-t-20 url-input">
				<uni-easyinput type="textarea" v-model="url" placeholder="此处粘贴视频分享链接" :clearable="true"></uni-easyinput>
				<view class="u-flex">
					<button class="u-m-t-16 btn" style="" @click="getWatermarkCount">开始解析</button>
					<button class="u-m-t-16 btn" style="" type="warn" @click="url = ''">清空</button>
				</view>

			</view>
			<view class="u-flex del-watermark">
				<view class="course u-flex-col block">
					<text class="txt-top">使用教程</text>
					<text class="txt-bottom">如何去水印</text>
				</view>
				<view class="invitation u-flex-col block">
					<text class="txt-top">邀请好友</text>
					<text class="txt-bottom">获取永久会员</text>
				</view>
			</view>
			<view class="share u-flex-col" @click="share">
				<view class="u-flex share-inner">
					<image src="../../static/image/wx.png" mode=""></image>
					<text class="u-m-l-10 u-m-r-10 u-font-30">分享给好友，共同解锁有趣的视频</text>
					<button type="primary" size="mini">分享</button>
				</view>
			</view>
			<view class="statement">视频归平台及作者所有，本应用不储存任何视频及图片</view>
		</view>
		<AnalysisDetial ref="AnalysisDetial" :detialData="detialData" v-model="showAnalysisDetial"></AnalysisDetial>
	</view>
</template>

<script>
	import {
		getVoucher,
		watermark
	} from "@/api/external.js";
	import AnalysisDetial from '../components/AnalysisDetial.vue'
	export default {
		components: {
			AnalysisDetial
		},
		data() {
			return {
				url: '',
				detialData: {},
				showAnalysisDetial: false
			}
		},
		onShareAppMessage() {
			return {
				title: '去水印',
				path: '/pages/index/tool'
			}
		},
		computed: {
			currentUser() {
				let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo') || {}
				return hostUserInfo._id
			}
		},
		onLoad() {
			this.getVoucher()
		},
		methods: {
			//获取接口调用凭据
			getVoucher() {
				let data = {
					appid: '66bc5fb2a5d7e1241SihJ',
					appsecret: '6B0TruSB7SvwczwF4vZ0iTiOXPZOcJST'
				}
				getVoucher(data).then(res => {
					uni.setStorageSync('externalToken', res.data.token) || ''
				})
			},
			//获取次数
			getWatermarkCount() {
				uniCloud.callFunction({
					name: 'getWatermark',
					data: {
						user_id: this.currentUser
					},
				}).then(res => {
					console.log(854, res);
				});
			},

			//短视频解析
			watermark() {
				let data = {
					link: this.url
				}
				watermark(data).then(res => {
					let data = JSON.parse(JSON.stringify(res.data)) || {}
					let imgUrl = data.imageSrc.split(":")
					this.detialData = {
						...data,
						imageSrc: imgUrl[0] + 's:' + imgUrl[1]
					}
					this.showAnalysisDetial = true
				}).catch(err => {})
			},
			//分享
			share() {
				// #ifdef MP-WEIXIN
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline']
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f0f2f6;
	}

	.tool-v {
		width: 100%;
		height: 100%;
		padding: 0 20rpx;

		.tool-content {
			.title {
				width: 100%;
				height: 80rpx;
				text-align: center;
				font-size: 36rpx;
				line-height: 80rpx;

			}

			.url-input {
				.btn {
					width: 46%;
					background-color: #16afc3;
					color: #fff;
				}
			}

			.del-watermark {
				width: 100%;
				justify-content: space-between;
				margin-top: 20rpx;

				.block {
					width: 350rpx;
					height: 160rpx;
					background-color: blue;
					color: #fff;
					border-radius: 20rpx;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;

					.txt-top {
						font-size: 46rpx;
					}

					.txt-bottom {
						font-size: 28rpx;
					}
				}

				.course {
					background-color: blue;
				}

				.invitation {
					background-color: red;
				}
			}

			.share {
				.share-inner {
					image {
						width: 84rpx;
						height: 84rpx;
					}
				}

				width: 100%;
				height: 180rpx;
				margin-top: 20rpx;
				border-radius: 20rpx;
				background: radial-gradient(60% 200px at right top, #19b2bc, transparent),
				radial-gradient(20% 200px at left top, #0a96e4, transparent),
				radial-gradient(80% 200px at left top, #048af4, transparent);
				color: #fff;
				justify-content: center;
				align-items: center;
			}

			.statement {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				color: red;
			}
		}
	}
</style>