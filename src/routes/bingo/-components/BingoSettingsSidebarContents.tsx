import React from "react";
import AnimatedButton from "~/components/AnimatedButton";
import {
  useCellStates,
  useClearCells,
  useDescription,
  useIconImage,
  useRandomizeCells,
  useSetBgImage,
  useSetDescription,
  useSetIconImage,
  useSetShowSidebar,
  useSetTitle,
  useTitle,
  useUpdateCell,
} from "~/stores/bingoStore";
import { useState } from "react";
import { BingoCellKey, BingoImageResponse } from "~/types/bingo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import Skeleton from "~/components/Skeleton";
import { cn } from "~/lib/utils";
import { ImageOff } from "lucide-react";
import Modal from "~/components/Modal";
import { useAuth } from "@clerk/tanstack-react-start";
import toast from "react-hot-toast";

interface PreviewImage {
  data: string;
  filename: string;
  fileext: string;
}

export default function BingoSettingsSidebarContents() {
  const { getToken } = useAuth()
  const { email } = useRouteContext({ from: "__root__" })
  const queryClient = useQueryClient()

  const cellStates = useCellStates();
  const updateCell = useUpdateCell();
  const clearCells = useClearCells();
  const randomizeCells = useRandomizeCells();

  const setShowSidebar = useSetShowSidebar();

  const title = useTitle();
  const setTitle = useSetTitle();
  const description = useDescription();
  const setDescription = useSetDescription();
  const iconImage = useIconImage();
  const setIconImage = useSetIconImage();
  const setBgImage = useSetBgImage();

  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);
  const [imageIndex, setImageIndex] = useState(-1);

  const { data: images, isFetching } = useQuery({
    queryKey: ["api", "v3", "images"],
    queryFn: async (): Promise<BingoImageResponse> => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/images`);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 70,
  })

  const { mutateAsync: addImageAsync, isPending } = useMutation({
    mutationFn: async ({ imageBase64, filename, fileext }: {
      imageBase64: string,
      filename: string,
      fileext: string,
    }) => {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          img_data: imageBase64,
          added_by: email,
          filename,
          fileext,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json();
    },
    onError: (err) => {
      console.error(err)
    },
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["api", "v3", "images"] })
      console.log("Upload Success!", msg)
    }
  })

  const selectPrevImage = () => {
    const newIndex = Math.max(0, imageIndex - 1);
    setImageIndex(newIndex)
    if (images) {
      setIconImage(`data:image/webp;base64,${images[newIndex].img_data}`);
      setBgImage(`data:image/webp;base64,${images[newIndex].img_data}`);
    }
  }

  const selectNextImage = () => {
    const newIndex = Math.min((images!.length ?? 1) - 1, imageIndex + 1)
    setImageIndex(newIndex)
    if (images) {
      setIconImage(`data:image/webp;base64,${images[newIndex].img_data}`);
      setBgImage(`data:image/webp;base64,${images[newIndex].img_data}`);
    }
  }

  const resetImage = () => {
    setImageIndex(-1)
    setIconImage(null);
    setBgImage(null);
  }

  const setImageByIndex = (idx: number) => {
    setImageIndex(idx);
    if (images) {
      setIconImage(`data:image/webp;base64,${images[idx].img_data}`);
      setBgImage(`data:image/webp;base64,${images[idx].img_data}`);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lastDot = file.name.lastIndexOf(".")
      const filename = file.name.slice(0, lastDot);
      const fileext = file.name.slice(lastDot + 1);
      setPreviewImage({
        data: reader.result as string,
        filename,
        fileext,
      })
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = async () => {
    if (!previewImage) return;
    setPreviewImage(null)
    const base64 = previewImage.data.split(",")[1];
    toast.promise(
      addImageAsync({
        imageBase64: base64,
        filename: previewImage.filename,
        fileext: previewImage.fileext
      }),
      {
        loading: "Uploading...",
        success: "Image uploaded!",
        error: (err) => err.message,
      }
    )
    // setShowSidebar(false);
  }

  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="flex flex-col gap-2 md:px-8 sm:px-4 px-2 pb-6">
          <h1 className="mt-4 mb-2 font-medium select-none text-xl ">
            Options
          </h1>
          <div className="flex flex-row flex-wrap items-center gap-2">
            <AnimatedButton onClick={clearCells} variant="destructive">
              Clear Cells
            </AnimatedButton>
            <AnimatedButton onClick={randomizeCells}>Shuffle</AnimatedButton>
            <AnimatedButton>Save</AnimatedButton>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:px-8 sm:px-4 px-2 pb-4">
          <div className="flex items-center gap-8">
            <h4>Images{" "}
              {images && (
                <span className="text-muted-foreground">
                  ({images.length})
                </span>
              )}
            </h4>
            <div className="flex items-center gap-2">
              <label className="size-5 border text-lg rounded flex items-center justify-center text-primary-foreground border-primary-foreground
                hover:cursor-pointer hover:text-primary hover:border-primary active:text-primary active:border-primary transition duration-200">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                +
              </label>
              <button
                onClick={resetImage}
                className="size-5 border text-lg rounded flex items-center justify-center text-primary-foreground border-primary-foreground
            hover:cursor-pointer hover:text-primary hover:border-primary active:text-primary active:border-primary transition duration-200">
                <ImageOff className="size-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-0.5">
              {isFetching || !images ? (
                <React.Fragment>
                  <Skeleton className="size-8" />
                  <Skeleton className="size-8" />
                  <Skeleton className="size-8" />
                  <Skeleton className="size-8" />
                  <Skeleton className="size-8" />
                  <Skeleton className="size-8" />
                </React.Fragment>
              ) : (
                images.map((img, idx) => (
                  <button
                    key={`bing-image-${img.id}`}
                    className={cn(
                      "size-8 overflow-hidden transtion duration-200 hover:cursor-pointer",
                      idx === imageIndex && "outline-2 outline-primary"
                    )}
                    onClick={() => setImageByIndex(idx)}
                  >
                    <img src={`data:image/webp;base64,${img.img_data}`} className="w-full h-full object-cover" />
                  </button>
                ))
              )}
            </div>
            <div className="flex gap-1 items-center">
              <button
                onClick={selectPrevImage}
                disabled={imageIndex <= 0}
                className="text-xl px-2 py-1 bg-primary rounded h-fit hover:bg-primary/80 transition duration-200
              disabled:opacity-50 disabled:pointer-events-none">
                &lt;
              </button>
              <div className="rounded size-32 flex items-center justify-center overflow-hidden select-none">
                {isFetching || !images ? (
                  <Skeleton className="w-full h-full" />
                ) : !iconImage ? (
                  <p className="border-2 rounded border-muted-foreground w-full h-full inline-flex items-center justify-center text-9xl font-bold">
                    ?
                  </p>
                ) : (
                  <img src={iconImage} className="w-full h-full object-contain" />
                )}
              </div>
              <button
                onClick={selectNextImage}
                disabled={images && imageIndex >= images.length - 1}
                className="text-xl px-2 py-1 bg-primary rounded h-fit hover:bg-primary/80 transition duration-200
              disabled:opacity-50 disabled:pointer-events-none">
                &gt;
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:px-8 sm:px-4 px-2 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <h4>
              Title{" "}
            </h4>
            <input
              type="text"
              autoCapitalize="sentences"
              maxLength={80}
              className="border border-muted-foreground rounded text-sm p-1 w-full"
              defaultValue={title ?? ""}
              onInput={(e) => setTitle(e.currentTarget.value)}
            />
          </div>
          <h4>
            Description{" "}
            <span className="text-muted-foreground">(Optional)</span>
          </h4>
          <textarea
            className="border border-muted-foreground rounded-xl h-32 outline-none text-start resize-none p-2 text-sm"
            onInput={(e) => setDescription(e.currentTarget.value.trim())}
            defaultValue={description ?? ""}
          />
        </div>

        <div className="flex flex-col gap-2 md:px-8 sm:px-4 px-2 pb-4">
          <h4>
            Cells
          </h4>
          <div className="grid grid-cols-[auto_1fr] sm:gap-x-4 items-center gap-x-2 gap-y-1">
            {Object.entries(cellStates)
              .sort(([a], [b]) => {
                const numA = parseInt(a.replace("cell", ""));
                const numB = parseInt(b.replace("cell", ""));
                return numA - numB;
              })
              .map(([key, value]) => (
                <React.Fragment key={key}>
                  <div className="text-sm text-muted-foreground ml-1">{key.slice(4)}</div>
                  <input
                    type="text"
                    autoCapitalize="sentences"
                    onInput={(e) => updateCell(key as BingoCellKey, e.currentTarget.value)}
                    className="text-sm w-full outline-none rounded border border-muted-foreground py-1 px-2"
                    value={value}
                  />
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>

      {/* Upload Image Preview */}
      <Modal className="bg-gray-900" width="7xl" isOpen={previewImage !== null} onClose={() => setPreviewImage(null)}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center max-h-[80dvh] overflow-hidden rounded-lg">
            {previewImage && (
              <img src={previewImage.data} className="max-h-[80dvh] w-auto object-contain" />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <AnimatedButton variant="outline" onClick={() => setPreviewImage(null)}>Cancel</AnimatedButton>
            <AnimatedButton onClick={handleConfirm} disabled={isPending}>
              {isPending ? "Uploading..." : "Save Image"}
            </AnimatedButton>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
}
