<template>
  <div>
    <accordion
      :is-collapsed="isAccountsCollapsed"
      max-height="225px"
    >
      <option-button
        data-test="new-account-button"
        @click="handleNewAccountClick"
      >
        {{ $t('components.widgetContent.newAccount') }}
      </option-button>
      <option-button
        slot="control"
        :is-big="true"
        :icon-fill="isAccountsCollapsed ? '#C3C6CA' : '#4B0470'"
        :icon-transform="isAccountsCollapsed ? 'none' : 'rotate(90deg)'"
        :disabled="isLoading"
        icon="arrow"
        data-test="accounts-toggle-button"
        @click="handleAccountsButtonClick"
      >
        {{ $t('components.widgetContent.changeAccount') }}
      </option-button>
      <option-button
        v-for="account in actualAccounts"
        :key="account.address"
        :icon="currentAccount === account.address ? 'check' : null"
        :icon-fill="currentAccount === account.address ? '#4B0470' : null"
        :disabled="isLoading"
        data-test="account-button"
        @click="handleAccountButtonClick(account.address)"
      >
        <span class="widget-accounts-item-address">
          <i class="widget-accounts-item-identicon">
            <identicon :address="account.address" />
          </i>
          <span>{{ formatAddress(account.address) }}</span>
        </span>
      </option-button>
    </accordion>
    <option-button
      :is-big="true"
      :disabled="isLoading"
      icon="arrow"
      data-test="logout-button"
      @click="handleLogoutButtonClick"
    >
      {{ $t('global.logout') }}
    </option-button>
  </div>
</template>

<script>
import { getShortStringWithEllipsis } from '@endpass/utils/strings';
import Identicon from '@/components/common/Identicon';
import OptionButton from './OptionButton.vue';
import Accordion from './Accordion.vue';

export default {
  name: 'WidgetAccounts',

  props: {
    currentAccount: {
      type: String,
      default: null,
    },

    accounts: {
      type: Array,
      default: () => [],
    },

    isCollapsed: {
      type: Boolean,
      default: true,
    },

    isAccountsCollapsed: {
      type: Boolean,
      default: true,
    },

    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    actualAccounts() {
      return this.accounts.filter(account => !!account.address);
    },
  },

  methods: {
    handleAccountsButtonClick() {
      this.$emit('accounts-toggle');
    },

    handleNewAccountClick() {
      this.$emit('new-account');
    },

    handleAccountButtonClick(account) {
      this.$emit('account-change', account);
    },

    handleLogoutButtonClick() {
      this.$emit('logout');
    },

    formatAddress(address) {
      return getShortStringWithEllipsis(address, 9);
    },
  },

  components: {
    Identicon,
    Accordion,
    OptionButton,
  },
};
</script>

<style lang="postcss">
.widget-accounts-item-address {
  display: inline-flex;
  align-items: center;
}

.widget-accounts-item-identicon {
  flex: 0 0 auto;
  margin-right: 13px;
}
</style>