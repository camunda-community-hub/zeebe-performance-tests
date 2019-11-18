import * as ZB from 'zeebe-node'
const zbc = new ZB.ZBClient({ loglevel: 'NONE' })

zbc.createWorker(
	null,
	'task4',
	(_, complete) => {
		const w4 = Date.now()
		complete
			.success({ w4 })
			.then(() => console.log(`${Date.now() - w4}ms to broker ack complete 4`))
		console.log(`${Date.now() - w4}ms in handler 4`)
	},
	{
		longPoll: 30000,
	}
)
