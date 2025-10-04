export default [
  {
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@app', './app'],
            ['@src', './src'],
            ['@assets', './assets'],

            ['@infra', './src/infra'],

            ['@domain', './src/domain'],
            ['@model', './src/domain/model'],
            ['@usecase', './src/domain/usecase'],

            ['@presentation', './src/presentation'],
            ['@i18n', './src/presentation/shared/i18n'],
            ['@theme', './src/presentation/shared/theme'],
            ['@hooks', './src/presentation/shared/hooks'],
            ['@shared', './src/presentation/shared'],
            ['@screens', './src/presentation/screens'],
            ['@constants', './src/presentation/shared/constants'],
            ['@components', './src/presentation/shared/components']
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        }
      }
    }
  }
];
