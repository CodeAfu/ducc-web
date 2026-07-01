import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Container from '~/components/Container';
import LoadingSpinner from '~/components/LoadingSpinner';
import { GenshinCharacter } from './-types';
import { useAuth } from '@clerk/tanstack-react-start';
import { useEffect, useState } from 'react';
import AnimatedButton from '~/components/AnimatedButton';
import ConfirmationModal from '~/components/ConfirmationModal';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import React from 'react';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/genshin/characters/$id')({
  component: CharacterPage,
})

interface EditFormState {
  name: string;
  display_name: string;
  element_name: string;
  stars: number;
  notes: string;
}

function CharacterPage() {
  const { getToken } = useAuth();
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: character, isFetching, isError, error } = useQuery({
    queryKey: ["api", "v3", "genshin", "characters", id],
    queryFn: async (): Promise<GenshinCharacter> => {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/characters/${id}`, {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  const [form, setForm] = useState<EditFormState>({
    name: "",
    display_name: "",
    element_name: "",
    stars: 4,
    notes: "",
  });

  useEffect(() => {
    if (character) {
      setForm({
        name: character.name,
        display_name: character.display_name ?? "",
        element_name: character.element_name,
        stars: character.stars,
        notes: character.notes ?? "",
      });
    }
  }, [character]);

  const { mutateAsync: editMutation, isPending: isEditPending } = useMutation({
    mutationFn: async (data: EditFormState) => {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/characters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          name: data.name,
          display_name: data.display_name,
          element_name: data.element_name,
          stars: Number(data.stars),
          notes: data.notes,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["api", "v3", "genshin", "characters", id], updated);
      queryClient.invalidateQueries({ queryKey: ["api", "v3", "genshin", "characters"] });
      setIsEditing(false);
    },
    onError: (err) => console.error(err),
  });

  const handleEdit = () => {
    toast.promise(editMutation(form), {
      loading: "Saving changes...",
      success: "Character updated successfully",
      error: (err) => err.message || "Edit failed",
    });
  };

  const deleteFn = async () => {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/characters/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
  };

  if (isFetching || !character) {
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

  const displayName = character!.display_name || character!.name;
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <React.Fragment>
      <Container>
        <div className="max-w-7xl w-full mx-auto px-4 py-8 space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-border/50">
            <div className="flex items-center gap-5 flex-1">
              <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0 border border-primary/20 shadow-sm">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold truncate tracking-tight">{displayName}</h1>
                {character.display_name && (
                  <p className="text-muted-foreground text-sm mt-0.5 italic">{character.name}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary/10 border border-secondary/20 text-secondary-foreground font-bold">
                    {character.element_name}
                  </span>
                  <span className="text-gold text-sm tracking-[0.2em] font-serif drop-shadow-sm">
                    {"★".repeat(character.stars)}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded border border-border/40">
                    ID: {character.id}
                  </span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <div className="flex gap-3 shrink-0 sm:pt-0 pt-2">
                <AnimatedButton
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex-1 sm:flex-none px-6"
                >
                  Edit character
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => setDeleteOpen(true)}
                  variant="destructive"
                  className="flex-1 sm:flex-none px-6"
                >
                  Delete
                </AnimatedButton>
              </div>
            )}
          </div>

          {!isEditing ? (
            /* Detail view */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="lg:col-span-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/40 pb-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Properties</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/40">
                    {[
                      ["Internal name", character.name],
                      ["Display name", character.display_name || "—"],
                      ["Element", character.element_name],
                      ["Rarity", `${character.stars} ★`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between items-center px-6 py-4 text-sm hover:bg-muted/30 transition-colors">
                        <span className="text-muted-foreground font-medium">{label}</span>
                        <span className="font-semibold text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <Card className="min-h-[240px] border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-border/40 pb-4">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Character Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                      {character.notes || <span className="italic text-muted-foreground">No notes recorded for this character.</span>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-border/40 pb-4">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Timestamps</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
                      {[
                        ["Created At", new Date(character.created_at).toLocaleString()],
                        ["Updated At", new Date(character.updated_at).toLocaleString()],
                      ].map(([label, value]) => (
                        <div key={label} className="flex flex-col gap-1.5 px-6 py-4">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">{label}</span>
                          <span className="text-sm font-mono text-primary/80">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Edit form */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Card className="lg:col-span-1 border-border/50 bg-card/50">
                <CardHeader className="border-b border-border/40 pb-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Edit Properties</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  {([
                    ["name", "Internal name"],
                    ["display_name", "Display name"],
                    ["element_name", "Element"],
                  ] as const).map(([field, label]) => (
                    <div key={field} className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">{label}</label>
                      <input
                        className="w-full border border-border/60 rounded-xl px-4 py-2.5 text-sm bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        value={form[field]}
                        onChange={(e) => setForm(p => ({ ...p, [field]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Stars (1–5)</label>
                    <input
                      type="number" min={1} max={5}
                      className="w-full border border-border/60 rounded-xl px-4 py-2.5 text-sm bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      value={form.stars}
                      onChange={(e) => setForm(p => ({ ...p, stars: Number(e.target.value) }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 flex flex-col border-border/50 bg-card/50">
                <CardHeader className="border-b border-border/40 pb-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Edit Notes</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex-1 flex flex-col space-y-6">
                  <textarea
                    className="w-full flex-1 border border-border/60 rounded-xl px-4 py-3 text-sm bg-background/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all min-h-[300px]"
                    value={form.notes}
                    onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Describe this character..."
                  />

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <AnimatedButton
                      onClick={() => handleEdit()}
                      disabled={isEditPending}
                      variant="primary"
                      className="flex-1 py-3"
                    >
                      {isEditPending ? "Saving changes..." : "Save character"}
                    </AnimatedButton>
                    <AnimatedButton
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="flex-1 py-3"
                    >
                      Discard changes
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Container>
      <ConfirmationModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        mutationFn={deleteFn}
        variables={undefined}
        invalidateQueryKeys={["api", "v3", "genshin", "characters"]}
        onSuccessActions={() => navigate({ to: "/genshin" })}
        title="Delete character"
        description={<>Are you sure you want to delete <span className="text-primary font-bold">{displayName}</span>? This cannot be undone.</>}
        successMessage="Character deleted"
      />
    </React.Fragment>
  );
}
