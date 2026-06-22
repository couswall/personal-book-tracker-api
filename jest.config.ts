import type {Config} from 'jest';

const config: Config = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@domain/(.*)$': '<rootDir>/src/domain/$1',
        '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
        '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@data/(.*)$': '<rootDir>/src/data/$1',
        '^@tests/(.*)$': '<rootDir>/tests/$1',
    },
    preset: 'ts-jest',
    setupFiles: ['<rootDir>/setupTests.ts'],
    testEnvironment: 'jest-environment-node',
    transform: {'^.+\\.(ts|tsx)$': 'ts-jest'},
};

export default config;
