import { useAuth } from "@clerk/tanstack-react-start";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AnimatedButton from "~/components/AnimatedButton";
import { AgreementRequest, FormFieldKey } from "../-types";
import { Dispatch, SetStateAction } from "react";
import { base64ToBytes } from "~/utils/utils";

interface ControlsProps {
  form: Partial<Record<FormFieldKey, string>>;
  setUrl: Dispatch<SetStateAction<string | null>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function Controls({ form, setUrl, setOpen }: ControlsProps) {
  const { getToken } = useAuth();

  const { mutateAsync: downloadMutationAsync, isPending: isPendingDownload, isError: isDownloadError, error: downloadError } = useMutation({
    mutationFn: async (req: AgreementRequest) => {
      const token = await getToken();
      if (!token) throw new Error("You are not authorized to use this endpoint");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/agreement-generator/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        throw new Error(await res.text())
      }
      return res.blob()
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "lease_agreement.docx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (err) => {
      console.error(err)
    },
  })

  const { mutateAsync: previewMutationAsync, isPending: isPendingPreview, isSuccess: isPreviewSuccess, isError: isPreviewError, error: previewError } = useMutation({
    mutationFn: async (req: AgreementRequest) => {
      const token = await getToken();
      if (!token) throw new Error("You are not authorized to use this endpoint");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/agreement-generator/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const base64 = await res.text();
      const byteNumbers = base64ToBytes(base64);
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);
      setUrl(pdfUrl);
      setOpen(true);
      return pdfUrl;
    },
    onSuccess: () => {
      console.log("success")
    },
    onError: (err) => {
      console.error(err)
    },
  })


  const handleDownload = async () => {
    const req: AgreementRequest = {
      tenant_info: form.tenant_info || "",
      rent_amount: form.rent_amount || "",
      floor_number: form.floor_number || "",
      single_deposit: form.single_deposit || "",
      agreement_duration: form.agreement_duration ? parseInt(form.agreement_duration, 10) : undefined,
      agreement_start: new Date(),
      sig_tenant_name: form.sig_tenant_name,
      sig_tenant_id: form.sig_tenant_id,
      sig_tenant_address: form.sig_tenant_address,
      tenant_phone_number: form.tenant_phone_number,
    };

    await toast.promise(
      downloadMutationAsync(req), {
      loading: "Preparing download...",
      success: "Download started successfully",
      error: (e) => `Failed to start download: ${e}`,
    })
  }

  const handlePreview = async () => {
    const req: AgreementRequest = {
      tenant_info: form.tenant_info || "",
      rent_amount: form.rent_amount || "",
      floor_number: form.floor_number || "",
      single_deposit: form.single_deposit || "",
      agreement_duration: form.agreement_duration ? parseInt(form.agreement_duration, 10) : undefined,
      agreement_start: new Date(),
      sig_tenant_name: form.sig_tenant_name,
      sig_tenant_id: form.sig_tenant_id,
      sig_tenant_address: form.sig_tenant_address,
      tenant_phone_number: form.tenant_phone_number,
    };

    await toast.promise(
      previewMutationAsync(req), {
      loading: "Preparing PDF preview...",
      error: (e) => `Failed to load preview document: ${e}`,
    })
  }

  // if (isAuthLoaded && isSignedIn) {
  //   return null;
  // }

  return (
    <div className="border rounded border-primary py-4 px-8 flex flex-row-reverse gap-3">
      <AnimatedButton
        onClick={handleDownload}
        disabled={isPendingDownload && !isPreviewSuccess}
      >
        Download
      </AnimatedButton>
      <AnimatedButton
        onClick={handlePreview}
        disabled={isPendingPreview}
      >
        Preview
      </AnimatedButton>
    </div>
  )
}
