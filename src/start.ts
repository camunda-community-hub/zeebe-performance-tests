import * as ZB from 'zeebe-node'
const zbc = new ZB.ZBClient({ loglevel: 'NONE', longPoll: 600000 })

const workflows = [
	'../bpmn/uncontested.bpmn',
	'./bpmn/contested.bpmn',
	'./bpmn/uncontested-with-iomapping.bpmn',
	'./bpmn/uncontested-with-decisions.bpmn',
]

async function main() {
	// Deploy workflows
	await zbc.deployWorkflow(workflows[0])
	const start = Date.now()
	const res = await zbc.createWorkflowInstanceWithResult('uncontested', { start })
	const end = Date.now()
	console.log(`Total time: ${end - start}ms`)
	console.log(`Task 1: ${res.variables.w1 - start}ms`)
	console.log(`Task 2: ${res.variables.w2 - res.variables.w1}ms`)
	console.log(`Task 3: ${res.variables.w3 - res.variables.w2}ms`)
	console.log(`Task 4: ${res.variables.w4 - res.variables.w3}ms`)
	console.log(`Task 5: ${res.variables.w5 - res.variables.w4}ms`)
}

main()
