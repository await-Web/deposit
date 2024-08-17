<template>
	<view class="tool-v">
		<view class="statusBar" :style="{height:system.getStatusBarHeight()+'px'}"></view>
		<view class="tool-content">
			<view class="title">
				完美去水印
			</view>
			<view class="notice-bar-box">
				<uni-notice-bar show-icon :scrollable="scrollable" text="一键粘贴用不了,就手动粘贴.有问题联系客服" color="red" />
			</view>
			<view class="u-m-t-20 url-input">
				<uni-easyinput type="textarea" v-model="url" placeholder="此处粘贴视频分享链接"></uni-easyinput>
				<button class="u-m-t-16 btn" style="" @click="watermark">开始解析</button>
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
	</view>
</template>

<script>
	import {
		getVoucher,
		watermark
	} from "@/api/external.js";
	export default {
		data() {
			return {
				scrollable: true,
				url: ''
			}
		},
		onShareAppMessage() {
			return {
				title: '去水印',
				path: '/pages/index/tool'
			}
		},
		onLoad() {
			this.getVoucher()
		},
		methods: {
			getVoucher() {
				let data = {
					appid: '66bc5fb2a5d7e1241SihJ',
					appsecret: '6B0TruSB7SvwczwF4vZ0iTiOXPZOcJST'
				}
				getVoucher(data).then(res => {
					uni.setStorageSync('externalToken', res.data.token) || ''
				})
			},
			watermark() {
				let data = {
					link: url
				}
				watermark(data).then(res => {
					uni.downloadFile({
						url: res.data.videoSrc,
						success: (res) => {
							if (res.statusCode === 200) {
								uni.saveVideoToPhotosAlbum({
									filePath: res.tempFilePath,
									success: function() {
										uni.showToast({
											title: '保存成功',
											icon: 'none',
										});
									},
									fail: function(e) {
										console.log(e);
										uni.showToast({
											title: '保存失败',
											icon: 'none',
										});
									}
								});
							}
						}
					});
				})
			},
			share() {

				// uni.showShareMenu({
				// 	withShareTicket: true,
				// 	menus: ['shareAppMessage', 'shareTimeline'],
				// 	success: (res) => {
				// 		console.log(res, '分享菜单显示成功');
				// 	}
				// });

				// #ifdef MP-WEIXIN
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline']
				})
				// #endif



				// uni.share({
				// 	provider: "weixin",
				// 	scene: "WXSceneSession",
				// 	type: 1,
				// 	summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
				// 	success: function(res) {
				// 		console.log("success:" + JSON.stringify(res));
				// 	},
				// 	fail: function(err) {
				// 		console.log("fail:" + JSON.stringify(err));
				// 	}
				// });

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

			.notice-bar-box {
				border-radius: 40rpx;
				margin-top: 20rpx;

				::v-deep uni-notice-bar {
					.uni-noticebar {
						border-radius: 80rpx;
					}
				}

			}

			.url-input {
				.btn {
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