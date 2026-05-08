'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import { EditSVG, TrashSVG } from '@/components/ui/Icons';
import type { Project } from '@/core/types';

export function ProjectActions({ project }: { project: Project }) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const supabase = createClient();
    await supabase.from('projects').delete().eq('id', project.id);
    router.push('/dashboard/projects');
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
      >
        <EditSVG size={14} />
        Modifier
      </button>

      {!confirmDelete ? (
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <TrashSVG size={14} />
          Supprimer
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Confirmer ?</span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            {deleting ? '...' : 'Oui'}
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Non
          </button>
        </div>
      )}
    </div>
  );
}
