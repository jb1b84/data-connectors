const axios = require('axios');

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.activitySubscribe = (event, context) => {
  if (event.data) {
    const data = Buffer.from(event.data, 'base64').toString();

    const { aspect_type, object_id, object_type, owner_id } = JSON.parse(data);

    console.log(`
    User ID: ${owner_id} \n
    Action: ${aspect_type} ${object_type} \n
    Object ID: ${object_id}
  `);

    // get activity from strava if == activity create
    const stravaURL = 'https://www.strava.com/api/v3';
    let bearerToken = 'notatoken';
    // use bearer token
    axios
      .get(`${stravaURL}/activities/${object_id}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      .then(function (res) {
        // handle success
        let activityName = res.data.name;
        console.log('Activity received: ', activityName);

        // post to ES
      })
      .catch(function (err) {
        // handle error
        console.error(err);
      });
  }
};
