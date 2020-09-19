// @flow strict
const { expectAll, emojiReporter, booleanReporter } = require('@lukekaalim/test');

const test = async () => {
  console.warn('There are no tests');
  process.exitCode = 0;
};

if (require.main === module) {
  test();
}