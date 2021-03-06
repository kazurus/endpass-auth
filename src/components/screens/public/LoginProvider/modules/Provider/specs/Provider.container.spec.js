import { shallowMount, createLocalVue } from '@vue/test-utils';
import { email } from '@unitFixtures/auth';
import ProviderContainer from '@/components/screens/public/LoginProvider/modules/Provider/Provider.container';
import ProviderView from '@/components/screens/public/LoginProvider/modules/Provider/Provider.view';
import CodeRequest from '@/components/screens/public/LoginProvider/modules/Provider/modules/CodeRequest';
import NoChallenge from '@/components/screens/public/LoginProvider/modules/Provider/modules/NoChallenge';
import Error from '@/components/modules/Error';
import CodeRecovery from '@/components/modules/CodeRecovery';
import setupI18n from '@/locales/i18nSetup';
import { CHALLENGE_TYPES } from '@/constants';

const localVue = createLocalVue();
const i18n = setupI18n(localVue);

describe('ProviderContainer', () => {
  let wrapper;

  const wrapperFactory = (options, props) => {
    return shallowMount(ProviderContainer, {
      localVue,
      i18n,
      propsData: {
        email,
        oauthLoginChallenge: '123',
        error: '',
        isLoading: false,
        challengeType: CHALLENGE_TYPES.EMAIL_OTP,
        ...props,
      },
      sync: false,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = wrapperFactory();
  });

  describe('render', () => {
    it('should correctly render component', () => {
      expect(wrapper.name()).toBe('ProviderContainer');
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render code', () => {
      wrapper = wrapperFactory();

      expect(wrapper.find(CodeRequest).exists()).toBe(true);
    });

    it('should render error', () => {
      wrapper = wrapperFactory(null, {
        error: 'error',
      });

      expect(wrapper.find(Error).exists()).toBe(true);
    });

    it('should render no challenge', () => {
      wrapper = wrapperFactory(null, {
        oauthLoginChallenge: '',
      });

      expect(wrapper.find(NoChallenge).exists()).toBe(true);
    });

    it('should render recovery code', async () => {
      expect.assertions(1);

      wrapper = wrapperFactory();

      wrapper.find(CodeRequest).vm.$emit('recover');

      await wrapper.vm.$nextTick();

      expect(wrapper.find(CodeRecovery).exists()).toBe(true);
    });

    it('should return from recovery code', async () => {
      expect.assertions(2);

      wrapper = wrapperFactory();
      wrapper.find(CodeRequest).vm.$emit('recover');
      await wrapper.vm.$nextTick();

      expect(wrapper.find(CodeRecovery).exists()).toBe(true);

      wrapper.find(CodeRecovery).vm.$emit('recovered');
      await wrapper.vm.$nextTick();

      expect(wrapper.find(CodeRequest).exists()).toBe(true);
    });
  });

  describe('behavior', () => {
    it('should emit complete event', () => {
      expect(wrapper.emitted().complete).toBeUndefined();
      const redirect = 'redirect';

      wrapper.find(CodeRequest).vm.$emit('complete', { redirect });

      expect(wrapper.emitted().complete.length).toBe(1);
      expect(wrapper.emitted().complete[0]).toEqual([{ redirect }]);
    });

    it('should emit close', () => {
      expect(wrapper.emitted().close).toBeUndefined();

      wrapper.find(ProviderView).vm.$emit('close');

      expect(wrapper.emitted().close).toHaveLength(1);
      expect(wrapper.emitted().close).toEqual([[]]);
    });
  });
});
