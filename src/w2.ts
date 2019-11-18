import * as ZB from 'zeebe-node'
const zbc = new ZB.ZBClient({ loglevel: 'NONE' })

zbc.createWorker(
	null,
	'task2',
	(_, complete) => {
		const w2 = Date.now()
		complete
			.success({ w2 })
			.then(() => console.log(`${Date.now() - w2}ms to broker ack complete 2`))
		console.log(`${Date.now() - w2}ms in handler 2`)
	},
	{
		longPoll: 30000,
	}
)
