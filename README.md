# Data Connectors
Some general utils for moving data from one app to another

## Strava
2 serverless functions for:
1) Webhook registered with Strava
   1) handles OAuth
   2) creates subscription for user
   3) receives POSTs when new activity happens
   4) pubs that activity to a topic
2) Sub topic to:
   1) go fetch that updated activity from Strava API
   2) dump the data into elasticsearch
