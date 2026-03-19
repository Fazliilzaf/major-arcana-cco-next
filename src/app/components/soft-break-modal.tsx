import { AlertTriangle, Zap } from "lucide-react";
import { Button } from "./ui/button";

interface SoftBreakModalProps {
  onContinue: () => void;
  onCancel: () => void;
  messageSubject: string;
}

export function SoftBreakModal({ onContinue, onCancel, messageSubject }: SoftBreakModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-gray-900">Lämna Snabbläge?</h3>
            <p className="text-[12px] text-gray-500">Du har 3 aktiva sprint-trådar</p>
          </div>
        </div>
        
        <div className="mb-5 rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="text-[12px] text-amber-900 mb-2">
            <strong>Soft Break:</strong> Du försöker öppna ett meddelande utanför sprint-zonen.
          </p>
          <p className="text-[11px] text-amber-800">
            Meddelande: <span className="font-semibold">{messageSubject}</span>
          </p>
        </div>

        <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
          <div className="flex items-start gap-2">
            <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-[11px] font-medium text-blue-900 mb-1">
                Snabbläge hjälper dig fokusera
              </p>
              <p className="text-[10px] text-blue-700">
                Max 3 trådar i fokus → Färre samtidigt → Snabbare hantering
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 rounded-full border-gray-200 px-4 py-2.5 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
          >
            Stanna i Sprint
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 rounded-full bg-amber-600 px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-amber-700"
          >
            Fortsätt ändå
          </Button>
        </div>
      </div>
    </div>
  );
}
