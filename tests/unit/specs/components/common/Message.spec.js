import { shallowMount } from '@vue/test-utils';
import Message from '@/components/common/Message';

describe('Message', () => {
  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(Message);
    });

    it('should correctly render Message component', () => {
      expect(wrapper.name()).toBe('Message');
      expect(wrapper.classes()).toEqual(['v-lh-1-5', 'message']);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should add error modifier if error props was passed in', () => {
      wrapper = shallowMount(Message, {
        propsData: {
          error: true,
        },
      });

      expect(wrapper.classes()).toContain('error');
    });

    it('should add ellipsis modifier if ellipsis props was passed in', () => {
      wrapper = shallowMount(Message, {
        propsData: {
          ellipsis: true,
        },
      });

      expect(wrapper.classes()).toContain('ellipsis');
    });
  });
});
