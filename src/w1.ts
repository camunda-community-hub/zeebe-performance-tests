import * as ZB from 'zeebe-node'
import { print } from './print'

const zbc = new ZB.ZBClient({ loglevel: 'NONE' })

zbc.createWorker({
	taskType: 'task1',
	taskHandler: job => {
		const w1 = Date.now()
		console.log(`${Date.now() - w1}ms in handler 1`)
		return job.complete({ w1 })
			.then(res => print(`${Date.now() - w1}ms to broker ack complete 1`, res))
	},
	longPoll: 30000
})
