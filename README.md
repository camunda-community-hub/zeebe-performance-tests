# zeebe-performance-tests

```
npm i
npm run build
npm start
```

Will boot a zeebe server and client before performing a number of tests.

You can edit the zeebe host url with ZEEBE_HOST or changing it at the top of src/index.ts

Relies on a custom instrumented branch of zeebe-node

Takes some time to warm up the process first, but will run a workflow 20 times and log the:
- Total time taken
- Time between requesting to start the workflow instance and the first task being called
- Sum of all time "between tasks" (end of tasks A to start of task B)
- Average of time "between tasks" 
- Average of time within tasks (negligible in this demo)

# notes

Need to understand how long it takes to complete a workflow end to end, and how that that time is split between
	- Zeebe
    	- Starting the workflow
    	- Moving execution between tasks
    	- Making decisions
  	- Workers
  	- The network?

index.ts
	- upload the bpmn
	- load the workers
	- runs the performance test cases

Ok, so how are we going to get these timings?
Obviously you can have a worker note it's start and end time, but we need to colate all those for a particular test

So if it's all in the same process you could do that, but that means you can't have tests that test what happens when
	- you have many services
	- you have many workflows going at the same time

For these tests that's acceptable