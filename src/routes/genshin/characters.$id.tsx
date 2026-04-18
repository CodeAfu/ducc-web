import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Container from '~/components/Container';
import LoadingSpinner from '~/components/LoadingSpinner';
import { GenshinCharacter } from './types';
import { useAuth } from '@clerk/tanstack-react-start';
import { useState } from 'react';
import AnimatedButton from '~/components/AnimatedButton';
import ConfirmationModal from '~/components/ConfirmationModal';
import React from 'react';

export const Route = createFileRoute('/genshin/characters/$id')({
  component: CharacterPage,
  pendingComponent: () => (
    <div className="flex justify-center items-center w-full min-h-[50vh]">
      <LoadingSpinner />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="text-center mt-20 text-destructive font-medium">
      Error: {error instanceof Error ? error.message : "An unknown error occurred"}
    </div>
  ),
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
  const [formError, setFormError] = useState<string | null>(null);

  const { data: character } = useSuspenseQuery({
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
    name: character.name,
    display_name: character.display_name ?? "",
    element_name: character.element_name,
    stars: character.stars,
    notes: character.notes ?? "",
  });

  const editMutation = useMutation({
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
      setFormError(null);
    },
    onError: (err) => setFormError(err instanceof Error ? err.message : "Edit failed"),
  });

  const deleteFn = async () => {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v3/genshin/characters/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
  };

  const displayName = character.display_name || character.name;
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <React.Fragment>

      <Container>
        <div className="max-w-7xl w-full mx-auto px-4 py-8 space-y-6">

          {/* Header */}
          <div className="flex items-center gap-5 pb-6 border-b">
            <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold truncate">{displayName}</h1>
              {character.display_name && (
                <p className="text-muted-foreground text-sm mt-0.5">{character.name}</p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full border font-medium">{character.element_name}</span>
                <span className="text-amber-500 text-sm tracking-wider">{"★".repeat(character.stars)}{"☆".repeat(5 - character.stars)}</span>
                <span className="text-xs text-muted-foreground">ID #{character.id}</span>
              </div>
            </div>
            {!isEditing && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => { setIsEditing(true); setFormError(null); }}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-muted transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="px-4 py-2 text-sm border border-destructive/40 text-destructive rounded-lg hover:bg-destructive/10 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {formError && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
              {formError}
            </div>
          )}

          {!isEditing ? (
            /* Detail view */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Details</h2>
                <div className="rounded-xl border divide-y">
                  {[
                    ["Internal name", character.name],
                    ["Display name", character.display_name || "—"],
                    ["Element", character.element_name],
                    ["Rarity", `${character.stars} ★`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notes</h2>
                <div className="rounded-xl border px-4 py-3 min-h-32 text-sm text-muted-foreground">
                  {character.notes || "No notes."}
                </div>

                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Timestamps</h2>
                <div className="rounded-xl border divide-y">
                  {[
                    ["Created", new Date(character.created_at).toLocaleString()],
                    ["Updated", new Date(character.updated_at).toLocaleString()],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium tabular-nums">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Edit form */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Edit details</h2>
                <div className="space-y-3">
                  {([
                    ["name", "Internal name", "text"],
                    ["display_name", "Display name", "text"],
                    ["element_name", "Element", "text"],
                  ] as const).map(([field, label]) => (
                    <label key={field} className="flex flex-col gap-1.5">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <input
                        className="border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                        value={form[field]}
                        onChange={(e) => setForm(p => ({ ...p, [field]: e.target.value }))}
                      />
                    </label>
                  ))}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm text-muted-foreground">Stars (1–5)</span>
                    <input
                      type="number" min={1} max={5}
                      className="border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                      value={form.stars}
                      onChange={(e) => setForm(p => ({ ...p, stars: Number(e.target.value) }))}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notes</h2>
                <textarea
                  className="w-full border rounded-xl px-3 py-2.5 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-40"
                  value={form.notes}
                  onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Optional notes..."
                />

                <div className="flex gap-2 pt-2">
                  <AnimatedButton
                    onClick={() => editMutation.mutate(form)}
                    disabled={editMutation.isPending}
                    className="flex-1 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm hover:bg-primary/90 transition"
                  >
                    {editMutation.isPending ? "Saving..." : "Save"}
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => { setIsEditing(false); setFormError(null); }}
                    className="flex-1 border rounded-lg px-4 py-2 text-sm bg-transparent hover:bg-muted transition"
                  >
                    Cancel
                  </AnimatedButton>
                </div>
              </div>
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
