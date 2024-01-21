//jest.config.js
module.exports = {
    testEnvironment:'node',
    collectiveCoverage:true,
    coverageDirectory:'coverage',
    collectiveCoverageFrom: ['express-biztime/**/*.js'],
    coverageReporters: ['Icov', 'text']
};