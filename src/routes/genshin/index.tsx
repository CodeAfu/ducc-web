import { useAuth } from '@clerk/tanstack-react-start';
import { useQueries, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import ProfileCard from './-components/ProfileCard';
import { AllGenshinProfilesResponse, GenshinProfileStats } from './types';
import { useState } from 'react';
import CreateProfileModal from './-components/CreateProfileModal';
import AnimatedButton from '~/components/AnimatedButton';
import AuthGuard from '~/components/AuthGuard';
import CharacterViewModal from './-components/CharacterViewModal';
import LoadingSpinner from '~/components/LoadingSpinner';

export const Route = createFileRoute('/genshin/')({
  component: GenshinProfileIdPage,
});


function GenshinProfileIdPage() {
  const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useAuth()
  const [isOpen, setIsOpen] = useState(false);
  const [isViewCharactersModalOpen, setIsViewCharactersModalOpen] = useState(false);

  const { data: profiles = [], isFetching, isError, error } = useQuery({
    queryKey: ["api", "v3", "genshin", "profiles"],
    queryFn: async (): Promise<AllGenshinProfilesResponse[]> => {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/profiles`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    },
    enabled: isAuthLoaded && isSignedIn,
  });

  const profileStatsQueries = useQueries({
    queries: profiles.map(profile => ({
      queryKey: ["api", "v3", "genshin", "profiles", profile.id, "stats"],
      queryFn: async (): Promise<GenshinProfileStats> => {
        const token = await getToken();
        if (!token) throw new Error("Unauthorized");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/profiles/${profile.id}/stats`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        console.log(`Profile ${profile.id} stats`, json)
        return json;
      },
    }))
  });

  if (isFetching) {
    return (
      <div className="flex justify-center items-center w-full min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-20 text-destructive font-medium">
        Error: {error instanceof Error ? error.message : "An unknown error occurred"}
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="md:mt-12 mt-4 flex flex-col mx-auto max-w-7xl w-full md:px-8 sm:px-4 px-2">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold md:text-3xl text-2xl mb-4">Profiles</h1>
          <div className="flex items-center justify-center gap-2">
            <AnimatedButton variant="outline" onClick={() => setIsOpen(true)}>
              Create
            </AnimatedButton>
            <AnimatedButton variant="primary" onClick={() => setIsViewCharactersModalOpen(true)}>
              All Characters
            </AnimatedButton>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-4 gap-2">
          {profiles.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 rounded-xl">
              No profiles found. Create one to get started.
            </div>
          ) : (
            profiles.map((profile, index) => {
              const { data: stats } = profileStatsQueries[index];
              return (
                <ProfileCard key={profile.id} profileId={profile.id}>
                  <p className="text-foreground font-bold tracking-tighter text-lg truncate text-nowrap">{profile.name}</p>
                  <div className="mt-2 text-sm">
                    <p>Total Chars:{" "}
                      <span>{stats?.char_count}</span>
                    </p>
                  </div>
                  <p className="pt-2 mt-4 border-t text-muted-foreground text-sm">
                    Notes: {profile.notes ? profile.notes : "N/A"}
                  </p>
                </ProfileCard>
              )
            })
          )}
        </div>
      </div>
      <CreateProfileModal title="Create Profile" isOpen={isOpen} setIsOpen={setIsOpen} />
      <CharacterViewModal isOpen={isViewCharactersModalOpen} setIsOpen={setIsViewCharactersModalOpen} />
    </AuthGuard >
  );
}
