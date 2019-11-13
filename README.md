# zeebe-performance-tests

```
npm i
npm run build
npm start
```

Will boot zeebe workers and a client before performing a number of tests.

You can edit the zeebe host url with ZEEBE_HOST or changing it at the top of src/index.ts

Relies on a custom instrumented branch of zeebe-node.

Takes some time to warm up the process first, but will run a workflow 20 times and log the:
- Total time taken
- Time between requesting to start the workflow instance and the first task being called
- Sum of all time "between tasks" (end of tasks A to start of task B)
- Average of time "between tasks" 
- Average of time within tasks (negligible in this demo)
