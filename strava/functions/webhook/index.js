const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.helloWorld = async (req, res) => {
  if (req.method == 'POST') {
    console.log('webhook event received!', req.query, req.body);

    // References an existing topic
    const topic = pubsub.topic('strava-activity');

    // check for json first
    const messageBuffer = Buffer.from(JSON.stringify(req.body), 'utf8');

    // Publishes a message
    try {
      await topic.publish(messageBuffer);
      res.status(200).send('Event received and message published.');
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
      return Promise.reject(err);
    }
  } else if (req.method == 'GET') {
    console.log('webhook callback starting');
    const VERIFY_TOKEN = 'notatoken';

    // parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).json({ 'hub.challenge': challenge });
      } else {
        res.status(403).send('Unknown mode or token');
      }
    } else {
      res.status(403).send('Unsupported method');
    }
  }
};
