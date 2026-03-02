import React, { use } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Container from "~/components/Container";
import { Image as ImageIcon, ArrowRight, ArrowDown } from "lucide-react";
import { useRemoveBackground } from "~/hooks/useRemoveBackground";
import { BASE64_HREF_STRING } from "~/lib/consts";
import { Button } from "~/components/ui/button";
import Loading from "~/components/Loading";
import transparentBg from "~/assets/transparent-pattern.png";

export const Route = createFileRoute("/tools/bg-remover")({
  component: RouteComponent,
});

function RouteComponent() {
  const [image, setImage] = React.useState<File | null>(null);
  const { mutateAsync: removeBackground, isPending } = useRemoveBackground();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [processedImage, setProcessedImage] = React.useState<string | null>(
    null
  );

  const handleProcessImage = React.useCallback(
    async (file: File) => {
      try {
        const base64Image = await removeBackground(file);
        setProcessedImage(base64Image);
        setErrorMessage(null);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to process image"
        );
        setProcessedImage(null);
      }
    },
    [removeBackground]
  );

  const handleImageSelect = React.useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file.");
        return;
      }
      setImage(file);
      handleProcessImage(file);
    },
    [handleProcessImage]
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        handleImageSelect(file);
      }
    },
    [handleImageSelect]
  );

  const handleClick = React.useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageSelect(file);
      }
    };
    input.click();
  }, [handleImageSelect]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Container>
      <div className="flex flex-col md:mt-16 mt-4 gap-4">
        {!processedImage && !isPending && (
          <>
            <div
              onClick={handleClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              role="button"
              tabIndex={0}
              className="border-2 text-gray-300 border-gray-300 rounded-xl w-full aspect-video border-dashed cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="select-none flex flex-col items-center justify-center gap-4">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    className="max-w-full object-contain"
                  />
                ) : (
                  <>
                    <ImageIcon className="md:w-18 w-14 md:h-18 h-14 stroke-gray-300" />
                    <p className="select-none text-sm text-gray-300/80">
                      Drop your image here or click to upload
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        {isPending && (
          <div className="w-full aspect-video flex items-center justify-center">
            <Loading size="xl" />
          </div>
        )}

        {processedImage && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="w-full">
                <img
                  src={URL.createObjectURL(image!)}
                  alt="Original"
                  className="max-w-full md:max-h-[70vh] max-h-[30vh] mx-auto h-auto border rounded-lg"
                />
              </div>
              <ArrowRight className="hidden md:block md:h-20 md:w-20 text-gray-400" />
              <ArrowDown className="block md:hidden md:h-20 md:w-20 text-gray-400" />

              <div className="relative w-full rounded-lg">
                <div
                  className="absolute opacity-70 inset-0 bg-contain bg-center bg-no-repeat rounded-lg z-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${transparentBg})`,
                  }}
                />
                <img
                  src={`data:image/png;base64,${processedImage}`}
                  alt="Processed"
                  className="relative max-w-full md:max-h-[70vh] max-h-[30vh] z-10 mx-auto h-auto border"
                />
              </div>
            </div>

            <div className="flex gap-4 p-4 border rounded-lg bg-slate-900 shadow-lg">
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = `${BASE64_HREF_STRING}${processedImage}`;
                  link.download = "processed-image.png";
                  link.click();
                }}
              >
                Download
              </Button>
              <Button
                onClick={() => {
                  setProcessedImage(null);
                  setImage(null);
                }}
              >
                New
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
