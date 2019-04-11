import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import LoginProvider from '@/components/screens/LoginProvider';

jest.mock('@/util/url', () => ({
  queryParamsToObject: jest.fn().mockImplementation(() => ({
    challengeId: 'foo',
  })),
}));

/* eslint-disable-next-line */
import { queryParamsToObject } from '@/util/url';

const localVue = createLocalVue();

localVue.use(VueRouter);
localVue.use(Vuex);

describe('LoginProvider', () => {
  let wrapper;
  let router;
  let store;
  let storeData;
  let coreModule;
  let accountsModule;

  beforeEach(() => {
    jest.clearAllMocks();

    coreModule = {
      state: {
        loading: false,
      },
    };
    accountsModule = {
      state: {
        isAuthorized: true,
      },
      actions: {
        authWithHydra: jest.fn(),
      },
    };
    storeData = {
      modules: {
        accounts: accountsModule,
        core: coreModule,
      },
    };
    store = new Vuex.Store(storeData);
    router = new VueRouter();
    wrapper = shallowMount(LoginProvider, {
      localVue,
      store,
      router,
    });
  });

  describe('render', () => {
    it('should correctly render LoginProvider screen', () => {
      wrapper = shallowMount(LoginProvider, {
        localVue,
        store,
        router,
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    beforeEach(() => {
      router.replace = jest.fn();
    });

    it('should takes query params from current location and assign error if challengeId is not in params', () => {
      queryParamsToObject.mockImplementationOnce(() => ({}));
      wrapper = shallowMount(LoginProvider, {
        localVue,
        store,
        router,
      });

      expect(wrapper.vm.error).not.toBeNull();
      expect(wrapper.vm.$router.replace).not.toBeCalled();
    });

    it('should takes query params from current location and makes redirect if challengeId is not empty but authorization status is falsy', () => {
      accountsModule.state.isAuthorized = false;
      wrapper = shallowMount(LoginProvider, {
        localVue,
        store,
        router,
      });

      expect(wrapper.vm.$router.replace).toBeCalled();
    });

    it('should not do anything on mounting if challengeId is present in query params and user authorized', () => {
      wrapper = shallowMount(LoginProvider, {
        localVue,
        store,
        router,
      });

      expect(wrapper.vm.error).toBeNull();
      expect(wrapper.vm.$router.replace).not.toBeCalled();
    });

    describe('password submit', () => {
      const password = 'foo';
      const challengeId = 'bar';

      it('should handle password submit and makes hydra login', () => {
        wrapper.setData({
          params: {
            challengeId,
          },
        });
        wrapper.find('password-form-stub').vm.$emit('submit', password);

        expect(accountsModule.actions.authWithHydra).toBeCalledWith(
          expect.any(Object),
          {
            password,
            challengeId,
          },
          undefined,
        );
      });

      it('should render error if submit failed', async () => {
        expect.assertions(1);

        const errorMessage = 'ivyweed perturbing Laparosticti';
        const error = new Error(errorMessage);

        accountsModule.actions.authWithHydra.mockRejectedValueOnce(error);
        wrapper.setData({
          params: {
            challengeId,
          },
        });
        wrapper.find('password-form-stub').vm.$emit('submit', password);

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.error).toBe(errorMessage);
      });
    });
  });
});