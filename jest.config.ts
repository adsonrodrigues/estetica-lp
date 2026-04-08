import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'node',
          target: 'ES2020',
          esModuleInterop: true,
          strict: true,
          skipLibCheck: true,
          paths: {
            '@/*': ['./*'],
          },
        },
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
}

export default config
