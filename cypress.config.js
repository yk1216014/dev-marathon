const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        // ローカル開発用デフォルトURL
        baseUrl: 'http://localhost:5465',
        // テストファイルのパターン
        specPattern: 'test/cypress/*.cy.js',
        supportFile: false, // 今回はsupportFileを使用しない
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
