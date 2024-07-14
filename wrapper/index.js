const { invoke } = require('./invoker')
const { connect, StringCodec, AckPolicy } = require('nats')
const {
  broker_servers,
  request_subject,
  stream_name,
  response_subject_prefix,
} = require('./config')

const logger = console

;(async function () {
  const nc = await connect({ servers: broker_servers })
  const jsm = await nc.jetstreamManager()

  if (!jsm) {
    throw new Error("JetStream manager wasn't initialized")
  }

  const consumer_info = await jsm.consumers.add(stream_name, {
    name: `request-${Date.now()}`,
    ack_policy: AckPolicy.Explicit,
    filter_subject: request_subject,
  })

  js = jsm.jetstream()

  sc = StringCodec()
  async function subscribe_handler(message) {
    const subject = message.subject
    const reply = message.reply
    const data = sc.decode(message.data)
    logger.debug("Received a message on '%s %s' %s", subject, reply, data)

    const response = await invoke(data, null)

    const id = subject.split('.')[1]
    if (!id) {
      logger.warning("Can't retrieve id from %s", message.subject)
      return
    }
    response_subject = `${response_subject_prefix}.${id}`
    logger.debug('Response to %s', response_subject)

    if (response) {
      await js.publish(response_subject, response)
      await message.ack()
    } else {
      logger.warn('Response from function is None')
      await message.ack()
    }
  }

  const consumer = await js.consumers.get(stream_name, consumer_info.name)

  async function signal_handler() {
    if (nc.isClosed()) {
      logger.info('Connection to NATS already closed')
      logger.info('Terminated')
      process.exit(0)
    }
    logger.info('Remove consumer')
    await jsm.consumers.delete(stream_name, consumer_info.name)
    logger.info('Close connection to NATS')
    await nc.close()
    logger.info('Terminated')
    process.exit(0)
  }

  process.once('SIGINT', signal_handler)
  process.once('SIGTERM', signal_handler)

  while (true) {
    const messages = await consumer.consume()
    for await (const message of messages) {
      try {
        // this is simplest but could also create a head-of-line blocking
        // as no other message on the current buffer will be processed until
        // this iteration completes
        await subscribe_handler(message)
      } catch (err) {
        logger.error(err)
        // message.nack();
      }
    }
  }
})()
