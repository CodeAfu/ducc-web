import {
  useSetAgreementDuration, useSetFloorNumber, useSetRentAmount,
  useSetSigTenantAddress, useSetSigTenantId, useSetSigTenantName,
  useSetSingleDeposit, useSetTenantInfo, useSetTenantPhoneNumber
} from "~/stores/agreementStore";

export interface AgreementRequest {
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

export type FormFieldKey = {
  [K in keyof AgreementRequest]-?: AgreementRequest[K] extends string | number | undefined ? K : never;
}[keyof AgreementRequest];

export type FormValues = Partial<Record<FormFieldKey, string>>;

type SetterFor = (v: string | null) => void;

export const SETTERS: { [K in FormFieldKey]: () => SetterFor } = {
  floor_number: useSetFloorNumber,
  tenant_info: useSetTenantInfo,
  rent_amount: useSetRentAmount,
  single_deposit: useSetSingleDeposit,
  agreement_duration: useSetAgreementDuration,
  sig_tenant_name: useSetSigTenantName,
  sig_tenant_id: useSetSigTenantId,
  sig_tenant_address: useSetSigTenantAddress,
  tenant_phone_number: useSetTenantPhoneNumber,
}
