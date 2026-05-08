import { createClient } from '@/infrastructure/supabase/server';
import Link from 'next/link';
import { formatCurrency, formatDateShort, getStatusColor } from '@/core/utils';
import { PROJECT_STATUS_LABELS } from '@/core/constants';
import { ProjectsSVG, PlusSVG } from '@/components/ui/Icons';

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A202C]">Projets</h1>
          <p className="text-gray-500 text-sm mt-1">{projects?.length ?? 0} projet(s) au total</p>
        </div>
        <Link href="/dashboard/projects/new" className="btn-primary flex items-center gap-2">
          <PlusSVG size={18} />
          Nouveau projet
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-[#00A36C]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ProjectsSVG size={28} color="#00A36C" />
          </div>
          <p className="text-[#1A202C] font-semibold text-lg mb-2">Aucun projet</p>
          <p className="text-gray-500 text-sm mb-6">Créez votre premier projet pour commencer à gérer vos revenus.</p>
          <Link href="/dashboard/projects/new" className="btn-primary inline-flex items-center gap-2">
            <PlusSVG size={16} />
            Créer un projet
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="card-hover flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-semibold text-[#1A202C] truncate">{project.title}</p>
                  <span className={`badge ${getStatusColor(project.status)}`}>
                    {PROJECT_STATUS_LABELS[project.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {project.client_name ?? 'Client non renseigné'}
                  {project.start_date && ` · Démarré le ${formatDateShort(project.start_date)}`}
                </p>
              </div>
              <p className="font-bold text-[#00A36C] text-lg flex-shrink-0">
                {formatCurrency(project.amount)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
