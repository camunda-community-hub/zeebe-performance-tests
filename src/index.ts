import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import * as ZB from 'zeebe-node'

const testStore: { [uuid: string]: ZB.PerformanceTest } = {}

const workflows = [
	'./bpmn/uncontested.bpmn',
	'./bpmn/contested.bpmn',
	'./bpmn/uncontested-with-iomapping.bpmn',
	'./bpmn/uncontested-with-decisions.bpmn',
]

const zeebeHost = process.env.ZEEBE_HOST || 'localhost'

async function main() {
	// Connect to zeebe
	console.log(`Connecting to ${zeebeHost}...`)
	const zbc = new ZB.ZBClient(testStore, zeebeHost, { loglevel: 'NONE', longPoll: 600000 })
	const topology = await zbc.topology()
	console.log(JSON.stringify(topology, null, 2))

	// Deploy workflows
	await zbc.deployWorkflow(workflows)

	// Create workers
	zbc.createWorker(null, 'task1', (job, complete) => complete.success({ ...job.variables }))
	zbc.createWorker(null, 'task2', (job, complete) => complete.success({ ...job.variables }))
	zbc.createWorker(null, 'task3', (job, complete) => complete.success({ ...job.variables }))
	zbc.createWorker(null, 'task4', (job, complete) => complete.success({ ...job.variables }))
	zbc.createWorker<{ testId: string }>(null, 'task5', (job, complete) => {
		testStore[job.variables.testId].finished()
		complete.success({ ...job.variables })
	})

	// Execute tests
	console.log('Warming up...')
	for (const workflow of workflows) {
		const tests: any = []
		for (let i = 0; i < 20; i++) {
			// console.log(`Testing ${workflow} ${i}/`)
			tests.push(await doTest(workflow.match(/.*\/(.*).bpmn/)![1]))
		}
	}

	for (const workflow of workflows) {
		const tests: any = []
		for (let i = 0; i < 20; i++) {
			console.log(`Testing ${workflow} ${i}/`)
			tests.push(await doTest(workflow.match(/.*\/(.*).bpmn/)![1]))
		}

		console.log(workflow, {
			totalTime: `${_.sumBy(tests, 'totalTime') / tests.length}ms`,
			timeToStart: `${_.sumBy(tests, 'timeToStart') / tests.length}ms`,
			sumTimeBetweenTasks: `${_.sumBy(tests, 'sumTimeBetweenTasks') / tests.length}ms`,
			sumTimeWithinTasks: `${_.sumBy(tests, 'sumTimeWithinTasks') / tests.length}ms`,
			averageTimeBetweenTasks: `${_.sumBy(tests, 'averageTimeBetweenTasks') /
				tests.length}ms`,
			averageTimeWithinTasks: `${_.sumBy(tests, 'averageTimeWithinTasks') / tests.length}ms`,
		})
	}

	async function doTest(workflow: string) {
		const testId = uuid()
		let resolve
		const promise = new Promise(_resolve => (resolve = _resolve))

		const test: ZB.PerformanceTest = (testStore[testId] = {
			finished: resolve,
			startTime: Date.now(),
			tasks: [],
			testId,
		})
		await zbc.createWorkflowInstance(workflow, {
			testId,
		})
		await promise
		test.endTime = Date.now()

		const totalTime = test.endTime - test.startTime

		const timeToStart = test.tasks[0].startTime - test.startTime

		let sumTimeBetweenTasks = testStore[testId].tasks.reduce(
			(accumulator, task, index, tasks) => {
				if (tasks[index + 1]) {
					return accumulator + tasks[index + 1].startTime - task.endTime!
				} else {
					return accumulator
				}
			},
			0
		)

		const averageTimeBetweenTasks = sumTimeBetweenTasks / (test.tasks.length - 1)

		let sumTimeWithinTasks = testStore[testId].tasks.reduce((accumulator, task) => {
			return accumulator + task.endTime! - task.startTime
		}, 0)

		const averageTimeWithinTasks = sumTimeWithinTasks / (test.tasks.length - 1)

		return {
			totalTime,
			timeToStart,
			sumTimeBetweenTasks,
			sumTimeWithinTasks,
			averageTimeBetweenTasks,
			averageTimeWithinTasks,
		}
	}

	process.exit()
}

main()
