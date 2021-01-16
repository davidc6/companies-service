import { expect } from 'chai'
import request from 'supertest'
import app from '../../src/index'

describe('error handler middleware', () => {
  it('should return 404 and a valid payload for non-existent routes', async () => {    
    const res = await request(app).get('/non-existent-route')
    
    expect(res.statusCode).to.equal(404)
    expect(res.body).to.deep.equal({ message: 'not found', })
  })
})
