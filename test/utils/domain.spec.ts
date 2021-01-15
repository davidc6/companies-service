import { expect } from 'chai'
import sinon from 'sinon'
import config from 'config'
import * as domain from '../../src/utils/domain'

const sandbox = sinon.createSandbox()

describe('domain utility', () => {

  afterEach(() => {
    sandbox.restore()
  })
  
  it('should return a domain based on config values', () => {
    const s = sandbox.stub(config, 'get');
    s.withArgs('domain').returns('fake-domain')
    s.withArgs('port').returns('0000')

    expect(domain.getEnvBasedDomain()).to.equal('fake-domain:0000')
  })
})
