const db = uniCloud.database();
const dbCmd = db.command
const analysisTable = db.collection('analysis-dataLog')
exports.main = async (event, context) => {
	let {
		user_id
	} = event
	let res = await db.collection('analysis-dataLog').where({
		user_id: dbCmd.eq(user_id)
	}).get()
	return res
};