import { toast } from "sonner";

export const SuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-center",
    richColors: true,
  });
};

export const ErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-center",
    richColors: true,
  });
};

export const InfoToast = (message: string) => {
  toast.info(message, {
    position: "top-center",
    richColors: true,
  });
};

export const WarningToast = (message: string) => {
  toast.warning(message, {
    position: "top-center",
    richColors: true,
  });
};

export const LoadingToast = (message: string) => {
  toast.loading(message, {
    richColors: true,
  });
};
