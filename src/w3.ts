import * as ZB from 'zeebe-node'
const zbc = new ZB.ZBClient({ loglevel: 'NONE' })

zbc.createWorker(
	null,
	'task3',
	(_, complete) => {
		const w3 = Date.now()
		complete
			.success({ w3 })
			.then(() => console.log(`${Date.now() - w3}ms to broker ack complete 3`))
		console.log(`${Date.now() - w3}ms in handler 3`)
	},
	{
		longPoll: 30000,
	}
)
