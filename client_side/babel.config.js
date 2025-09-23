module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          alias: {
            "@app": "./app",
            "@assets": "./assets",
            "@components": "./src/presentation/shared/components",
            "@constants": "./src/presentation/shared/constants",
            "@hooks": "./src/presentation/shared/hooks",
            "@theme": "./src/presentation/shared/theme",
            "@screens": "./src/presentation/screens",
            "@state": "./src/presentation/state",
            "@i18n": "./src/presentation/shared/i18n",
            "@model": "./src/model",
          },
        },
      ],
    ],
  };
};
