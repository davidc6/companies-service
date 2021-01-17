import { expect } from 'chai'
import { logger } from '../../src/utils/logger'

describe('logger utility', () => {  
  it('should return an instance of winston', () => {
    expect(typeof logger).to.equal('object')
    expect(logger.defaultMeta).to.deep.equal({ service: 'companies-service', })
  })
})
