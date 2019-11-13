# zeebe-performance-tests

Need to understand how long it takes to complete a workflow end to end, and how that that time is split between
	- Zeebe
    	- Starting the workflow
    	- Moving execution between tasks
    	- Making decisions
  	- Workers
  	- The network

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