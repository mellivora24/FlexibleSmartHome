export default [
  {
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@constants', './src/presentation/shared/constants'],
            ['@assets', './assets'],
            ['@components', './src/presentation/shared/components'],
            ['@hooks', './src/presentation/shared/hooks'],
            ['@theme', './src/presentation/shared/theme'],
            ['@screens', './src/presentation/screens'],
            ['@state', './src/presentation/state'],
            ['@app', './app'],
            ['@i18n', './src/presentation/shared/i18n'],
            ['@domain', './src/domain'],
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        }
      }
    }
  }
];
