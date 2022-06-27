import * as ZB from 'zeebe-node'
import { print } from './print'
const zbc = new ZB.ZBClient({ loglevel: 'NONE' })

zbc.createWorker({
	taskType: 'task2',
	taskHandler: job => {
		const w2 = Date.now()
		console.log(`${Date.now() - w2}ms in handler 2`)
		return job.complete({ w2 })
			.then(res => print(`${Date.now() - w2}ms to broker ack complete 2`, res))
	},
	longPoll: 30000,
})
