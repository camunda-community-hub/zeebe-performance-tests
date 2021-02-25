import * as ZB from 'zeebe-node'
const zbc = new ZB.ZBClient({ loglevel: 'NONE', longPoll: 30000 })

const workflows = [
	'../bpmn/uncontested.bpmn',
	'./bpmn/contested.bpmn',
	'./bpmn/uncontested-with-iomapping.bpmn',
	'./bpmn/uncontested-with-decisions.bpmn',
]

const p: number[] = []

zbc.createWorker(null, 'task1', (_, complete) => {
	const w1 = Date.now()
	complete
		.success({ w1 })
		.then(() => console.log(`${Date.now() - w1}ms to broker ack complete 1`))
	p.push(Date.now() - w1)
	// console.log(`${p[0]}ms in handler 1`)
})

zbc.createWorker(null, 'task2', (_, complete) => {
	const w2 = Date.now()
	complete
		.success({ w2 })
		.then(() => console.log(`${Date.now() - w2}ms to broker ack complete 2`))
	p.push(Date.now() - w2)
	// console.log(`${p[1]}ms in handler 2`)
})

zbc.createWorker(null, 'task3', (_, complete) => {
	const w3 = Date.now()
	complete
		.success({ w3 })
		.then(() => console.log(`${Date.now() - w3}ms to broker ack complete 3`))
	p.push(Date.now() - w3)
	// console.log(`${p[2]}ms in handler 3`)
})

zbc.createWorker(null, 'task4', (_, complete) => {
	const w4 = Date.now()
	complete
		.success({ w4 })
		.then(() => console.log(`${Date.now() - w4}ms to broker ack complete 4`))
	p.push(Date.now() - w4)
	// console.log(`${p[3]}ms in handler 4`)
})

zbc.createWorker(null, 'task5', (_, complete) => {
	const w5 = Date.now()
	complete
		.success({ w5 })
		.then(() => console.log(`${Date.now() - w5}ms to broker ack complete 5`))
	p.push(Date.now() - w5)
	// console.log(`${p[4]}ms in handler 5`)
})

async function main() {
	// Deploy workflows
	await zbc.deployWorkflow(workflows[0])
	console.log('\n== Communication latency ==')
	const start = Date.now()
	const res = await zbc.createWorkflowInstanceWithResult('uncontested', { start })
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
