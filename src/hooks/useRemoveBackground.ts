import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { ApiResponse } from "~/lib/types";

interface BgRemoverData {
  base64Image: string;
}

export function useRemoveBackground() {
  return useMutation<string, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post<ApiResponse<BgRemoverData>>(
        `${import.meta.env.VITE_API_URL}/api/v1.0/remove-bg`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData = response.data;

      if (!responseData.success) {
        throw new Error(responseData.message || "Failed to process image");
      }

      if (!responseData.data?.base64Image) {
        throw new Error("No image data returned from server");
      }

      return responseData.data.base64Image;
    },
  });
}
