import { STREAM_DL } from './config';

export const preloadTemplates = async function () {
  const templatePaths = [STREAM_DL.TEMPLATES.STREAM_DL_PATH];

  return loadTemplates(templatePaths);
};
