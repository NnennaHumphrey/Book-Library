export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
};
