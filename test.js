// @flow strict
const { expectAll, emojiReporter, booleanReporter } = require('@lukekaalim/test');

const { expectIntegration } = require('./test/integration');

const test = async () => {
  console.time('test()');
  const expectHttpClient = expectAll('http-client', [expectIntegration]);
  const assertion = await expectHttpClient.test();
  console.log(emojiReporter(assertion));
  console.timeEnd('test()');
  process.exitCode = booleanReporter(assertion) ? 0 : 1;
};

if (require.main === module) {
  test();
}