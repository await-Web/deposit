<script setup>
	import {
		onLaunch,
		onShow,
		onHide
	} from "@dcloudio/uni-app"
	import {
		useUserStore
	} from "@/store/user.js"
	const userStore = useUserStore()
	const uniIdCo = uniCloud.importObject('uni-id-co')
	onLaunch(() => {
		console.log('App onLaunch')
		let expired = uni.getStorageSync('uni_id_token_expired')
		if (expired - Date.now() > 1000 * 60 * 60 * 1) return
		uni.login({
			success: (res) => {
				uniIdCo.loginByWeixin({
					code: res.code
				}).then(res => {
					let data = {
						...res,
						showToast: false
					}
					userStore.loginSuccess(data)
				})
			}
		})
	})
	onShow(() => {
		console.log('App onShow')
	})
	onHide(() => {
		console.log('App onHide')
	})
</script>

<style lang="scss">
	@import "@/uni_modules/vk-uview-ui/index.scss";
	@import "@/assets/scss/common-style.scss";
</style>