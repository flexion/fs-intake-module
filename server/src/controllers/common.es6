'use strict';

/**
 * Module for common controllers
 * @module controllers/common
 */

const NoncommercialApplication = require('../models/noncommercial-application.es6');
const TempOutfitterApplication = require('../models/tempoutfitter-application.es6');
const util = require('../util.es6');

const commonControllers = {};

/**
 * Generate a sequelize status condition based on the status group.
 */
const findOrCondition = req => {
  const statusGroup = req.params.statusGroup;
  let orCondition = [];
  switch (statusGroup) {
    case 'pending':
      orCondition = [
        {
          status: 'Submitted'
        },
        {
          status: 'Hold'
        },
        {
          status: 'Review'
        }
      ];
      break;
    case 'accepted':
      orCondition = [
        {
          status: 'Accepted'
        }
      ];
      break;
    case 'rejected':
      orCondition = [
        {
          status: 'Rejected'
        }
      ];
      break;
    case 'cancelled':
      orCondition = [
        {
          status: 'Cancelled'
        }
      ];
      break;
    case 'expired':
      orCondition = [
        {
          status: 'Expired'
        }
      ];
      break;
  }
  return orCondition;
};

/**
 * Get permit applications of every type.
 */
commonControllers.getPermitApplications = (req, res) => {
  const orCondition = findOrCondition(req);
  const andCondition = [];
  if (orCondition.length === 0) {
    return res.status(404).send();
  }
  if (util.getUser(req).role === 'user') {
    andCondition.push({
      authEmail: util.getUser(req).email
    });
  }
  const noncommercialApplicationsPromise = NoncommercialApplication.findAll({
    attributes: [
      'appControlNumber',
      'applicantInfoPrimaryFirstName',
      'applicantInfoPrimaryLastName',
      'applicationId',
      'createdAt',
      'eventName',
      'noncommercialFieldsEndDateTime',
      'noncommercialFieldsLocationDescription',
      'noncommercialFieldsStartDateTime',
      'status'
    ],
    where: {
      $or: orCondition,
      $and: andCondition,
      noncommercialFieldsEndDateTime: {
        $gt: new Date()
      }
    },
    order: [['createdAt', 'DESC']]
  });
  const tempOutfitterApplicationPromise = TempOutfitterApplication.findAll({
    attributes: [
      'appControlNumber',
      'applicantInfoOrganizationName',
      'applicantInfoPrimaryFirstName',
      'applicantInfoPrimaryLastName',
      'applicationId',
      'createdAt',
      'status',
      'tempOutfitterFieldsActDescFieldsEndDateTime',
      'tempOutfitterFieldsActDescFieldsLocationDesc',
      'tempOutfitterFieldsActDescFieldsStartDateTime'
    ],
    where: {
      $or: orCondition,
      $and: andCondition,
      tempOutfitterFieldsActDescFieldsEndDateTime: {
        $gt: new Date()
      }
    },
    order: [['createdAt', 'DESC']]
  });
  Promise.all([noncommercialApplicationsPromise, tempOutfitterApplicationPromise])
    .then(results => {
      for (let item of results[0]) {
        item.type = 'Noncommercial';
      }
      for (let item of results[1]) {
        item.type = 'Temp outfitter';
      }
      return res.status(200).json(results[0].concat(results[1]));
    })
    .catch(() => {
      return res.status(500).send();
    });
};

/**
 * Misc controllers
 * @exports commonControllers
 */
module.exports = commonControllers;
