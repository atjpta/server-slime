import { Command } from 'commander'

const program = new Command()

program
  .name('cli')
  .description('Custom CLI for Colyseus server')
  .version('1.0.0')

export const Program = program
