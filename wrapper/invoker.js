const { JSONCodec } = require('nats')
const lambda = require('../index')

const logger = console

const jc = JSONCodec()

exports.invoke = async function invoke(event, data) {
  let event_obj = event
  if (typeof event === 'string') {
    event_obj = JSON.parse(event)
  }
  try {
    const response = await lambda.handler(event_obj, data)
    if (response) {
      return jc.encode(response)
    }
  } catch (error) {
    logger.log(error)
  }
}
