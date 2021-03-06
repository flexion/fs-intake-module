const moment = require('moment');
const vcapConstants = require('../../../vcap-constants.es6');
const util = require('../../../util.es6');

module.exports = application => {
  return {
    to: application.applicantInfoEmailAddress,
    subject: `An update on your recent permit application to the Forest Service.`,
    body: `
    Permit application status update
    *********************************

    Your recently submitted application has been put on hold due to insufficient information. Please log in, provide the requested information below, and save your application.

    ${application.applicantMessage}

    Login at ${vcapConstants.intakeClientBaseUrl}/applications/temp-outfitters/${application.appControlNumber}/edit


    Application details
    *********************************

    Application identification number: ${application.applicationId}
    Business name: ${application.applicantInfoOrganizationName}
    Start date: ${moment(application.tempOutfitterFieldsActDescFieldsStartDateTime, util.datetimeFormat).format(
      'MM/DD/YYYY hh:mm a'
    )}
    End date: ${moment(application.tempOutfitterFieldsActDescFieldsEndDateTime, util.datetimeFormat).format(
      'MM/DD/YYYY hh:mm a'
    )}
    Number of trips: ${application.tempOutfitterFieldsActDescFieldsNumTrips}
    Number of participants: ${application.tempOutfitterFieldsActDescFieldsPartySize}
    Services: ${application.tempOutfitterFieldsActDescFieldsServProvided}


    What happens next?
    **************************************

    1. Your application will be reviewed by our staff.
    2. If additional information is needed, a representative of the National Forest Service will contact you via email to resolve any issues.
    3. Once your application has been reviewed by our staff, you will be notified of the application status.
    4. If your application is approved, you will receive your permit within 2 weeks of approval.


    Contact us
    **************************************

    If you have questions or need to contact the permit staff at the National Forest Service, please use a method listed below.

    Temp outfitter contact
    Name: Sue Sherman-Biery
    Title: Special use administrator
    Phone: 360-854-2660
    Email: sshermanbiery@fs.fed.us

    Thank you for your interest in our National Forests.
    `
  };
};
