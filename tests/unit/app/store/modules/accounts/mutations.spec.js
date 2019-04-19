import { state as accountsState } from '@/store/modules/accounts';
import accountsMutations from '@/store/modules/accounts/mutations';

describe('accounts mutations', () => {
  let state;

  beforeEach(() => {
    state = { ...accountsState };
  });

  describe('setAuthStatus', () => {
    it('should set auth status', () => {
      accountsMutations.setAuthStatus(state, true);

      expect(state.isLogin).toBe(true);
      expect(state.isPermission).toBe(true);
    });
  });

  describe('setAccounts', () => {
    it('should set accounts', () => {
      accountsMutations.setAccounts(state, ['0x0', '0x1']);

      expect(state.accounts).toEqual(['0x0', '0x1']);
    });
  });

  describe('setSentStatus', () => {
    it('should set link sent status', () => {
      accountsMutations.setSentStatus(state, true);

      expect(state.linkSent).toBe(true);
    });
  });

  describe('setRecoveryIidentifier', () => {
    it('should set recovery identifier', () => {
      const recoveryIdentifier = 'recovery identifier';

      accountsMutations.setRecoveryIdentifier(state, recoveryIdentifier);

      expect(state.recoveryIdentifier).toBe(recoveryIdentifier);
    });
  });

  describe('setDemoData', () => {
    const demoData = {
      field: 'field',
    };

    it('should set demo data', async () => {
      accountsMutations.setDemoData(state, demoData);

      expect(state.demoData).toBe(demoData);
    });
  });
});
