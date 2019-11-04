process.env.NODE_ENV = 'integration-testing';
const Jasmine = require('jasmine');
const JasmineConsoleReporter = require('jasmine-console-reporter');
const jasmine = new Jasmine();
const reporter = new JasmineConsoleReporter({
  colors: 1,
  cleanStack: 3,
  verbosity: 4,
  listStyle: 'indent',
  activity: false
});
jasmine.addReporter(reporter);
jasmine.showColors(true);
jasmine.loadConfigFile(`${__dirname}/support/jasmine.json`);
jasmine.execute();
