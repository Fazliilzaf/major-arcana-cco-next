import { X, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface RestoreIgnoredModalProps {
  onClose: () => void;
  ignoredTypes: string[];
  onRestore: (id: string) => void;
  onRestoreAll: () => void;
}

export function RestoreIgnoredModal({ onClose, ignoredTypes, onRestore, onRestoreAll }: RestoreIgnoredModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-blue-600" />
            <h3 className="text-[16px] font-semibold text-gray-900">Ignorerade meddelandetyper</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {ignoredTypes.length === 0 ? (
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-center">
            <p className="text-[12px] text-gray-600">Inga ignorerade typer just nu</p>
          </div>
        ) : (
          <>
            <div className="mb-4 space-y-2 max-h-[300px] overflow-y-auto">
              {ignoredTypes.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-[12px] text-gray-700">Meddelandetyp #{id}</span>
                  <button
                    onClick={() => onRestore(id)}
                    className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    Återställ
                  </button>
                </div>
              ))}
            </div>

            <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-[11px] text-blue-900">
                Återställda typer kommer att visas i inkorgen igen enligt sina prioritetsregler.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 rounded-full border-gray-200 px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
              >
                Stäng
              </Button>
              <Button
                onClick={onRestoreAll}
                className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-blue-700"
              >
                Återställ alla
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
