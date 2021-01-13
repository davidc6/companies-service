import request from 'supertest'
import { expect } from 'chai'
import app from '../src/index'

describe('GET /', () => {
  it('should respond with status 200', async () => {
    const res = await request(app).get('/')
      
    expect(res.status).to.equal(200)
  })
  
  it('should respond with valid payload', async () => {
    const res = await request(app).get('/')
      
    expect(res.status).to.equal(200)
    expect(res.headers['content-type']).to.include('json')      
    expect(res.body).to.deep.equal({ status: 'ok' })
  })
})

