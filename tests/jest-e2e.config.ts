import type { Config } from '@jest/types';
import baseConfig from '../jest.config';

const config: Config.InitialOptions = {
    ...baseConfig,
    testRegex: '.e2e-spec.ts$',
    rootDir: '..',
    testTimeout: 20000
};

export default config;