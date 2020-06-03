import { STREAM_DL } from './config';

export const registerSettings = function () {
  game.settings.register(STREAM_DL.MODULE_NAME, STREAM_DL.SETTINGS.AUTH_KEY, {
    name: 'Authentication Key',
    hint: 'Key used ro authenticate against the stream-dl server',
    scope: 'world',
    config: true,
    default: '',
    type: String,
  });
  game.settings.register(STREAM_DL.MODULE_NAME, STREAM_DL.SETTINGS.BACKEND_URL, {
    name: 'stream-dl server url',
    hint: 'URL to the stream-dl backend',
    scope: 'world',
    config: true,
    default: '/stream-dl',
    type: String,
  });
  game.settings.register(STREAM_DL.MODULE_NAME, STREAM_DL.SETTINGS.DATA_PATH, {
    name: 'Download data path',
    hint: 'Folder the stream-dl backend saves the files in.',
    scope: 'world',
    config: true,
    default: 'stream-dl',
    type: String,
  });
};
