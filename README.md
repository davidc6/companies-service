# Companies web service

[![Build Status](https://travis-ci.com/davidc6/companies-service.svg?token=rQoC61ZuGqZDdxu3Y8ZD&branch=main)](https://travis-ci.com/davidc6/companies-service)

:construction::construction_worker: Work in progress :construction::construction_worker:

This is an example of a web service written in Node.js. The idea is to have the API return a list of information about various tech companies.

Current demo url - https://companies-service.herokuapp.com/

## API

* `GET /` - returns all possible endpoints
* `GET /companies` - returns a list of companies

Operations that mutate data (see below) require an api key.

* `POST /companies` - create a new company
* `GET /companies/{company_id}` - returns information about a single company
* `DELETE /companies/{company_id}` - delete a single company
* `PATCH /companies/{company_id}` - update an existing company

## Environmental variables

* `API_KEYS` - api keys that allow access to restricted resources. Multiple keys should be separated by the comma (<api_key_one>,<api_key_two>). Not setting or leaving this variable will disable authentication.
* `PORT` - for setting the listening port.
* `DATABASE_URL` - a string that contains database information.
* `SUPPRESS_LOGS` - can be `true` or `false` and allows to suppress logging; this is helpful when developing locally

## Authentication

API key-based authentication can be used to limit access to all endpoints but `/`. This is controlled by settings an environmental variable (`API_KEYS`). The key is sent via the `x-api-key` header.

## Logging

The current version of the service logs to console only. A proper logging service should be used in production. On top of that more sensitive information (such as ip address, user agent, etc.) should be logged.

## Testing

* To run unit tests: `npm run test:unit`
* To run integration tests: `npm run test:integration`
* To run all tests: `npm run test`

Tests against the actual test database are in work in progress. 

### Todo list:

- Documentation (needs updating)
- Content negotiation (https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation)
