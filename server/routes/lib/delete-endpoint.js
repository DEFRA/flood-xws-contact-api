const AWS = require('aws-sdk')
// const getEndpointFromAddress = require('./get-endpoint-from-address')
const pinpointApplicationId = process.env.PINPOINT_APPLICATION_ID
const pinpoint = new AWS.Pinpoint()

async function deleteEndpoint (endpointId) {
  // const endpointId = getEndpointFromAddress(address, channelType)

  const params = {
    ApplicationId: pinpointApplicationId,
    EndpointId: endpointId
  }

  const pinpointResult = await pinpoint.deleteEndpoint(params).promise()

  return {
    pinpointResult
  }
}

module.exports = deleteEndpoint
