import { Request } from "express"

const getEnvBasedDomain = (req: Request): string => `${req.protocol}://${req.get("Host")}`

export { getEnvBasedDomain }
