import Vuelidate from 'vuelidate';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import StepShippingMethodForm from '@/components/checkout/StepShippingMethodForm.vue';

const localVue = createLocalVue();
localVue.use(Vuelidate);

describe('StepShippingMethodForm.vue', () => {
  let options;

  beforeEach(() => {
    options = {
      localVue,
      mocks: { $t: jest.fn() },
    };
  });

  it('renders a vue instance', () => {
    expect(shallowMount(StepShippingMethodForm, options).isVueInstance()).toBeTruthy();
  });

  it('finds the matching shipping rate', () => {
    const shippingMethod = {
      zoneRates: [
        {
          shippingRates: [
            { id: 1, isMatching: false },
            { id: 2, isMatching: false },
          ],
        },
        {
          shippingRates: [
            { id: 3, isMatching: false },
            { id: 4, isMatching: true },
            { id: 5, isMatching: true },
          ],
        },
      ],
    };
    const wrapper = shallowMount(StepShippingMethodForm, options);
    expect(wrapper.vm.matchingShippingRate(shippingMethod).id).toBe(4);
  });

  it('finds whether shipping rate is free', () => {
    const wrapper = shallowMount(StepShippingMethodForm, options);
    wrapper.setData({
      me: {
        activeCart: {
          totalPrice: {
            centAmount: 999,
          },
        },
      },
    });
    expect(wrapper.vm.isFree({ freeAbove: { centAmount: 1000 } })).toBeFalsy();
    expect(wrapper.vm.isFree({ freeAbove: { centAmount: 999 } })).toBeFalsy();
    expect(wrapper.vm.isFree({ freeAbove: { centAmount: 998 } })).toBeTruthy();
    expect(wrapper.vm.isFree({ })).toBeFalsy();
  });
});
