#!/usr/bin/env tsx
import { Command } from 'commander'
import crypto from 'crypto'

const program = new Command()

program
  .name('cli')
  .description('Custom CLI for Colyseus server')
  .version('1.0.0')

// Subcommand: gen-secret
program
  .command('gen-secret')
  .description('Generate a random base64 secret')
  .option('-l, --length <number>', 'Length of secret', '32')
  .action((options) => {
    const length = parseInt(options.length, 10)
    const secret = crypto.randomBytes(length).toString('base64')
    console.log(secret)
  })

// Subcommand: gen-env
program
  .command('gen-env')
  .description('Generate secrets for AUTH_SALT, JWT_SECRET, SESSION_SECRET')
  .action(() => {
    const authSalt = crypto.randomBytes(32).toString('base64')
    const jwtSecret = crypto.randomBytes(32).toString('base64')
    const sessionSecret = crypto.randomBytes(32).toString('base64')

    console.log(`AUTH_SALT=${authSalt}`)
    console.log(`JWT_SECRET=${jwtSecret}`)
    console.log(`SESSION_SECRET=${sessionSecret}`)
  })

program.parse(process.argv)
