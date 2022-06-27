# zeebe-performance-tests

This test measures the latency of the broker in transitioning between flow nodes. There is a theoretical maximum end-to-end performance

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
0ms in handler 1
13ms to broker ack complete 1
0ms in handler 2
12ms to broker ack complete 2
0ms in handler 3
13ms to broker ack complete 3
0ms in handler 4
12ms to broker ack complete 4
0ms in handler 5
14ms to broker ack complete 5

➜ ts-node start.ts
Total time: 171ms
Task 1: 27ms
Task 2: 33ms
Task 3: 22ms
Task 4: 24ms
Task 5: 22ms
```

One thread for everything, local:

```
➜ ts-node one-thread.ts

== Communication latency ==
24ms to broker ack complete 1
16ms to broker ack complete 2
15ms to broker ack complete 3
19ms to broker ack complete 4
16ms to broker ack complete 5

End-to-end time: 421ms

== Broker overhead ==
Start -> Task 1 start: 188ms
Task 1 end -> Task 2 start: 58ms
Task 2 end -> Task 3 start: 41ms
Task 3 end -> Task 4 start: 38ms
Task 4 end -> Task 5 start: 41ms
```

## Conclusions

With 8.0.2, there is a significant difference between single-thread and multi-threaded. This was not the case with 0.26, indicating that the broker latency is no longer the significant constraint it was back in 0.26, and worker performance now affects end-to-end execution time.