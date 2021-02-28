# Companies web service

[![Build Status](https://travis-ci.com/davidc6/companies-service.svg?token=rQoC61ZuGqZDdxu3Y8ZD&branch=main)](https://travis-ci.com/davidc6/companies-service)

:construction::construction_worker: Work in progress :construction::construction_worker:

This is an example of a web service written in Node.js. The idea is to have the API return a list of information about various tech companies.

Current demo url - https://companies-service.herokuapp.com/

## API endpoints

* `GET /` - returns all possible accessible endpoints
* `GET /companies` - returns a list of companies
* `GET /companies/{company_id}` - returns information about a single company

Operations that mutate data (see below) require an api key.

* `POST /companies` - creates a new company
* `DELETE /companies/{company_id}` - deletes a single company
* `PATCH /companies/{company_id}` - updates (fully or partially) an existing company

## Environmental variables

* `API_KEYS` - api keys that allow access to restricted resources. Multiple keys can be included and a comma should be used to separate values (<api_key_one>,<api_key_two>). Not setting or leaving this variable empty will disable authentication.
* `PORT` - port to listen on
* `DATABASE_URL` - a string that contains database information
* `SUPPRESS_LOGS` - can be `true` or `false` and allows to suppress logging. This is useful when developing locally

## Authentication

API key-based authentication can be used to limit access to endpoints that mutate data. This is controlled by settings `API_KEYS ` environmental variable. The key is sent via the `x-api-key` header.

## Logging

The current version of the service logs to stdout only. A proper logging service should be used in production. Sensitive information (such as ip addresses, user agents, etc.) could be logged for security purposes.

## Database schemas

### Industries table

```
| id        | industry_id    | description    |
|-----------|----------------|----------------|
| integer   | varchar(50)    | varchar(50)    | 
```

## Testing

* To run unit tests: `npm run test:unit`
* To run integration tests: `npm run test:integration`
* To run all tests: `npm run test`

Tests against the actual test database are in work in progress. 

### Todo list:

- Documentation (needs updating)
- Content negotiation (https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation)
