import { AlertTriangle, Mail, ExternalLink, CheckCircle2, Info } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface EmailAliasWarningProps {
  customerName: string;
  currentEmail: string;
  primaryEmail: string;
  knownEmails: string[];
  onAddToPrimary: () => void;
  onViewAllEmails: () => void;
}

export function EmailAliasWarning({
  customerName,
  currentEmail,
  primaryEmail,
  knownEmails,
  onAddToPrimary,
  onViewAllEmails,
}: EmailAliasWarningProps) {
  const isNewEmail = !knownEmails.includes(currentEmail);

  if (!isNewEmail) return null;

  return (
    <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-amber-900 text-sm">
              🚨 Kunden skrev från en OVANLIG email-adress
            </h4>
          </div>

          <div className="text-sm text-amber-800 space-y-2">
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Nuvarande email:</div>
                <div className="font-mono text-xs bg-amber-100 px-2 py-1 rounded inline-block mt-1">
                  {currentEmail}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
              <div>
                <div className="font-medium">Känd primär email:</div>
                <div className="font-mono text-xs bg-green-100 px-2 py-1 rounded inline-block mt-1">
                  {primaryEmail}
                </div>
              </div>
            </div>

            {knownEmails.length > 1 && (
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <div>
                  <div className="font-medium">Andra kända email-adresser:</div>
                  <div className="text-xs mt-1 space-y-1">
                    {knownEmails.filter(email => email !== primaryEmail).slice(0, 2).map((email, idx) => (
                      <div key={idx} className="font-mono bg-blue-50 px-2 py-1 rounded">
                        {email}
                      </div>
                    ))}
                    {knownEmails.length > 3 && (
                      <button
                        onClick={onViewAllEmails}
                        className="text-blue-600 hover:text-blue-700 underline text-xs"
                      >
                        +{knownEmails.length - 3} till...
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center gap-2">
              <Button
                onClick={onAddToPrimary}
                className="h-8 text-xs bg-amber-600 hover:bg-amber-700"
              >
                <Mail className="h-3 w-3 mr-1" />
                Lägg till som känd email
              </Button>
              <Button
                onClick={onViewAllEmails}
                variant="outline"
                className="h-8 text-xs border-amber-300 hover:bg-amber-100"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Visa alla email-adresser
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
