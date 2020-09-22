module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['js','ts'],
    modulePathIgnorePatterns: ['lib'],
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.json'
        }
    },
    rootDir: '../'
};
