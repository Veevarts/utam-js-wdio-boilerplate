// This project structure follows the default convention.
// We export an empty object as there's no need to configure the compiler in that case.
module.exports = {
        // file masks for utam page objects
        pageObjectsFileMask: ['src/**/__utam__/**/*.utam.json'],
        // output folder for generated page objects, relative to the package root
        pageObjectsOutputDir: 'pageObjects',
};
