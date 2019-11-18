import * as ZB from 'zeebe-node'
const zbc = new ZB.ZBClient({ loglevel: 'NONE', longPoll: 30000 })

const workflows = [
	'../bpmn/uncontested.bpmn',
	'./bpmn/contested.bpmn',
	'./bpmn/uncontested-with-iomapping.bpmn',
	'./bpmn/uncontested-with-decisions.bpmn',
]

zbc.createWorker(null, 'task1', (_, complete) => {
	const w1 = Date.now()
	complete
		.success({ w1 })
		.then(() => console.log(`${Date.now() - w1}ms to broker ack complete 1`))
	console.log(`${Date.now() - w1}ms in handler 1`)
})

zbc.createWorker(null, 'task2', (_, complete) => {
	const w2 = Date.now()
	complete
		.success({ w2 })
		.then(() => console.log(`${Date.now() - w2}ms to broker ack complete 2`))
	console.log(`${Date.now() - w2}ms in handler 2`)
})

zbc.createWorker(null, 'task3', (_, complete) => {
	const w3 = Date.now()
	complete
		.success({ w3 })
		.then(() => console.log(`${Date.now() - w3}ms to broker ack complete 3`))
	console.log(`${Date.now() - w3}ms in handler 3`)
})

zbc.createWorker(null, 'task4', (_, complete) => {
	const w4 = Date.now()
	complete
		.success({ w4 })
		.then(() => console.log(`${Date.now() - w4}ms to broker ack complete 4`))
	console.log(`${Date.now() - w4}ms in handler 4`)
})

zbc.createWorker(null, 'task5', (_, complete) => {
	const w5 = Date.now()
	complete
		.success({ w5 })
		.then(() => console.log(`${Date.now() - w5}ms to broker ack complete 5`))
	console.log(`${Date.now() - w5}ms in handler 5`)
})

async function main() {
	// Deploy workflows
	await zbc.deployWorkflow(workflows[0])
	const start = Date.now()
	const res = await zbc.createWorkflowInstanceWithResult('uncontested', { start })
	const end = Date.now()
	console.log({ end })
	console.log(`Total time: ${end - start}ms`)
	console.log(`Task 1: ${res.variables.w1 - start}ms`)
	console.log(`Task 2: ${res.variables.w2 - res.variables.w1}ms`)
	console.log(`Task 3: ${res.variables.w3 - res.variables.w2}ms`)
	console.log(`Task 4: ${res.variables.w4 - res.variables.w3}ms`)
	console.log(`Task 5: ${res.variables.w5 - res.variables.w4}ms`)
}

main()
