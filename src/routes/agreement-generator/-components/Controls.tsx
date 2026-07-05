import { useAuth } from "@clerk/tanstack-react-start";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AnimatedButton from "~/components/AnimatedButton";
import { AgreementRequest, FormFieldKey } from "../-types";

interface ControlsProps {
  form: Partial<Record<FormFieldKey, string>>;
}

export function Controls({ form }: ControlsProps) {
  const { getToken } = useAuth();

  const { mutateAsync: downloadMutationAsync, isPending: isPendingDownload } = useMutation({
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

  const handleDownload = () => {
    const req: AgreementRequest = {
      tenant_info: form.tenant_info || "",
      rent_amount: form.rent_amount || "",
      floor_number: form.floor_number || "",
      single_deposit: form.single_deposit || "",
      agreement_duration: parseInt(form.agreement_duration || "1", 10), // Convert to number
      agreement_start: new Date(),
      sig_tenant_name: form.sig_tenant_name,
      sig_tenant_id: form.sig_tenant_id,
      sig_tenant_address: form.sig_tenant_address,
      tenant_phone_number: form.tenant_phone_number,
    };

    toast.promise(
      downloadMutationAsync(req), {
      loading: "Preparing download...",
      success: "Download completed",
      error: "Failed to start download",
    })
  }

  // if (isAuthLoaded && isSignedIn) {
  //   return null;
  // }

  return (
    <div className="border rounded border-primary py-4 px-8 flex flex-row-reverse">
      <AnimatedButton
        onClick={handleDownload}
        disabled={isPendingDownload}
      >
        Download
      </AnimatedButton>
    </div>
  )
}
