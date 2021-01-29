# Companies web service

[![Build Status](https://travis-ci.com/davidc6/companies-service.svg?token=rQoC61ZuGqZDdxu3Y8ZD&branch=main)](https://travis-ci.com/davidc6/companies-service)

:construction::construction_worker: Work in progress :construction::construction_worker:

This is an example of a web service written in Node.js.

Current demo url - https://companies-service.herokuapp.com/

## API

* `/` - returns all possible endpoints
* `/companies` - returns a list of companies
* `/companies/{company_id}` - returns information about a single company

## Environmental variables

* `API_KEYS` - api keys that allow access to restricted resources. Multiple keys should be separated by the comma (<api_key_one>,<api_key_two>). Not setting or leaving this variable will disable authentication.
* `PORT` - for setting the listening port.
* `DATABASE_URL` - a string that contains database information. 

## Authentication

API key-based authentication can be used to limit access to all endpoints but `/`. This is controlled by settings an environmental variable (`API_KEYS`)

## Logging

The current version of the service logs to console only. A proper logging service should be used in production. On top of that more sensitive information (such as ip address, user agent, etc.) should be logged.

## Testing

* To do

### Todo list:

- Documentation (needs updating)
- Content negotiation (https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation)
