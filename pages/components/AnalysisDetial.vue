<template>
	<u-popup ref="popup" width="100%" v-model="show">
		<view class="statusBar" :style="{height:system.getStatusBarHeight()+'px'}"></view>
		<view class="title-box">
			<uni-icons type="closeempty" style="float: left;margin-left: 20rpx;" size='24' @click="close"></uni-icons>
			<view class="title">提取完毕</view>
		</view>
		<view class="u-flex-col content  u-p-l-20 u-p-r-20">
			<u-alert-tips :show="true" type="error" @close="showTips = false"
				title="视频无法下载或保存点击下方,'复制无水印视频链接'使用手机自带浏览器下载" :close-able="true"></u-alert-tips>
			<!-- 视频 -->
			<view class="u-m-t-20 video-box" v-if="analysisData.videoSrc">
				<video id="myVideo" :src="analysisData.videoSrc" controls></video>
			</view>
			<!-- 图片 -->
			<view class="imgs-box u-flex" v-else>
				<view class="img-item " v-for="(item,index) in analysisData?.imageAtlas" :key="index">
					<image :src="item" class="image-sty"></image>
					<u-button type="primary" size="mini" @click="handleDownloads(item,'img')"
						style="position: absolute;bottom: 8rpx;left: 8rpx;">下载</u-button>
				</view>
			</view>
			<!-- 描述 -->
			<view class="u-flex-col u-m-t-10">
				<text class="u-font-30 u-m-b-10">{{analysisData.title}}</text>
				<text>{{analysisData.description}}</text>
			</view>
			<view class="u-flex btn-box" v-if="analysisData.videoSrc">
				<u-button type="primary" size="medium"
					@click="handleDownloads(analysisData.videoSrc,'video')">下载视频</u-button>
				<u-button type="primary" size="medium"
					@click="handleDownloads(analysisData.imageSrc,'img')">下载封面</u-button>
				<u-button type="success" size="medium" @click="copy(analysisData.videoSrc)">复制无水印视频链接</u-button>
				<u-button type="success" size="medium" @click="copy(analysisData.imageSrc)">复制无水印封面链接</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		props: {
			modelValue: {
				type: Boolean,
				default: false
			},
			detialData: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
				show: false,
				showTips: false
			}
		},
		watch: {
			modelValue: {
				immediate: true,
				handler(val) {
					this.show = val
				}
			}
		},
		computed: {
			analysisData() {
				return this.detialData
			}
		},
		methods: {
			close() {
				this.$emit("update:modelValue", false);
			},
			//处理解析后的数据
			handleDownloads(imageUrls, type) {
				var downloadTask = uni.downloadFile({
					url: imageUrls,
					success: (res) => {
						if (res.statusCode === 200) {
							if (type === 'img') this.handleImage(res.tempFilePath)
							if (type === 'video') this.handleVideo(res.tempFilePath)
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '下载失败',
							icon: 'none',
						});
						setTimeout(() => {
							this.$emit('change', '下载失败,联系客服')
						}, 1000)
					}
				});
				downloadTask.onProgressUpdate((res) => {
					uni.showLoading({
						title: '正在下载' + res.progress + '%'
					})
					if (res.progress == 100) uni.hideLoading()
				});
			},
			// 图片
			handleImage(tempFilePath) {
				uni.saveImageToPhotosAlbum({
					filePath: tempFilePath,
					success() {
						uni.showToast({
							title: '已保存在手机相册中',
							icon: 'none',
						});
					},
					fail: (err) => {
						uni.showToast({
							title: '无法保存到手机,复制无水印视频链接',
							icon: 'none',
						});
					}
				})
			},

			//视频
			handleVideo(tempFilePath) {
				uni.saveVideoToPhotosAlbum({
					filePath: tempFilePath,
					success() {
						uni.showToast({
							title: '已保存在手机相册中',
							icon: 'none',
						});
					},
					fail: (err) => {
						uni.showToast({
							title: '无法保存到手机,复制无水印视频链接',
							icon: 'none',
						});
					}
				})
			},
			//复制
			copy(text) {
				uni.setClipboardData({
					data: text,
					showToast: false,
					success: () => {
						uni.hideToast(); // 隐藏弹出提示
						uni.hideKeyboard(); //  隐藏软键盘
						uni.showToast({
							title: '已复制'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title-box {
		display: flex;
		align-items: center;
		height: 100rpx;
		padding: 0 16rpx !important;

		.backIcon {
			font-size: 40rpx;
			color: #000;
		}

		.title {
			flex: 1;
			text-align: center;
			padding-right: 40rpx;
			font-size: 32rpx;
		}
	}

	.content {
		.notice-bar-box {
			border-radius: 40rpx;
			margin-top: 20rpx;

			::v-deep uni-notice-bar {
				.uni-noticebar {
					border-radius: 80rpx;
				}
			}
		}

		.video-box {
			width: 100%;

			::v-deep video {
				width: 100%;
			}
		}

		.btn-box {
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: 20rpx;

			::v-deep button {
				width: 340rpx !important;
				margin-bottom: 20rpx;
			}
		}

		.imgs-box {

			max-height: 800rpx;
			border: 1px solid red;
			overflow-y: scroll;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: 20rpx;

			.img-item {
				position: relative;
				width: 48%;
				height: 400rpx;
				align-items: center;
				flex-wrap: wrap;
				justify-content: space-between;
				margin-bottom: 10rpx;

				.image-sty {
					width: 100%;
					height: 100%;
				}

			}
		}
	}





	.content {}
</style>