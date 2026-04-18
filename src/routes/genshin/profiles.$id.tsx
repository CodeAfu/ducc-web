import { useAuth } from "@clerk/tanstack-react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Suspense, useRef, useState } from "react";
import ElementCard from "./-components/ElementCard";
import AuthGuard from "~/components/AuthGuard";
import Skeleton from "~/components/Skeleton";
import Container from "~/components/Container";
import { CharacterListResponse, GenshinProfileStats, ProfileResponse } from "./types";
import AnimatedButton from "~/components/AnimatedButton";
import DeleteProfileModal from "./-components/DeleteProfileModal";
import AddNotesModal from "./-components/AddNotesModal";
import React from "react";
import toast from "react-hot-toast";
import AddCharacterModal from "./-components/AddCharacterModal";
import CharacterTable from "./-components/CharacterTable";
import LoadingSpinner from "~/components/LoadingSpinner";
import CharacterViewModal from "./-components/CharacterViewModal";

export const Route = createFileRoute("/genshin/profiles/$id")({
  component: GenshinProfilePage,
})

async function getProfileChars(token: string, profileId: string): Promise<ProfileResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/profiles/${profileId}/characters`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json;
}

async function getCharacters(token: string): Promise<CharacterListResponse[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/characters`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json;
}

async function updateProfileName(token: string, profileId: string, profileName: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/profiles/${profileId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: profileName
    })
  });
  if (!res.ok) {
    throw new Error(await res.text())
  }
  const json = await res.json();
  return json;
}

export default function GenshinProfilePage() {
  const { id } = Route.useParams()
  const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useAuth()
  const queryClient = useQueryClient();

  const profileNameRef = useRef<HTMLInputElement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isCharacterViewModalOpen, setIsCharacterViewModalOpen] = useState(false);
  const [isAddCharacterModalOpen, setIsAddCharacterModalOpen] = useState(false);

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["api", "v3", "genshin", "profiles", id, "characters"],
    queryFn: async (): Promise<ProfileResponse> => {
      const token = await getToken();
      if (!token) throw new Error("You are not authorized to use this endpoint")
      const profileJson = await getProfileChars(token, id);
      console.log("Profile JSON", profileJson)
      return profileJson;
    },
    enabled: isAuthLoaded && isSignedIn
  })

  const { data: charactersList } = useQuery({
    queryKey: ["api", "v3", "genshin", "characters"],
    queryFn: async (): Promise<CharacterListResponse[]> => {
      const token = await getToken();
      if (!token) throw new Error("You are not authorized to use this endpoint")
      const charactersJson = await getCharacters(token);
      console.log("All Genshin Chars JSON", charactersJson)
      return charactersJson;
    },
    enabled: isAuthLoaded && isSignedIn
  })

  const { data: profileStats, isFetching: isFetchingStats } = useQuery({
    queryKey: ["api", "v3", "genshin", "profiles", id, "stats"],
    queryFn: async (): Promise<GenshinProfileStats> => {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/profiles/${id}/stats`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      console.log(`Profile ${id} stats`, json)
      return json;
    },
  })

  const { mutateAsync: updateProfileNameMutation } = useMutation({
    mutationFn: async ({ profileNamePayload }: { profileNamePayload: string }) => {
      const token = await getToken();
      if (!token) throw new Error("You are not authorized to use this endpoint");
      await updateProfileName(token, id, profileNamePayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "v3", "genshin", "profiles"] })
    },
    onError: (err) => {
      console.error(err)
    }
  })

  const handleUpdateProfileName = () => {
    const profileNamePayload = profileNameRef.current?.value.trim();

    if (!profileNamePayload) {
      toast.error("Profile name cannot be empty")
      return;
    }

    if (profileNamePayload === profile?.name) {
      return;
    }

    toast.promise(updateProfileNameMutation({ profileNamePayload }), {
      loading: "Updating profile name...",
      success: `Updated Name: '${profileNamePayload}'`,
      error: (err) => err.message,
    })
  }

  if (!isAuthLoaded || isLoading) {
    return (
      <Container className="mt-18">
        <Fallback />
      </Container>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="text-center mt-20 text-muted-foreground">
        Please sign in to view this profile.
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center mt-20 text-red-500 font-medium">
        Error: {error instanceof Error ? error.message : "An unknown error occurred"}
      </div>
    )
  }

  return (
    <AuthGuard>
      <Container className="mb-16">
        <Button className="w-fit mb-6" variant="link" size="sm" asChild>
          <Link to="/genshin">
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <Suspense fallback={<Fallback />}>
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <input
                ref={profileNameRef}
                className="font-bold text-2xl outline-none w-full flex-1 bg-transparent text-ellipsis overflow-hidden"
                onBlur={handleUpdateProfileName}
                defaultValue={profile?.name}
              />

              <div className="flex flex-wrap items-center gap-2">
                <AnimatedButton variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
                  Delete
                </AnimatedButton>
                <AnimatedButton variant="primary" onClick={() => setIsAddCharacterModalOpen(true)}>
                  Add Character
                </AnimatedButton>
                <AnimatedButton variant="primary" onClick={() => setIsCharacterViewModalOpen(true)}>
                  All Characters
                </AnimatedButton>
                <AnimatedButton variant="outline" onClick={() => setIsNotesModalOpen(true)}>
                  Add Note
                </AnimatedButton>
              </div>

            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 sm:gap-3 gap-2">
              <ElementCard title="Stats" bgColorClass="bg-card">
                {isFetchingStats ? (
                  <div className="flex flex-col items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="text-sm inline-flex gap-2 flex-wrap">
                    <p className="px-2 py-1 bg-popover border rounded shadow">Total: {profileStats?.char_count}</p>
                    <p className="px-2 py-1 bg-popover border rounded shadow">Pyro: {profileStats?.element_counts.find(e => e.element_name === "pyro")?.count ?? 0}</p>
                    <p className="px-2 py-1 bg-popover border rounded shadow">Hydro: {profileStats?.element_counts.find(e => e.element_name === "hydro")?.count ?? 0}</p>
                    <p className="px-2 py-1 bg-popover border rounded shadow">Electro: {profileStats?.element_counts.find(e => e.element_name === "electro")?.count ?? 0}</p>
                    <p className="px-2 py-1 bg-popover border rounded shadow">Cryo: {profileStats?.element_counts.find(e => e.element_name === "cryo")?.count ?? 0}</p>
                    <p className="px-2 py-1 bg-popover border rounded shadow">Anemo: {profileStats?.element_counts.find(e => e.element_name === "anemo")?.count ?? 0}</p>
                    <p className="px-2 py-1 bg-popover border rounded shadow">Geo: {profileStats?.element_counts.find(e => e.element_name === "geo")?.count ?? 0}</p>
                    <p className="px-2 py-1 bg-popover border rounded shadow">Dendro: {profileStats?.element_counts.find(e => e.element_name === "dendro")?.count ?? 0}</p>
                  </div>
                )}
              </ElementCard>
              <ElementCard title="Traveler" bgColorClass="bg-card">
                <CharacterTable
                  profileId={id}
                  allCharacters={charactersList || []}
                  profileCharacters={profile?.characters || []}
                  isTraveler={true}
                />
              </ElementCard>
              <ElementCard title="Pyro" element="pyro" bgColorClass="bg-card">
                <CharacterTable
                  profileId={id}
                  allCharacters={charactersList || []}
                  profileCharacters={profile?.characters || []}
                  element="pyro"
                />
              </ElementCard>
              <ElementCard title="Hydro" element="hydro" bgColorClass="bg-card">
                <CharacterTable
                  profileId={id}
                  allCharacters={charactersList || []}
                  profileCharacters={profile?.characters || []}
                  element="hydro"
                />
              </ElementCard>
              <ElementCard title="Electro" element="electro" bgColorClass="bg-card">
                <CharacterTable
                  profileId={id}
                  allCharacters={charactersList || []}
                  profileCharacters={profile?.characters || []}
                  element="electro"
                />
              </ElementCard>
              <ElementCard title="Cryo" element="cryo" bgColorClass="bg-card">
                <CharacterTable
                  profileId={id}
                  allCharacters={charactersList || []}
                  profileCharacters={profile?.characters || []}
                  element="cryo"
                />
              </ElementCard>
              <ElementCard title="Anemo" element="anemo" bgColorClass="bg-card">
                <CharacterTable
                  profileId={id}
                  allCharacters={charactersList || []}
                  profileCharacters={profile?.characters || []}
                  element="anemo"
                />
              </ElementCard>
              <ElementCard title="Geo" element="geo" bgColorClass="bg-card">
                <CharacterTable
                  profileId={id}
                  allCharacters={charactersList || []}
                  profileCharacters={profile?.characters || []}
                  element="geo"
                />
              </ElementCard>
              <ElementCard title="Dendro" element="dendro" bgColorClass="bg-card">
                <CharacterTable
                  profileId={id}
                  allCharacters={charactersList || []}
                  profileCharacters={profile?.characters || []}
                  element="dendro"
                />
              </ElementCard>
            </div>
          </section>
        </Suspense>
      </Container>
      {profile && (
        <React.Fragment>
          <AddNotesModal id={id} notes={profile.notes} isOpen={isNotesModalOpen} setIsOpen={setIsNotesModalOpen} />
          <AddCharacterModal characters={charactersList?.map((char) => char.name) ?? []} isOpen={isAddCharacterModalOpen} setIsOpen={setIsAddCharacterModalOpen} />
          <DeleteProfileModal id={id} isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} />
          <CharacterViewModal isOpen={isCharacterViewModalOpen} setIsOpen={setIsCharacterViewModalOpen} />
        </React.Fragment>
      )}
    </AuthGuard>
  )
}

function Fallback() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex md:flex-row flex-col gap-4 items-start md:items-center md:justify-between justify-start">
        <Skeleton className="w-full bg-card rounded-md max-w-md" />
        <div className="flex flex-row gap-2 items-center">
          <Skeleton className="bg-card rounded-md w-18" />
          <Skeleton className="bg-card rounded-md w-32" />
          <Skeleton className="bg-card rounded-md w-24" />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 sm:gap-3 gap-2">
        <Skeleton className="min-h-48 bg-card rounded-md" />
        <Skeleton className="min-h-48 bg-card rounded-md" />
        <Skeleton className="min-h-48 bg-card rounded-md" />
        <Skeleton className="min-h-48 bg-card rounded-md" />
        <Skeleton className="min-h-48 bg-card rounded-md" />
        <Skeleton className="min-h-48 bg-card rounded-md" />
        <Skeleton className="min-h-48 bg-card rounded-md" />
        <Skeleton className="min-h-48 bg-card rounded-md" />
        <Skeleton className="min-h-48 bg-card rounded-md" />
      </div>
    </div>
  )
}

