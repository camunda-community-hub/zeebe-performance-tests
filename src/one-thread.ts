import * as ZB from 'zeebe-node'
import { print } from './print'
const zbc = new ZB.ZBClient({ loglevel: 'NONE', longPoll: 30000 })

const workflows = [
	'../bpmn/uncontested.bpmn',
	'./bpmn/contested.bpmn',
	'./bpmn/uncontested-with-iomapping.bpmn',
	'./bpmn/uncontested-with-decisions.bpmn',
]

const p: number[] = []

zbc.createWorker({
	taskType: 'task1', 
	taskHandler: job => {
		const w1 = Date.now()
		p.push(Date.now() - w1)
		return job.complete({ w1 })
			.then(res => print(
				`${Date.now() - w1}ms to broker ack complete 1`, res
			))
	}
})

zbc.createWorker({
	taskType: 'task2', 
	taskHandler: job => {
		const w2 = Date.now()
		p.push(Date.now() - w2)
		return job.complete({ w2 })
			.then(res => print(`${Date.now() - w2}ms to broker ack complete 2`, res))
		// console.log(`${p[1]}ms in handler 2`)
	}
})

zbc.createWorker({
	taskType: 'task3', 
	taskHandler: job => {
		const w3 = Date.now()
		p.push(Date.now() - w3)
		return job.complete({ w3 })
			.then((res) => print(`${Date.now() - w3}ms to broker ack complete 3`, res))
		// console.log(`${p[2]}ms in handler 3`)
	}
})

zbc.createWorker({
	taskType: 'task4', 
	taskHandler: job => {
		const w4 = Date.now()
		p.push(Date.now() - w4)
		return job.complete({ w4 })
			.then(res => print(`${Date.now() - w4}ms to broker ack complete 4`, res))
	// console.log(`${p[3]}ms in handler 4`)
	}
})

zbc.createWorker({
	taskType: 'task5', 
	taskHandler: job => {
	const w5 = Date.now()
	p.push(Date.now() - w5)
	return job.complete({ w5 })
		.then(res => print(`${Date.now() - w5}ms to broker ack complete 5`, res))
	// console.log(`${p[4]}ms in handler 5`)
	}
})

async function main() {
	// Deploy workflows
	console.log(`${JSON.stringify(await zbc.deployProcess(workflows[0]))}\n`)
	console.log('\n== Communication latency ==')
	const start = Date.now()
	const res = await zbc.createProcessInstanceWithResult('uncontested', { start })
	const end = Date.now()
	// console.log({ end })
	console.log(`\nEnd-to-end time: ${end - start}ms`)
	console.log('\n== Broker overhead ==')
	console.log(`Start -> Task 1 start: ${res.variables.w1 - start}ms`)
	console.log(`Task 1 end -> Task 2 start: ${res.variables.w2 - res.variables.w1 - p[0]}ms`)
	console.log(`Task 2 end -> Task 3 start: ${res.variables.w3 - res.variables.w2 - p[1]}ms`)
	console.log(`Task 3 end -> Task 4 start: ${res.variables.w4 - res.variables.w3 - p[2]}ms`)
	console.log(`Task 4 end -> Task 5 start: ${res.variables.w5 - res.variables.w4 - p[3]}ms`)
}

main()
