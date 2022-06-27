import * as ZB from 'zeebe-node'
import { print } from './print'
const zbc = new ZB.ZBClient({ loglevel: 'NONE' })

zbc.createWorker({
	taskType: 'task4',
	taskHandler: job => {
		const w4 = Date.now()
		console.log(`${Date.now() - w4}ms in handler 4`)
		return job.complete({ w4 })
			.then(res => print(`${Date.now() - w4}ms to broker ack complete 4`, res))
	},
	longPoll: 30000
})
