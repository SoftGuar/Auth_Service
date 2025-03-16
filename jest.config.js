module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/app/tests/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};