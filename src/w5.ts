import * as ZB from 'zeebe-node'
const zbc = new ZB.ZBClient({ loglevel: 'NONE' })

zbc.createWorker(
	null,
	'task5',
	(_, complete) => {
		const w5 = Date.now()
		complete
			.success({ w5 })
			.then(() => console.log(`${Date.now() - w5}ms to broker ack complete 5`))
		console.log(`${Date.now() - w5}ms in handler 5`)
	},
	{
		longPoll: 30000,
	}
)
