import { createClient } from '@/infrastructure/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate, getStatusColor } from '@/core/utils';
import { PROJECT_STATUS_LABELS, TASK_STATUS_LABELS } from '@/core/constants';
import { ProjectsSVG, CalendarSVG } from '@/components/ui/Icons';
import { ProjectActions } from '@/components/dashboard/ProjectActions';

interface Props {
  params: { id: string };
}

export default async function ProjectDetailPage({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user!.id)
    .single();

  if (!project) notFound();

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/projects" className="text-sm text-gray-500 hover:text-[#00A36C] transition-colors mb-2 inline-block">
          ← Retour aux projets
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A202C]">{project.title}</h1>
            {project.client_name && (
              <p className="text-gray-500 text-sm mt-1">Client : {project.client_name}</p>
            )}
          </div>
          <span className={`badge ${getStatusColor(project.status)} flex-shrink-0`}>
            {PROJECT_STATUS_LABELS[project.status]}
          </span>
        </div>
      </div>

      {/* Montant */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00A36C]/10 rounded-xl flex items-center justify-center">
              <ProjectsSVG size={20} color="#00A36C" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant du projet</p>
              <p className="text-2xl font-bold text-[#00A36C]">{formatCurrency(project.amount)}</p>
            </div>
          </div>
          <ProjectActions project={project} />
        </div>

        {(project.start_date || project.end_date) && (
          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
            {project.start_date && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarSVG size={15} color="#00A36C" />
                Début : {formatDate(project.start_date)}
              </div>
            )}
            {project.end_date && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarSVG size={15} color="#F6AD55" />
                Fin : {formatDate(project.end_date)}
              </div>
            )}
          </div>
        )}

        {project.description && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed pt-4 border-t border-gray-100">
            {project.description}
          </p>
        )}
      </div>

      {/* Tâches */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#1A202C]">Tâches ({tasks?.length ?? 0})</h2>
          <Link
            href={`/dashboard/projects/${project.id}/tasks/new`}
            className="text-sm text-[#00A36C] font-semibold hover:underline"
          >
            + Ajouter
          </Link>
        </div>
        {!tasks || tasks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Aucune tâche pour ce projet.</p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-[#1A202C]">{task.title}</p>
                  {task.due_date && (
                    <p className="text-xs text-gray-400 mt-0.5">Échéance : {formatDate(task.due_date)}</p>
                  )}
                </div>
                <span className={`badge ${getStatusColor(task.status)}`}>
                  {TASK_STATUS_LABELS[task.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
