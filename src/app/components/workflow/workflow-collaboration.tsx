import { Users, MessageSquare, X } from 'lucide-react';

export function WorkflowCollaboration({ workflowId, onClose }: { workflowId: string; onClose: () => void }) {
  const editors = [
    { name: 'Sara L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara', status: 'editing', location: 'Step 3' },
    { name: 'Egzona K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Egzona', status: 'viewing', location: 'Analytics' },
    { name: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You', status: 'editing', location: 'Canvas' },
  ];

  const comments = [
    { user: 'Sara L.', time: '2 min ago', text: 'Should we reduce the wait time from 24h to 12h?' },
    { user: 'Egzona K.', time: '1 min ago', text: 'Agree! Most payments come in within 4h anyway.' },
  ];

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 animate-in slide-in-from-right-4 duration-300">
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900">Live Collaboration</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Active Users */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
          Active Now ({editors.length})
        </h4>
        <div className="space-y-2">
          {editors.map((editor, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={editor.avatar}
                  alt={editor.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                  editor.status === 'editing' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900">{editor.name}</div>
                <div className="text-xs text-gray-600 capitalize">{editor.status} • {editor.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="p-4 max-h-60 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-4 w-4 text-gray-500" />
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            Comments
          </h4>
        </div>
        <div className="space-y-3">
          {comments.map((comment, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-900">{comment.user}</span>
                <span className="text-xs text-gray-500">{comment.time}</span>
              </div>
              <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Comment */}
      <div className="border-t border-gray-200 p-3">
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
    </div>
  );
}
