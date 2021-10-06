const Wreck = require('@hapi/wreck')
const interpolate = require('xws-shared/util/interpolate')

const joi = require('joi')
const schema = require('../lib/schema')
const updateEndpoint = require('./lib/update-endpoint')
const deleteEndpoint = require('./lib/delete-endpoint')
const {
  contactGetUrl,
  subscriptionGetUrl,
  subscriptionPostUrl,
  subscriptionPatchUrl,
  subscriptionDeleteUrl
} = require('../config.js')

async function getContact (contactId) {
  const url = interpolate(contactGetUrl, { contactId })
  const response = await Wreck.get(url)
  const { payload } = response
  const [contact] = JSON.parse(payload)
  return contact
}

async function getSubscription (subscriptionId) {
  try {
    const url = interpolate(subscriptionGetUrl, { subscriptionId })
    const { payload } = await Wreck.get(url)
    const [subscription] = JSON.parse(payload)
    return subscription
  } catch (error) {
    console.error({ subscriptionGetUrl, error })
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/subscription/{subscriptionId}',
    handler: async (request, h) => {
      const { subscriptionId } = request.params
      try {
        // await getEndpoint(subscriptionId)
      } catch (error) {
        console.log({ message: 'Delete endpoint failed', error })
        return 500
      }

      return await getSubscription(subscriptionId)
    },
    options: {
      validate: {
        params: joi.object({
          subscriptionId: schema.subscriptionId
        })
      },
      description: 'Get subscription'
    }
  },
  {
    method: 'DELETE',
    path: '/subscription/{subscriptionId}',
    handler: async (request, h) => {
      const { subscriptionId } = request.params
      try {
        await deleteEndpoint(subscriptionId)
      } catch (error) {
        console.log({ message: 'Delete endpoint failed', error })
        return 500
      }

      const url = interpolate(subscriptionDeleteUrl, { subscriptionId: request.params.subscriptionId })
      const { res } = await Wreck.delete(url)
      return res.statusCode
    },
    options: {
      validate: {
        params: joi.object({
          subscriptionId: schema.subscriptionId
        })
      },
      description: 'Delete subscription'
    }
  },
  {
    method: 'PATCH',
    path: '/subscription',
    handler: async (request, h) => {
      console.log({ payload: request.payload })
      const { contactId, areaCode, channelName, wnlif } = request.payload
      const contact = await getContact(contactId)
      if (!contact) {
        throw Error(`contact ${contactId} does not exist`)
      }

      try {
        await updateEndpoint(contact.value, channelName.toUpperCase(), [areaCode])
      } catch (error) {
        console.log({ message: 'Update endpoint failed', error })
        return 500
      }

      const postData = {
        contactId,
        areaCode,
        channelName,
        wnlif
      }
      const { res } = await Wreck.post(subscriptionPatchUrl, { payload: postData })
      return res.statusCode
    },
    options: {
      validate: {
        payload: joi.object().keys({
          contactId: schema.contactId,
          channelName: schema.channelName,
          areaCode: schema.areaCode,
          wnlif: schema.wnlif
        })
      },
      description: 'Update subscriptions for a given address/channel'
    }
  },
  {
    method: 'POST',
    path: '/subscription',
    handler: async (request, h) => {
      const { contactId, areaCode, channelName, wnlif } = request.payload
      const contact = await getContact(contactId)
      if (!contact) {
        throw Error(`contact ${contactId} does not exist`)
      }

      try {
        await updateEndpoint(contact.value, channelName.toUpperCase(), [areaCode])
      } catch (error) {
        console.log({ message: 'Update endpoint failed', error })
        return 500
      }

      const postData = {
        contactId,
        areaCode,
        channelName,
        wnlif
      }
      try {
        const { res } = await Wreck.post(subscriptionPostUrl, { payload: postData })
        return res.statusCode
      } catch (error) {
        console.log({ message: 'Subscription Post Error', error, postData })
        return 500
      }
    },
    options: {
      validate: {
        payload: joi.object().keys({
          contactId: schema.contactId,
          channelName: schema.channelName,
          areaCode: schema.areaCode,
          wnlif: schema.wnlif
        })
      },
      description: 'Create subscriptions for a given address/channel'
    }
  }
]
