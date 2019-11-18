# zeebe-performance-tests

## Josh's test

```
npm i -g ts-node typescript
npm i
```

### Single-thread

```
cd src
ts-node one-thread
```

### Multi-threaded

```
cd src
```
In different terminals:
```
ts-node w1.ts
```

```
ts-node w2.ts
```

```
ts-node w3.ts
```

```
ts-node w4.ts
```

```
ts-node w5.ts
```

Start the test:

```
ts-node start.ts
```

## Results

One thread per worker, local:

```
➜ t start.ts   
Total time: 351ms
0ms in handler 1
13ms to broker ack complete 1  
0ms in handler 2
13ms to broker ack complete 2
0ms in handler 3
13ms to broker ack complete 3
0ms in handler 4
14ms to broker ack complete 4
0ms in handler 5
12ms to broker ack complete 5
Task 1: 71ms
Task 2: 56ms
Task 3: 53ms
Task 4: 58ms
Task 5: 56ms
```

One thread for everything, local:

```
v➜ t one-thread.ts
Total time: 333ms
0ms in handler 1
13ms to broker ack complete 1
1ms in handler 2
11ms to broker ack complete 2
0ms in handler 3
11ms to broker ack complete 3
0ms in handler 4
11ms to broker ack complete 4
1ms in handler 5
11ms to broker ack complete 5
{ end: 1574100970989 }
Task 1: 64ms
Task 2: 56ms
Task 3: 53ms
Task 4: 50ms
Task 5: 50ms
```