import * as ZB from 'zeebe-node'
const zbc = new ZB.ZBClient({ loglevel: 'NONE' })

zbc.createWorker(
	null,
	'task1',
	(_, complete) => {
		const w1 = Date.now()
		complete
			.success({ w1 })
			.then(() => console.log(`${Date.now() - w1}ms to broker ack complete 1`))
		console.log(`${Date.now() - w1}ms in handler 1`)
	},
	{
		longPoll: 30000,
	}
)
