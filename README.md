#amqp-consume-cli

Command line tools for consuming messages direct from queues on AMQP servers like RabbitMQ.

A fork from [amqp-cli](https://github.com/cthayer/node-amqp-cli) to get around limitations in the `@sazze/amqp` library that was being used (such as automatically trying to bind to `amqp.direct`).

##Install

```bash
npm install -g amqp-consume-cli
```

##Consume

```bash
amqp-consume --help
```

##About

This CLI tool was forked to provide a simple CLI for consuming realtime data from [Ably realtime](https://www.ably.io) using [Ably Reactor Queues](https://www.ably.io/reactor). Messages published on [pub/sub channels](https://www.ably.io/documentation/realtime/channels-messages) are pushed onto AMQP/STOMP compatible queues using queue rules. These messages can be consumed by servers in real time over AMQP/STOMP protocols. [Find our more about Ably Queues](https://www.ably.io/reactor).
