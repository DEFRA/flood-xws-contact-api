const Wreck = require('@hapi/wreck')
const interpolate = require('xws-shared/util/interpolate')

const joi = require('joi')
const schema = require('../lib/schema')
const { contactGetUrl, subscriptionPostUrl } = require('../config.js')

async function contactExists (contactId) {
  try {
    const url = interpolate(contactGetUrl, { contactId })
    const res = await Wreck.request('HEAD', url)
    return res.statusCode === 200
  } catch (error) {
    return false
  }
}

module.exports = [
  {
    method: 'POST',
    path: '/subscriptions',
    handler: async (request, h) => {
      const { contactId, areaCode, channelName, wnlif } = request.payload

      if (!await contactExists(contactId)) {
        throw Error(`contact ${contactId} does not exist`)
      }

      // Do other stuff here: audit subscriptions, raise event, send welcome email

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
        console.log({ error })
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
