import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow"

type AgreementStates = {
  tenant_info: string;
  rent_amount: string;
  floor_number: string;
  single_deposit: string;
  agreement_start: Date;
  agreement_duration?: number;
  sig_tenant_name?: string;
  sig_tenant_id?: string;
  sig_tenant_address?: string;
  tenant_phone_number?: string;
}

type AgreementActions = {
  setTenantInfo: (tenant_info: string | null) => void;
  setRentAmount: (rent_amount: string | null) => void;
  setFloorNumber: (floor_number: string | null) => void;
  setAgreementStart: (agreement_start: string | null) => void;
  setSingleDeposit: (single_deposit: string | null) => void;
  setAgreementDuration: (agreement_duration: string | null) => void;
  setSigTenantName: (sig_tenant_name: string | null) => void;
  setSigTenantId: (sig_tenant_id: string | null) => void;
  setSigTenantAddress: (sig_tenant_address: string | null) => void;
  setTenantPhoneNumber: (tenant_phone_number: string | null) => void;
  clearFields: () => void;
}

type AgreementStore = AgreementStates & AgreementActions;

const initialState = {
  tenant_info: "",
  rent_amount: "",
  floor_number: "",
  single_deposit: "",
  agreement_start: new Date(),
  agreement_duration: undefined,
  sig_tenant_name: undefined,
  sig_tenant_id: undefined,
  sig_tenant_address: undefined,
  tenant_phone_number: undefined,
}

export const useAgreementStore = create<AgreementStore>()(
  persist(
    (set, _) => ({
      // Initial States
      tenant_info: "",
      rent_amount: "",
      floor_number: "",
      single_deposit: "",
      agreement_start: new Date(),
      agreement_duration: undefined,
      sig_tenant_name: undefined,
      sig_tenant_id: undefined,
      sig_tenant_address: undefined,
      tenant_phone_number: undefined,

      // Actions
      setTenantInfo: (tenant_info) => set({ tenant_info: tenant_info ?? "" }),
      setRentAmount: (rent_amount) => set({ rent_amount: rent_amount ?? "" }),
      setFloorNumber: (floor_number) => set({ floor_number: floor_number ?? "" }),
      setAgreementStart: (agreement_start) => set({ agreement_start: agreement_start ? new Date(agreement_start) : new Date() }),
      setSingleDeposit: (single_deposit) => set({ single_deposit: single_deposit ?? "" }),
      setAgreementDuration: (agreement_duration) => set({ agreement_duration: agreement_duration ? Number(agreement_duration) : undefined }),
      setSigTenantName: (sig_tenant_name) => set({ sig_tenant_name: sig_tenant_name ?? undefined }),
      setSigTenantId: (sig_tenant_id) => set({ sig_tenant_id: sig_tenant_id ?? undefined }),
      setSigTenantAddress: (sig_tenant_address) => set({ sig_tenant_address: sig_tenant_address ?? undefined }),
      setTenantPhoneNumber: (tenant_phone_number) => set({ tenant_phone_number: tenant_phone_number ?? undefined }),
      clearFields: () => set(initialState)
    }),
    {
      name: "agreement-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        tenant_info: state.tenant_info,
        rent_amoubt: state.rent_amount,
        floor_number: state.floor_number,
        single_deposit: state.single_deposit,
        agreement_start: state.agreement_start,
        agreement_duration: state.agreement_duration,
        sig_tenant_name: state.sig_tenant_name,
        sig_tenant_id: state.sig_tenant_id,
        sig_tenant_address: state.sig_tenant_address,
        tenant_phone_number: state.tenant_phone_number,
      }),
    },
  ),
);

export const useGetAgreementState = () =>
  useAgreementStore(
    useShallow((state) => ({
      tenant_info: state.tenant_info,
      rent_amount: state.rent_amount,
      floor_number: state.floor_number,
      single_deposit: state.single_deposit,
      agreement_start: state.agreement_start,
      agreement_duration: state.agreement_duration,
      sig_tenant_name: state.sig_tenant_name,
      sig_tenant_id: state.sig_tenant_id,
      sig_tenant_address: state.sig_tenant_address,
      tenant_phone_number: state.tenant_phone_number,
    })),
  );
export const useSetTenantInfo = () => useAgreementStore((state) => state.setTenantInfo);
export const useSetRentAmount = () => useAgreementStore((state) => state.setRentAmount);
export const useSetFloorNumber = () => useAgreementStore((state) => state.setFloorNumber);
export const useSetAgreementStart = () => useAgreementStore((state) => state.setAgreementStart);
export const useSetSingleDeposit = () => useAgreementStore((state) => state.setSingleDeposit);
export const useSetAgreementDuration = () => useAgreementStore((state) => state.setAgreementDuration);
export const useSetTenantPhoneNumber = () => useAgreementStore((state) => state.setTenantPhoneNumber);
export const useClearFields = () => useAgreementStore((state) => state.clearFields);
