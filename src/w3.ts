import * as ZB from 'zeebe-node'
import { print } from './print'
const zbc = new ZB.ZBClient({ loglevel: 'NONE' })

zbc.createWorker({
	taskType: 'task3',
	taskHandler: job => {
		const w3 = Date.now()
		console.log(`${Date.now() - w3}ms in handler 3`)
		return job.complete({ w3 })
			.then(res => print(`${Date.now() - w3}ms to broker ack complete 3`, res))
	},
	longPoll: 30000,
})
