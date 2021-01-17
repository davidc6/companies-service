import config from "config"

const getEnvBasedDomain = (): string => `${config.get("domain")}:${config.get("port")}`

export { getEnvBasedDomain }
