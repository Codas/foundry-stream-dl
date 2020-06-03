import { STREAM_DL } from './config';
import { sanitize } from './sanitize-filename';

interface StreamFormData {
  url: string;
  playlist: string;
  title: string;
  filename: string;
  saveTrack: boolean;
}

interface DownloadResponse {
  filename: string;
}

export function _onRenderPlaylistDirectory(app: Application, html: JQuery, data: any) {
  _addStreamConfig(html);
}

function _addStreamConfig(html: JQuery) {
  const playlistFooter = html.find('.directory-footer');
  const streamButtonHtml = `<button type="button" class="stream-dl-button">
<span class="fa-stack fa-xs">
  <i class="fas fa-cloud fa-stack-2x"></i>
  <i class="fas fa-music fa-stack-1x fa-inverse" style="left: -1px; top: 1px;"></i>
</span>
  <span>Stream DL</span>
</button>`;
  playlistFooter.prepend(streamButtonHtml);
  const streamButton = html.find('.stream-dl-button');
  streamButton.on('click', (evt) => {
    new StreamDlForm({}).render(true);
  });
}

class StreamDlForm extends FormApplication {
  /**
   * Default Options for this FormApplication
   */
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      id: 'stream-dl-form',
      title: 'Stream Download',
      template: STREAM_DL.TEMPLATES.STREAM_DL_PATH,
      classes: ['sheet'],
      width: 500,
    };
  }

  get isEditable(): boolean {
    return !this.data.isSaving;
  }

  private config = {
    authKey: game.settings.get(STREAM_DL.MODULE_NAME, STREAM_DL.SETTINGS.AUTH_KEY),
    backendUrl: game.settings.get(STREAM_DL.MODULE_NAME, STREAM_DL.SETTINGS.BACKEND_URL),
    dataPath: game.settings.get(STREAM_DL.MODULE_NAME, STREAM_DL.SETTINGS.DATA_PATH),
  };

  constructor(private data: any, options?: FormApplicationOptions) {
    super({...data, saveTrack: true}, {...options, closeOnSubmit: false});
  }

  protected _updateObject(event: Event | JQuery.Event, formData: any): Promise<any> {
    if (!formData.playlist || !formData.title || !formData.url) {
      return;
    }
    this.data = {
      ...(this.data ?? null),
      ...formData,
      isSaving: true,
    };
    this.render();
    this.downloadStream(formData);
  }

  /**
   * Provide data to the template
   */
  getData() {
    return {
      ...this.data,
      playlists: game.playlists.entities,
    };
  }

  private async downloadStream(formData: StreamFormData): Promise<any> {
    try {
      const sanitizedTitle = sanitize(formData.title, '_');
      const filename = !formData.filename || formData.filename.endsWith('/')
        ? `${formData.filename}${sanitizedTitle}`
        : formData.filename;
      const res: DownloadResponse = await $.ajax({
        method: 'POST',
        url: `${this.config.backendUrl}/download`,
        contentType: 'application/json',
        headers: {
          'x-api-key': this.config.authKey,
        },
        dataType: 'json',
        data: JSON.stringify({
          title: filename,
          url: formData.url,
        }),
      }).promise();

      // @ts-ignore
      ui.notifications.info(`Track successfully created as "${formData.title}".`);

      if (!formData.saveTrack) {
        await this.close();
        return;
      }
      const playlist = game.playlists.get(formData.playlist);
      const path = `${this.config.dataPath}/${res.filename}`;
      await playlist.createEmbeddedEntity('PlaylistSound', {name: formData.title, path});
      await this.close();
    } catch (e) {
      // @ts-ignore
      ui.notifications.error(`Could not create track. See console for details.`);
      console.error(e);
      this.data.isSaving = false;
      this.render();
    }
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);

    const saveTrackCheckbox = html.find('input[name="saveTrack"]');

    saveTrackCheckbox.on('change', event => {
      this.data.saveTrack = (event.target as HTMLInputElement).checked;
      this.render();
    });
  }
}
