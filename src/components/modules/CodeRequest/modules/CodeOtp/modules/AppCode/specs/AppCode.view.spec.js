import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email, code } from '@unitFixtures/auth';
import VeeValidate from 'vee-validate';
import AppCodeView from '@/components/modules/CodeRequest/modules/CodeOtp/modules/AppCode/AppCode.view';
import setupI18n from '@/locales/i18nSetup';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

localVue.use(VeeValidate);

describe('AppCodeView', () => {
  let wrapper;
  const defaultProps = {
    email,
    isPhoneExist: true,
  };
  const createWrapper = options =>
    shallowMount(AppCodeView, {
      provide: {
        theme: 'default',
      },
      localVue,
      propsData: defaultProps,
      sync: false,
      i18n,
      ...options,
    });

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = createWrapper();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('AppCodeView');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render form', () => {
      expect(wrapper.find('[data-test=app-code-form]').exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('props', () => {
    it('should show request code', () => {
      wrapper = createWrapper({
        propsData: { ...defaultProps, isPhoneExist: true },
      });

      expect(wrapper.find('[ data-test=recovery-link ]').exists()).toBe(true);
    });

    it('should hide request code', () => {
      wrapper = createWrapper({
        propsData: { ...defaultProps, isPhoneExist: false },
      });

      expect(wrapper.find('[ data-test=recovery-link ]').exists()).toBe(false);
    });

    describe('error', () => {
      const error = 'error';

      it('should show error from prop', () => {
        expect.assertions(1);

        wrapper = createWrapper({
          propsData: { ...defaultProps, error },
        });

        expect(wrapper.find('[data-test=code-input]').attributes().error).toBe(
          error,
        );
      });

      it('should remove error when empty', async () => {
        expect.assertions(2);

        wrapper = createWrapper({
          propsData: { ...defaultProps, error },
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-test=code-input]').attributes().error).toBe(
          error,
        );

        wrapper.setProps({ error: '' });
        await wrapper.vm.$nextTick();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toBeFalsy();
      });

      it('should update error when not empty', async () => {
        expect.assertions(2);

        const newError = 'new error';

        wrapper.setProps({ error });
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-test=code-input]').attributes().error).toBe(
          error,
        );

        wrapper.setProps({ error: newError });
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-test=code-input]').attributes().error).toBe(
          newError,
        );
      });
    });
  });

  describe('behavior', () => {
    it('should emit submit event', async () => {
      expect.assertions(4);

      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find('[data-test=code-input]').vm.$emit('input', code);
      await global.flushPromises();

      expect(
        wrapper.find('[data-test=submit-button]').attributes().disabled,
      ).toBeUndefined();

      wrapper.find('[data-test=app-code-form]').trigger('submit');

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([
        { code, isRemember: false },
      ]);
    });

    it('should emit submit event with remember', async () => {
      expect.assertions(4);

      expect(wrapper.emitted().submit).toBeUndefined();

      wrapper.find('[data-test=code-input]').vm.$emit('input', code);
      wrapper.find('[data-test=remember-me-checkbox]').vm.$emit('input', true);
      await global.flushPromises();

      expect(
        wrapper.find('[data-test=submit-button]').attributes().disabled,
      ).toBeUndefined();

      wrapper.find('[data-test=app-code-form]').trigger('submit');

      expect(wrapper.emitted().submit.length).toBe(1);
      expect(wrapper.emitted().submit[0]).toEqual([{ code, isRemember: true }]);
    });

    it('should emit send code event', () => {
      expect(wrapper.emitted().recover).toBeUndefined();

      wrapper
        .find('[ data-test=recovery-link ]')
        .vm.$emit('click', { preventDefault: () => {} });

      expect(wrapper.emitted().recover).toHaveLength(1);
      expect(wrapper.emitted().recover[0]).toEqual([]);
    });
  });

  describe('validation', () => {
    describe('code input', () => {
      it('should not show error by default', () => {
        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toBeFalsy();
      });

      it('should not show error with valid data', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toBeFalsy();
      });

      it('should show error with invalid code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', 'short');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toMatch('6 digits');
      });

      it('should show error with empty code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', 'short');
        await global.flushPromises();
        wrapper.find('[data-test=code-input]').vm.$emit('input', '');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=code-input]').attributes().error,
        ).toMatch('required');
      });
    });

    describe('submit button', () => {
      it('should disable submit by default', () => {
        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBe('true');
      });

      it('should enable submit with valid code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBeUndefined();
      });

      it('should disable submit with invalid code', async () => {
        expect.assertions(1);

        wrapper.find('[data-test=code-input]').vm.$emit('input', code);
        await global.flushPromises();

        wrapper.find('[data-test=code-input]').vm.$emit('input', 'short');
        await global.flushPromises();

        expect(
          wrapper.find('[data-test=submit-button]').attributes().disabled,
        ).toBe('true');
      });
    });
  });
});
