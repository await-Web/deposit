<template>
	<view class="tool-v">
		<view class="statement u-text-center u-m-t-20">所有视频,图片归平台及作者所有，本应用不储存任何内容</view>
		<!-- 	<view class="wrap">
			<u-swiper :list="list"></u-swiper>
		</view> -->
		<view class="u-m-b-20 u-m-t-20">
			<ad-custom unit-id="adunit-82d9c74417201fca" ad-intervals="30"></ad-custom>
		</view>
		<view class="tool-content">
			<view class="u-m-t-20 url-input">
				<kxSwitch @change="switchChange"></kxSwitch>
				<kxInput v-model="url" placeholder="此处粘贴视频分享链接" addonAfter="批量解析" @afterClick="authorWorkWatermark"
					v-if="isBach" />
				<kxInput v-model="url" placeholder="此处粘贴视频分享链接" addonAfter="解析" @afterClick="watermark" v-else />
			</view>
			<view class="apply-list">
				<view class="part">
					<view class="caption u-line-1">
						更多功能
					</view>
					<view class="item-box">
						<view class="u-flex u-flex-wrap">
							<view class="item u-flex-col u-col-center" @click="jumWebview('1')">
								<text class="u-font-40 item-icon icon-kx icon-kx-check-circle"
									:style="{ background:  '#00ff00' }" />
								<text class="u-font-24 u-line-1 item-text">无广告版</text>
							</view>
							<view class="item u-flex-col u-col-center" @click="jumWebview('2')">
								<text class="u-font-40 item-icon icon-kx icon-kx-bizhi3"
									:style="{ background:  '#55ffff' }" />
								<text class="u-font-24 u-line-1 item-text">更多壁纸</text>
							</view>
							<view class="item u-flex-col u-col-center" @click="jumWebview('3')">
								<text class="u-font-40 item-icon icon-kx icon-kx-MD51"
									:style="{ background:  '#008cff' }" />
								<text class="u-font-24 u-line-1 item-text">修改MD5</text>
							</view>
							<view class="item u-flex-col u-col-center" @click="jumWebview('4')">
								<text class="u-font-40 item-icon icon-kx icon-kx-jilu_"
									:style="{ background:  '#f2b0ff' }" />
								<text class="u-font-24 u-line-1 item-text">使用教程</text>
							</view>
							<view class="item u-flex-col u-col-center">
								<button class="shareBtn" open-type="share">
									<text class="item-icon icon-kx icon-kx-wechat-fill"></text>
								</button>
								<text class="u-font-24 u-line-1 item-text">分享</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class=" u-m-t-20 u-m-b-20">
				<ad-custom unit-id="adunit-3d5d8bfadac4e954" ad-intervals="30"></ad-custom>
			</view>
			<view class=" u-m-t-20 u-m-b-20">
				<ad-custom unit-id="adunit-4a47ba5eacd6fa5d" ad-intervals="30"></ad-custom>
			</view>
		</view>
		<button class="com-addBtn" open-type="contact">
			<u-icon name="kefu-ermai" size="48" color="#fff" />
		</button>
		<AnalysisDetial :detialData="detialData" v-model="showAnalysisDetial" v-if="showAnalysisDetial">
		</AnalysisDetial>
	</view>
</template>
<script>
	import {
		getVoucher,
		watermark,
		authorWorkWatermark
	} from "@/api/external.js";
	import AnalysisDetial from '@/components/AnalysisDetial.vue'
	const subscribemsg = uniCloud.importObject('subscribeMessage')
	export default {
		components: {
			AnalysisDetial
		},
		data() {
			return {
				list: [{
						image: "https://mp-89c324e5-79a8-4fa7-ab60-b83b46b5dd6b.cdn.bspapp.com/banner/1.jpg"
					},
					{
						image: 'https://mp-89c324e5-79a8-4fa7-ab60-b83b46b5dd6b.cdn.bspapp.com/banner/2.jpg'

					},
					{
						image: 'https://mp-89c324e5-79a8-4fa7-ab60-b83b46b5dd6b.cdn.bspapp.com/banner/3.jpg'

					},
					{
						image: 'https://mp-89c324e5-79a8-4fa7-ab60-b83b46b5dd6b.cdn.bspapp.com/banner/4.jpg'

					},
					{
						image: 'https://mp-89c324e5-79a8-4fa7-ab60-b83b46b5dd6b.cdn.bspapp.com/banner/5.jpg'

					}
				],
				url: "",
				detialData: {},
				showAnalysisDetial: false,
				subscribeId: ['UU3SfNdbK8zevjVTLyDd43aqeGvdO4V6ND-VcoIRTYk'],
				isBach: false
			}
		},
		onShareAppMessage() {
			return {
				title: '免费去水印,不限次数',
				path: '/pages/index/index'
			}
		},
		computed: {
			currentUser() {
				let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo') || {}
				return hostUserInfo
			}
		},
		onLoad() {
			this.share()
			this.getVoucher()
		},
		onShareAppMessage() {
			return {
				title: '免费去水印,不限次数',
				path: '/pages/index/index'
			}
		},
		methods: {
			share() {
				//分享
				// #ifdef MP-WEIXIN
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline']
				})
				// #endif
			},
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
						user_id: this.currentUser._id
					},
				}).then(res => {});
			},

			//批量解析开关
			switchChange(e) {
				this.isBach = e
			},

			//短视频解析
			watermark() {
				//订阅
				if (!this.url) return this.$u.toast("分享链接不能为空")
				let data = {
					link: this.url
				}
				watermark(data).then(res => {
					let data = JSON.parse(JSON.stringify(res.data)) || {}
					let imgUrl = this.ensureHttps(data.imageSrc)
					let videoUrl = this.ensureHttps(data.videoSrc)
					let imageAtlas = data.imageAtlas.map(o => this.ensureHttps(o))
					this.detialData = {
						...data,
						imageSrc: imgUrl,
						videoSrc: videoUrl,
						imageAtlas: imageAtlas
					}
					this.showAnalysisDetial = true
				}).catch(err => {})
			},
			jumWebview(type) {
				if (type == '1') {
					uni.navigateToMiniProgram({
						appId: 'wx51f6121324b84fa8', //目标小程序appid
						path: '/pages/index/index', //需要打开的目标路径
						envVersion: 'release', //小程序版本：develop（开发版），trial（体验版），release（正式版）
						success(res) {
							// 打开成功
						}
					})
				} else if (type == '2') {
					uni.navigateToMiniProgram({
						appId: 'wx51f6121324b84fa8', //目标小程序appid
						path: '/pages/index/wallpaper', //需要打开的目标路径
						envVersion: 'release', //小程序版本：develop（开发版），trial（体验版），release（正式版）
						success(res) {
							// 打开成功
						}
					})
				} else if (type == '3') {
					uni.navigateTo({
						url: '/pages/mdFive/index'
					});
				} else {
					uni.navigateTo({
						url: '/pages/webview/index'
					});
				}
			},
			//批量解析
			authorWorkWatermark() {
				if (!this.url) return this.$u.toast("分享链接不能为空")
				let data = {
					appid: '66bc5fb2a5d7e1241SihJ',
					appsecret: '6B0TruSB7SvwczwF4vZ0iTiOXPZOcJST',
					link: this.url
				}
				authorWorkWatermark(data).then(res => {
					let data = JSON.parse(JSON.stringify(res.data)) || {}
					if (res.code == '1') {
						uni.navigateTo({
							url: '/pages/batch/index?config=' + encodeURIComponent(JSON
								.stringify(data))
						})
					}
				})
			},
			ensureHttps(url) {
				return url.replace(/^http:\/\//i, 'https://');
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.tool-v {
		width: 100%;
		height: 100%;
		padding: 0 20rpx;

		.statement {
			width: 100%;
			color: red;
		}

		.wrap {
			padding: 20rpx 0;
		}

		.tool-content {
			padding-bottom: 20rpx;

			.url-input {
				width: 100%;
				background-color: #fff;
				padding: 20rpx;
				border-radius: 10rpx;
				box-shadow: 1rpx 1rpx 2rpx 1rpx rgba(0, 0, 0, 0.1);
			}
		}
	}
</style>