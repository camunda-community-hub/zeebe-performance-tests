import * as ZB from 'zeebe-node'
import { print } from './print'

const zbc = new ZB.ZBClient({ loglevel: 'NONE' })

zbc.createWorker({

	taskType: 'task5',
	taskHandler: job => {
		const w5 = Date.now()
		console.log(`${Date.now() - w5}ms in handler 5`)
		return job.complete({ w5 })
			.then(res => print(`${Date.now() - w5}ms to broker ack complete 5`, res))
	},
	longPoll: 30000,
})
