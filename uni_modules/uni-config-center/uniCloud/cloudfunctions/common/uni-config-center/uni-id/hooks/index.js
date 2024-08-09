// 钩子函数示例 hooks/index.js

function beforeRegister({
	userRecord,
	clientInfo
} = {}) {
	userRecord.username = '我爱存钱' + (Math.random().toString(26).substring(3, 9))
	return userRecord // 务必返回处理后的userRecord
}

module.exports = {
	beforeRegister
}