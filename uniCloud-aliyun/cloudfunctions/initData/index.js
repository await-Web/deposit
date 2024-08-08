const db = uniCloud.database();
const dbCmd = db.command
const depositTable = db.collection('deposit-sign-in')
exports.main = async (event, context) => {
	let userId = event.user_id
	let res = await db.collection('deposit-sign-in').where({
		user_id: dbCmd.eq(userId)
	}).get()
	return res
};