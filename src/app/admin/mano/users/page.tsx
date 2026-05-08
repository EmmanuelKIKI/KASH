import { createClient } from '@/infrastructure/supabase/server';
import { formatDate, getInitials } from '@/core/utils';
import { UserToggleButton } from '@/components/admin/UserToggleButton';
import { SearchSVG } from '@/components/ui/Icons';

export default async function AdminUsersPage() {
  const supabase = createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'freelance')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A202C]">Utilisateurs</h1>
        <p className="text-gray-500 text-sm mt-1">{users?.length ?? 0} freelance(s) inscrit(s)</p>
      </div>

      {!users || users.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-500">Aucun utilisateur inscrit pour le moment.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Inscription</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.full_name} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#00A36C]/20 flex items-center justify-center text-[#00A36C] text-sm font-bold">
                            {getInitials(user.full_name)}
                          </div>
                        )}
                        <span className="font-medium text-[#1A202C] text-sm">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {user.is_active ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <UserToggleButton userId={user.id} isActive={user.is_active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
