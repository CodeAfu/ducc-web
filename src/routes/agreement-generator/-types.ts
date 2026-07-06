
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
