module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-replacer',
        {
          'replacements': {
            'console.log': function () {
              return null;
            },
          },
        },
      ],
    ],
  };
};
