const joi = require('joi')
const schema = require('../lib/schema')
const getSubscriptions = require('../lib/get-subscriptions')
const deleteSubscriptions = require('../lib/delete-subscriptions')
const updateSubscriptions = require('../lib/update-subscriptions')

module.exports = [
  {
    method: 'GET',
    path: '/subscriptions',
    handler: async (request, h) => {
      const { address, channelType } = request.query

      const result = await getSubscriptions(address, channelType)

      return {
        result
      }
    },
    options: {
      validate: {
        query: joi.object().keys({
          address: schema.address,
          channelType: schema.channelType
        })
      },
      description: 'Get subscriptions for a given address/channel'
    }
  },
  {
    method: 'POST',
    path: '/subscriptions',
    handler: async (request, h) => {
      const { address, channelType, topics } = request.payload

      const result = await updateSubscriptions(address, channelType, topics)

      return {
        result
      }
    },
    options: {
      validate: {
        payload: joi.object().keys({
          address: schema.address,
          channelType: schema.channelType,
          topics: schema.topics
        })
      },
      description: 'Create subscriptions for a given address/channel'
    }
  },
  {
    method: 'PUT',
    path: '/subscriptions',
    handler: async (request, h) => {
      const { address, channelType, topics } = request.payload

      const result = await updateSubscriptions(address, channelType, topics)

      return {
        result
      }
    },
    options: {
      validate: {
        payload: joi.object().keys({
          address: schema.address,
          channelType: schema.channelType,
          topics: schema.topics
        })
      },
      description: 'Update subscriptions for a given address/channel'
    }
  },
  {
    method: 'DELETE',
    path: '/subscriptions',
    handler: async (request, h) => {
      const { address, channelType } = request.payload

      const result = await deleteSubscriptions(address, channelType)

      return {
        result
      }
    },
    options: {
      validate: {
        payload: joi.object().keys({
          address: schema.address,
          channelType: schema.channelType
        })
      },
      description: 'Delete all subscriptions for a given address/channel'
    }
  }
]
