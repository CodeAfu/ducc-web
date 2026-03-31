import { useQueryClient, useMutation, MutationFunction } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AnimatedButton from "~/components/AnimatedButton";
import Modal from "~/components/Modal";
import { cn } from "~/lib/utils";

export interface ConfirmationModalProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  mutationFn: MutationFunction<void, T>;
  variables: T;
  invalidateQueryKeys: any[];
  onSuccessActions?: () => void;
  onErrorActions?: () => void;
  title?: string;
  description?: string;
  loadingMessage?: string;
  successMessage?: string;
}

export default function ConfirmationModal<T>({
  isOpen,
  onClose,
  mutationFn,
  variables,
  invalidateQueryKeys,
  onSuccessActions,
  onErrorActions,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  loadingMessage = "Confirming...",
  successMessage = "Action completed successfully",
  className,
  ...props
}: ConfirmationModalProps<T>) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateQueryKeys })
      onSuccessActions?.();
      onClose();
    },
    onError: (err) => {
      console.error(err)
      onErrorActions?.();
    }
  })

  const handleMutation = () => {
    toast.promise(mutateAsync(variables), {
      loading: loadingMessage,
      success: successMessage,
      error: (err) => err.message,
    })
    onClose();
  }

  return (
    <Modal
      width="md"
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      className={cn("", className)}
      {...props}
    >
      <div className="flex flex-col gap-8 px-2">
        <p>{description}</p>
        <div className="flex items-end justify-end gap-2">
          <AnimatedButton
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </AnimatedButton>
          <AnimatedButton
            disabled={isPending}
            onClick={handleMutation}
            variant="destructive"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AnimatedButton>
        </div>
      </div>
    </Modal>
  )
}
