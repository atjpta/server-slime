import { Program } from './program'

export * from './program'
export * from './reset-db'
export * from './gen-secret-key'

Program.parse(process.argv)
