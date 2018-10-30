module.exports = {
  plugins: [['@babel/plugin-proposal-class-properties', { loose: false }]],
  presets: ['@babel/preset-env', '@babel/preset-react'],
  env: {
    production: {
      plugins: [['react-remove-properties', { properties: ['data-testid'] }]]
    }
  }
};
