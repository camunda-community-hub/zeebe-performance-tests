"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const uuid_1 = require("uuid");
const ZB = __importStar(require("zeebe-node"));
const testStore = {};
const workflows = [
    './bpmn/uncontested.bpmn',
    './bpmn/contested.bpmn',
    './bpmn/uncontested-with-iomapping.bpmn',
    './bpmn/uncontested-with-decisions.bpmn',
];
const zeebeHost = process.env.ZEEBE_HOST || 'localhost';
async function main() {
    // Connect to zeebe
    console.log(`Connecting to ${zeebeHost}...`);
    const zbc = new ZB.ZBClient(testStore, zeebeHost, { loglevel: 'NONE', longPoll: 600000 });
    const topology = await zbc.topology();
    console.log(JSON.stringify(topology, null, 2));
    // Deploy workflows
    await zbc.deployWorkflow(workflows);
    // Create workers
    zbc.createWorker(null, 'task1', (job, complete) => complete.success({ ...job.variables }));
    zbc.createWorker(null, 'task2', (job, complete) => complete.success({ ...job.variables }));
    zbc.createWorker(null, 'task3', (job, complete) => complete.success({ ...job.variables }));
    zbc.createWorker(null, 'task4', (job, complete) => complete.success({ ...job.variables }));
    zbc.createWorker(null, 'task5', (job, complete) => {
        testStore[job.variables.testId].finished();
        complete.success({ ...job.variables });
    });
    // Execute tests
    console.log('Warming up...');
    for (const workflow of workflows) {
        const tests = [];
        for (let i = 0; i < 20; i++) {
            // console.log(`Testing ${workflow} ${i}/`)
            tests.push(await doTest(workflow.match(/.*\/(.*).bpmn/)[1]));
        }
    }
    for (const workflow of workflows) {
        const tests = [];
        for (let i = 0; i < 1; i++) {
            console.log(`Testing ${workflow} ${i}/`);
            tests.push(await doTest(workflow.match(/.*\/(.*).bpmn/)[1]));
        }
        console.log(workflow, {
            totalTime: `${lodash_1.default.sumBy(tests, 'totalTime') / tests.length}ms`,
            timeToStart: `${lodash_1.default.sumBy(tests, 'timeToStart') / tests.length}ms`,
            sumTimeBetweenTasks: `${lodash_1.default.sumBy(tests, 'sumTimeBetweenTasks') / tests.length}ms`,
            sumTimeWithinTasks: `${lodash_1.default.sumBy(tests, 'sumTimeWithinTasks') / tests.length}ms`,
            averageTimeBetweenTasks: `${lodash_1.default.sumBy(tests, 'averageTimeBetweenTasks') /
                tests.length}ms`,
            averageTimeWithinTasks: `${lodash_1.default.sumBy(tests, 'averageTimeWithinTasks') / tests.length}ms`,
        });
    }
    async function doTest(workflow) {
        const testId = uuid_1.v4();
        let resolve;
        const promise = new Promise(_resolve => (resolve = _resolve));
        const test = (testStore[testId] = {
            finished: resolve,
            startTime: Date.now(),
            tasks: [],
            testId,
        });
        await zbc.createWorkflowInstance(workflow, {
            testId,
        });
        await promise;
        test.endTime = Date.now();
        const totalTime = test.endTime - test.startTime;
        const timeToStart = test.tasks[0].startTime - test.startTime;
        let sumTimeBetweenTasks = testStore[testId].tasks.reduce((accumulator, task, index, tasks) => {
            if (tasks[index + 1]) {
                return accumulator + tasks[index + 1].startTime - task.endTime;
            }
            else {
                return accumulator;
            }
        }, 0);
        const averageTimeBetweenTasks = sumTimeBetweenTasks / (test.tasks.length - 1);
        let sumTimeWithinTasks = testStore[testId].tasks.reduce((accumulator, task) => {
            return accumulator + task.endTime - task.startTime;
        }, 0);
        const averageTimeWithinTasks = sumTimeWithinTasks / (test.tasks.length - 1);
        return {
            totalTime,
            timeToStart,
            sumTimeBetweenTasks,
            sumTimeWithinTasks,
            averageTimeBetweenTasks,
            averageTimeWithinTasks,
        };
    }
    process.exit();
}
main();
//# sourceMappingURL=index.js.map