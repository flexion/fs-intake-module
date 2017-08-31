module.exports = {
  id: '/applicantInfoBase',
  type: 'object',
  properties: {
    primaryFirstName: {
      default: '',
      maxLength: 255,
      type: 'string'
    },
    primaryLastName: {
      default: '',
      maxLength: 255,
      type: 'string'
    },
    secondaryFirstName: {
      default: '',
      maxLength: 255,
      type: 'string'
    },
    secondaryLastName: {
      default: '',
      maxLength: 255,
      type: 'string'
    },
    dayPhone: { $ref: '/phoneNumber' },
    anyOf: [
      { eveningPhone: { $ref: '/phoneNumber' } },
      { secondaryAddress: { $ref: '/address' } },
      { organizationAddress: { $ref: '/address' } },
      { primaryAddress: { $ref: '/address' } },
      { faxNumber: { $ref: '/phoneNumber' } }
    ],
    emailAddress: {
      default: '',
      pattern:
        "^(([^<>()\\[\\]\\\\.,;:\\s@']+(\\.[^<>()\\[\\]\\\\.,;:\\s@']+)*)|('.+'))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$",
      type: 'string'
    }
  },
  required: ['primaryFirstName', 'primaryLastName', 'dayPhone', 'emailAddress']
};
