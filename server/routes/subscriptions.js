const Wreck = require('@hapi/wreck')
const interpolate = require('xws-shared/util/interpolate')

const joi = require('joi')
const schema = require('../lib/schema')
const updateEndpoint = require('./lib/update-endpoint')
const { contactGetUrl, subscriptionPostUrl } = require('../config.js')

async function getContact (contactId) {
  const url = interpolate(contactGetUrl, { contactId })
  const response = await Wreck.get(url)
  const { payload } = response
  const [contact] = JSON.parse(payload)

  return contact
}

module.exports = [
  {
    method: 'POST',
    path: '/subscriptions',
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
      const { res } = await Wreck.post(subscriptionPostUrl, { payload: postData })
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
      description: 'Create subscriptions for a given address/channel'
    }
  }
]
