import { Check, Sparkles } from "lucide-react";

export function SvarsstudioPanel() {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-3 py-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[10px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            SVARSSTUDIO
          </h3>
          <button className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
            Boka
          </button>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">
            BOKNINGSFÖRSLAG
          </h2>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap mt-1">
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0 rounded text-[8px] font-semibold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700">
            Agera nu
          </span>
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0 rounded text-[8px] font-medium text-gray-700 dark:text-gray-300">
            Sara
          </span>
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0 rounded text-[8px] font-medium text-gray-700 dark:text-gray-300">
            Redo för åtgärd
          </span>
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0 rounded text-[8px] font-medium text-gray-700 dark:text-gray-300">
            Idag 15:15
          </span>
        </div>
      </div>

      {/* GÖR DETTA NU */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-pink-50/30 dark:bg-pink-950/10">
        <h4 className="text-[9px] font-bold text-pink-900 dark:text-pink-100 uppercase tracking-wide mb-1">
          🎯 GÖR DETTA NU
        </h4>
        <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">
          Bokningsförslag driver nästa steg
        </p>
        <p className="text-[10px] text-gray-700 dark:text-gray-300 leading-tight mb-2">
          Skicka ett konkret bokningsförslag och sätt ett tydligt beslutsstöd för kunden.
        </p>
        <button className="w-full px-3 py-1.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm">
          Skicka bokningsförslag
        </button>
      </div>

      {/* RESPONSPÅR */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800">
        <h4 className="text-[9px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
          RESPONSPÅR
        </h4>
        <div className="flex flex-wrap gap-1">
          {[
            { label: "Bokningsförslag", active: true },
            { label: "Uppföljning", active: false },
            { label: "Mellanbesked", active: false },
            { label: "Medicinsk vänt", active: false },
            { label: "Pris / trygghet", active: false },
            { label: "Adminsvar", active: false },
          ].map((spar) => (
            <button
              key={spar.label}
              className={`px-2 py-0.5 rounded text-[9px] font-medium transition-all ${
                spar.active
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {spar.label}
            </button>
          ))}
        </div>
      </div>

      {/* TONFILTER */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800">
        <h4 className="text-[9px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
          TONFILTER
        </h4>
        <div className="flex flex-wrap gap-1">
          {["Professionell", "Varm", "Lösningsfokuserad", "Beslutsstödjande"].map((ton) => (
            <span
              key={ton}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[8px] font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
            >
              <Check className="h-2 w-2" />
              {ton}
            </span>
          ))}
        </div>
      </div>

      {/* FINUSTERA */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800">
        <h4 className="text-[9px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
          FINUSTERA
        </h4>
        <div className="flex flex-wrap gap-1">
          {["Kortare", "Varmare", "Proffigare", "Skarpare"].map((fin) => (
            <button
              key={fin}
              className="px-2 py-0.5 rounded text-[9px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {fin}
            </button>
          ))}
        </div>
      </div>

      {/* SIGNATUR */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800">
        <h4 className="text-[9px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
          SIGNATUR
        </h4>
        <div className="flex flex-wrap gap-1">
          {[
            { label: "Sara", active: true },
            { label: "Egozone", active: false },
            { label: "Facit", active: false },
            { label: "Redigera", active: false },
          ].map((sig) => (
            <button
              key={sig.label}
              className={`px-2 py-0.5 rounded text-[9px] font-medium transition-all ${
                sig.active
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {sig.label}
            </button>
          ))}
        </div>
      </div>

      {/* SMART STÖD */}
      <div className="px-3 py-2 bg-purple-50/30 dark:bg-purple-950/10">
        <div className="flex items-start gap-2">
          <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-900/30">
            <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <h4 className="text-[10px] font-bold text-purple-900 dark:text-purple-100">
                SMART STÖD
              </h4>
              <span className="text-[9px] font-semibold text-purple-700 dark:text-purple-300">
                Bokningsförslag · 92%
              </span>
            </div>
            <p className="text-[9px] text-purple-800 dark:text-purple-200 leading-tight">
              Strategin är bokningsstödjande och ger kunden tydliga alternativ för snabb beslut.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}