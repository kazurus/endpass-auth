// @ts-check
import { VuexModule, Action, Module, Mutation } from 'vuex-class-modules';
import get from 'lodash/get';
import createController from '@/controllers/createController';

import documentsService from '@/service/documents';
import ProgressTimer from '@/class/ProgressTimer';
import { UPLOAD_CODE_ERRORS } from '../sidesConstants';
import NonReactive from '@/class/NonReactive';
import i18n from '@/locales/i18n';

@Module({ generateMutationSetters: true })
class FrontSideController extends VuexModule {
  /**
   * @type {string}
   */
  docId = '';

  /**
   * @type {number}
   */
  progress = 0;

  /**
   * @type {string}
   */
  progressLabel = '';

  /**
   *
   * @param {import('vuex-class-modules').RegisterOptions} props
   */
  constructor(props) {
    super(props);
    this.timer = new NonReactive(/** @type {ProgressTimer} */ ({}));
  }

  /**
   * @return {import('axios').AxiosRequestConfig}
   */
  getUploadRequestConfig() {
    return {
      /**
       * @param {{
       *   loaded: number,
       *   total: number
       * }} progressEvent
       */
      onUploadProgress: ({ loaded, total }) => {
        const value = Math.round((loaded * 100) / total) || 0;
        const nextValue = value < 98 ? value : 98;
        this.getTimer().setProgress(nextValue);
      },
    };
  }

  /**
   * @return {ProgressTimer}
   */
  getTimer() {
    if (!(this.timer.value instanceof ProgressTimer)) {
      const timer = new ProgressTimer();
      timer.on(
        /**
         * @param {number} value
         */
        value => this.setProgress(value),
      );
      this.setTimer(timer);
    }
    return /** @type {ProgressTimer} */ (this.timer.value);
  }

  /**
   *
   * @param {number} value
   */
  @Mutation
  setProgress(value) {
    this.progress = Math.floor(value);
  }

  /**
   *
   * @param {ProgressTimer} timer
   */
  @Mutation
  setTimer(timer) {
    this.timer.value = timer;
  }

  /**
   *
   * @return {Error}
   * @param {object} e
   */
  createError(e) {
    const respCode = get(e, 'response.status');
    const res = new Error(
      UPLOAD_CODE_ERRORS[respCode] || UPLOAD_CODE_ERRORS.default,
    );
    return res;
  }

  /**
   * @param {object} fields UserDocument object for upload
   * @param {string} fields.type UserDocument type
   * @param {File} fields.file UserDocument file
   */
  @Action
  async createDocument({ file, type }) {
    const timer = this.getTimer();
    try {
      this.progressLabel = i18n.t('components.uploadDocument.uploading');

      timer.startProgress(0, 20);
      await documentsService.checkFile(file);
      if (!this.docId) {
        this.docId = await documentsService.createDocument({ type });
      }

      timer.continueProgress(20, 80);
      await documentsService.uploadFrontFile(
        {
          file,
          docId: this.docId,
        },
        this.getUploadRequestConfig(),
      );

      timer.continueProgress(80, 100);
      await documentsService.waitDocumentUpload(this.docId);
    } catch (e) {
      throw this.createError(e);
    } finally {
      timer.fillAndStopProgress();
    }
    return this.docId;
  }

  @Action
  init() {
    this.docId = '';
  }
}

export default () => createController(FrontSideController);
