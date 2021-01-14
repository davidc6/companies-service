import config from 'config'

const getEnvBasedDomain = () => `${config.get('domain')}:${config.get('port')}`

export { getEnvBasedDomain }
