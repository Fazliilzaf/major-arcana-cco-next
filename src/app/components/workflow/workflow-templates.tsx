import { Download, Star, Copy, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function WorkflowTemplates() {
  const templates = [
    { id: '1', name: 'Churn-förebyggande sekvens', rating: 4.9, uses: 1247, author: 'HairTP Team', category: 'Retention' },
    { id: '2', name: 'Merförsäljnings-automatisering', rating: 4.7, uses: 892, author: '@sara_l', category: 'Revenue' },
    { id: '3', name: 'SLA Guardian', rating: 4.8, uses: 1056, author: 'HairTP Team', category: 'Operations' },
    { id: '4', name: 'Helg-autosvar', rating: 4.9, uses: 2145, author: '@egzona_k', category: 'Support' },
    { id: '5', name: 'Betalningspåminnelse-sekvens', rating: 4.7, uses: 678, author: '@johan_b', category: 'Finance' },
    { id: '6', name: 'VIP Fast Track', rating: 4.8, uses: 534, author: 'HairTP Team', category: 'VIP' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-3">
      <div className="max-w-5xl mx-auto">
        <div className="mb-3">
          <h2 className="text-[14px] font-bold text-gray-900">Mallbibliotek</h2>
          <p className="text-[9px] text-gray-600 mt-0.5">Färdiga arbetsflöden från communityn</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {templates.map(template => (
            <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-2.5 hover:border-pink-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex-1">
                  <h3 className="text-[10px] font-bold text-gray-900 mb-1">{template.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-semibold rounded">
                      {template.category}
                    </span>
                    <span className="text-[8px] text-gray-500">av {template.author}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                  <span className="text-[9px] font-bold text-gray-900">{template.rating}</span>
                </div>
                <div className="text-[9px] text-gray-600">{template.uses.toLocaleString()} användningar</div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toast.success(`Använder mall: ${template.name}`)}
                  className="flex-1 px-2 py-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-md text-[8px] font-semibold hover:from-pink-700 hover:to-rose-700 transition-all"
                >
                  <Download className="h-2 w-2 inline mr-0.5" />
                  Använd mall
                </button>
                <button className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-all">
                  <Eye className="h-2.5 w-2.5 text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
