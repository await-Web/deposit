<template>
	<view class="batch-v">
		<mescroll-body ref="mescrollRef" @down="downCallback" :down="downOption" :sticky="false" @up="upCallback"
			:up="upOption" :bottombar="false" @init="mescrollInit" top="20">
			<view v-if="videoList.length">
				<view class="video-box" v-for="(item,index) in videoList" :key="index">
					<button size="mini" type="primary" class="btn" @click="handleDownloads(item,'video')">下载</button>
					<video :id="'video'+index" :src="item" controls @play="handlePlay(index)"
						play-btn-position="center"></video>
				</view>
			</view>
			<waterfallItem :flowData="flowData" @handleDownloads="handleDownloads" v-else>
			</waterfallItem>
		</mescroll-body>
	</view>
</template>
<script>
	// #ifdef MP-WEIXIN
	const fs = wx.getFileSystemManager()
	// #endif
	import {
		authorWorkWatermark
	} from "@/api/external.js";
	import waterfallItem from './waterfall-item.vue'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		components: {
			waterfallItem
		},
		data() {
			return {
				flowData: {
					list: [], // 数据值
					column: 2, // 瀑布列数
					columnSpace: 2 // 瀑布列宽间距
				},
				videoList: [],
				imageList: [],
				newTime: +new Date(),
				dataList: [],
				bathData: {},
				downOption: {
					use: false,
					auto: false,
				},
				upOption: {
					use: true,
					auto: false,
					page: {
						num: 0,
						size: 5,
						time: null,
					},
					empty: {
						use: true,
						icon: '',
						tip: "暂无数据",
						fixed: false,
						top: "560rpx",
					},
					textNoMore: "没有更多数据",
				},
			}
		},
		onLoad(e) {
			this.bathData = JSON.parse(decodeURIComponent(e.config));
			this.dataList = this.bathData.aweme_list

			let imageList = []
			this.dataList.forEach(item => {
				if (item.imageAtlas.length) imageList.push(...item.imageAtlas)
				if (item.videoSrc) this.videoList.push(item.videoSrc)
			})
			this.imageList = [...new Set(imageList.map(JSON.stringify))].map(JSON.parse);
			if (this.imageList.length) {
				for (let i = 1; i <= this.flowData.column; i++) {
					this.$set(this.flowData, `column_${i}`, []);
				}
				this.initWaterfallData()
			}
		},
		methods: {
			/* 数据初始化 */
			initWaterfallData() {
				/* 初始化每一列的数据 */
				this.$nextTick(() => {

				})
				const groupList = this.dynamicGrouping(this.imageList, this.flowData.column); // 数据动态分组
				groupList.forEach((item, i) => (this.flowData[`column_${i + 1}`] = item));
			},
			/** 数据动态分组
			 * @param {Object} data 分组的数据列表
			 * @param {Object} i 需要分几组
			 * @returns {Array} groups 已分组的数据
			 */
			dynamicGrouping(data, i) {
				if (i <= 0) return "分组数必须大于0";
				const groups = [];
				for (let j = 0; j < i; j++) {
					groups.push([]);
				}
				for (let k = 0; k < data.length; k++) {
					const groupIndex = k % i;
					groups[groupIndex].push(data[k]);
				}
				return groups;
			},
			//处理解析后的数据
			handleDownloads(imageUrls, type) {
				var downloadTask = uni.downloadFile({
					url: imageUrls,
					success: (res) => {
						if (res.statusCode === 200) {
							if (type === 'img') this.saveImage(res.tempFilePath)
							if (type === 'video') this.handleVideoFile('video', `${this.newTime}.mp4`, res
								.tempFilePath)
						}
					},
					fail: (err) => {
						if (err.errMsg == 'downloadFile:fail exceed max file size') {
							uni.showModal({
								title: "下载失败",
								content: "该文件超过200M，无法直接在微信下载，请复制链接去外部浏览器下载",
								confirmText: "复制链接",
								showCancel: false
							})
						}
					}
				});
				downloadTask.onProgressUpdate((res) => {
					uni.showLoading({
						title: '正在下载' + res.progress + '%'
					})
					if (res.progress == 100) uni.hideLoading()
				});
			},
			// 保存图片
			saveImage(tempFilePath) {
				uni.saveImageToPhotosAlbum({
					filePath: tempFilePath,
					success: () => {
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
			//保存视频
			saveVideoFile(tempFilePath) {
				uni.saveVideoToPhotosAlbum({
					filePath: tempFilePath,
					success: (res) => {
						uni.showToast({
							title: '已保存在手机相册中',
							icon: 'none',
						});
					},
					fail: (err) => {
						if (err.errMsg == 'saveVideoToPhotosAlbum:fail cancel') return //取消，不做操作
						uni.showToast({
							title: '无法保存到手机,复制无水印视频链接',
							icon: 'none',
						});
					}
				})
			},
			//处理视频文件
			handleVideoFile(dir, filePath, tempFilePath) {
				this.handleDirectory(dir)
				this.$nextTick(() => {
					fs.saveFile({
						tempFilePath,
						filePath: `${wx.env.USER_DATA_PATH}/${dir+'/'+filePath}`,
						success: (res) => {
							this.saveVideoFile(res.savedFilePath)
						},
						fail(res) {
							uni.showToast({
								title: '下载失败，请查看是否打开下载相册权限或联系客服',
								icon: "none"
							})
						}
					})
				})
			},
			//处理文件目录
			handleDirectory(url) {
				//判断文件/目录是否存在
				try {
					fs.accessSync(`${wx.env.USER_DATA_PATH}/${url}`)
				} catch (e) {
					try {
						fs.mkdirSync(`${wx.env.USER_DATA_PATH}/${url}`, true)
					} catch (e) {
						console.error('fsmkdir', e)
					}
				}
			},
			// 视频播放
			handlePlay(index) {
				if (this.playIdx !== '') {
					let videoContext = uni.createVideoContext(`video${this.playIdx}`)
					if (index == this.playIdx) return videoContext.play()
					videoContext.pause()
				}
				this.playIdx = index
			},
			ensureHttps(url) {
				return url.replace(/^http:\/\//i, 'https://');
			},
			upCallback() {
				let query = {
					appid: '66bc5fb2a5d7e1241SihJ',
					appsecret: '6B0TruSB7SvwczwF4vZ0iTiOXPZOcJST',
					link: this.bathData.link,
					max_cursor: this.bathData.max_cursor
				};
				authorWorkWatermark(query).then(res => {
					this.mescroll.endSuccess(res.data.aweme_list.length);
					this.bathData = res.data || {}
					let list = this.bathData.aweme_list || [];
					this.dataList = this.dataList.concat(list)
					let imageList = []
					let videoList = []
					this.dataList.forEach(item => {
						if (item.imageAtlas.length) imageList.push(...item.imageAtlas)
						if (item.videoSrc) videoList.push(item.videoSrc)
					})
					this.videoList = videoList
					this.imageList = [...new Set(imageList.map(JSON.stringify))].map(JSON.parse);
					this.$nextTick(() => {
						this.initWaterfallData()
					})
				}).catch(err => {
					this.mescroll.endErr();
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.batch-v {
		.video-box {
			position: relative;
			padding: 0 20rpx;
			width: 100%;
			height: 1020rpx;
			margin-bottom: 20rpx;
			border-radius: 20rpx;

			::v-deep video {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}

			.btn {
				position: absolute;
				top: 10rpx;
				left: 30rpx;
				z-index: 999999;
			}
		}

		.container {
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			$borderRadius: 12rpx;

			.cont-box {
				width: var(--layout-width);

				.item-box {
					width: 100%;
					margin-bottom: 16rpx;
					border-radius: $borderRadius;
					position: relative;

					.img-tip {
						width: 100%;
						border-radius: $borderRadius;
						height: 100%;
						// box-shadow: 0rpx 3rpx 6rpx rgba(0, 46, 37, 0.8);
						// box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
						// box-shadow: 0rpx 0rpx 12rpx #dfe3e9;
						box-shadow: 0px 0px 14rpx 0rpx rgba(13, 158, 253, 0.1);

					}

					.img-tip-btn {
						width: 100%;
						height: 68rpx;
						background-color: rgba(97, 175, 239, 0.7);
						position: absolute;
						bottom: 0;
						color: #f0f2f6;
						font-size: 28rpx;
						z-index: 99999;
						text-align: center;
						line-height: 68rpx;
						border-radius: 0 0 $borderRadius $borderRadius;
					}
				}
			}
		}
	}
</style>