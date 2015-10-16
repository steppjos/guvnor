var pkg = require('../../../package.json')
var path = require('path')

module.exports = function start (user, api, yargs) {
  var argv = yargs
    .usage('Usage: $0 start [options] <script>')
    .demand(4)
    .example('$0 start hello.js', 'Start a script')
    .example('$0 start -n goodbye hello.js', 'Start a script with a name')

    .help('h')
    .alias('h', 'help')

    .describe('group', 'The group to start a process as')
    .alias('g', 'group')
    .default('g', user.group)

    .describe('cwd', 'The current working directory for the script')
    .alias('c', 'cwd')

    .describe('instances', 'How many instances of the process to start')
    .alias('i', 'instances')
    .default('i', 1)

    .describe('name', 'What name to give the process')
    .alias('n', 'name')

    .describe('argv', 'A space separated list of arguments to pass to a process')
    .alias('a', 'argv')
    .array('a')
    .default('a', [])

    .describe('execArgv', 'A space separated list of arguments to pass to the node exectuable')
    .alias('e', 'execArgv')
    .array('e')
    .default('e', [])

    .describe('debug', 'Pause the process at the start of execution and wait for a debugger to be attached')
    .alias('d', 'debug')
    .boolean('d')

    .describe('chroot', 'A path to a folder which will form a chroot jail for the process')
    .alias('r', 'chroot')

    .describe('verbose', 'Prints detailed internal logging output')
    .alias('v', 'verbose')
    .boolean('v')

    .epilog('Guvnor v' + pkg.version)
    .argv

  var script = yargs.argv._[3]

  if (!path.isAbsolute(script)) {
    script = path.resolve(path.join(process.cwd(), script))
  }

  api.process.start(script, {
    group: argv.group,
    instances: argv.instances,
    name: argv.name,
    argv: argv.argv,
    execArgv: argv.execArgv,
    debug: argv.debug,
    env: process.env,
    chroot: argv.chroot,
    cwd: argv.cwd,
    interpreter: process.execPath
  }, function (error, proc) {
    if (error) {
      throw error
    }

    console.info('Process %s started', proc.name)
    api.disconnect()
  })
}