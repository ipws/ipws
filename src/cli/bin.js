#! /usr/bin/env node

'use strict'

const program = require('commander')

const IPWS = require('..')

const ipws = new IPWS()

program
  .version(`ipws version ${IPWS.version}`)

program
  .command('init')
  .description('init ipws')
  .action(() => {
    let action = async () => {
      let [err] = await ipws.init()
      if (err) {
        console.log(err.message)
        return
      }
      console.log('ipws successfully initialized!')
    }
    action()
  })

program
  .command('publish')
  .description('publish ipws')
  .action(() => {
    let action = async () => {
      let [err, hash] = await ipws.publish()
      if (err) {
        console.log(err.message)
        return
      }
      console.log(`ipws ${hash} successfully published!`)
    }
    action()
  })

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
