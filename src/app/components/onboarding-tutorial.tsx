import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Zap, MessageSquare, Sliders, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useLanguage } from "../context/language-context";

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [step, setStep] = useState(0);
  const { t } = useLanguage();

  const steps = [
    {
      icon: <Sparkles className="h-8 w-8 text-pink-600" />,
      title: t("onboarding.welcome.title"),
      description: t("onboarding.welcome.desc"),
      highlight: t("onboarding.welcome.highlight"),
    },
    {
      icon: <Zap className="h-8 w-8 text-emerald-600" />,
      title: t("onboarding.sprint.title"),
      description: t("onboarding.sprint.desc"),
      highlight: t("onboarding.sprint.highlight"),
      image: "🏃‍♂️",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: t("onboarding.progressive.title"),
      description: t("onboarding.progressive.desc"),
      highlight: t("onboarding.progressive.highlight"),
      image: "📊",
    },
    {
      icon: <Sliders className="h-8 w-8 text-amber-600" />,
      title: t("onboarding.density.title"),
      description: t("onboarding.density.desc"),
      highlight: t("onboarding.density.highlight"),
      image: "🎚️",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-pink-600" />,
      title: t("onboarding.ai.title"),
      description: t("onboarding.ai.desc"),
      highlight: t("onboarding.ai.highlight"),
      image: "🤖",
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      toast.success(t("onboarding.ready"));
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    toast.info(t("onboarding.skipped"));
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <span className="font-semibold text-pink-600">Steg {step + 1}</span>
            <span>/</span>
            <span>{steps.length}</span>
          </div>
          <button
            onClick={handleSkip}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200">
              {currentStep.icon}
            </div>
          </div>

          {currentStep.image && (
            <div className="mb-4 text-6xl">{currentStep.image}</div>
          )}

          <h3 className="text-[20px] font-bold text-gray-900 mb-2">{currentStep.title}</h3>
          <p className="text-[14px] text-gray-600 mb-3">{currentStep.description}</p>
          
          <div className="inline-block rounded-full bg-pink-50 border border-pink-200 px-3 py-1.5 text-[12px] font-medium text-pink-700">
            {currentStep.highlight}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button
              onClick={handlePrev}
              variant="outline"
              className="flex-1 gap-1.5 rounded-full border-gray-200 px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Tillbaka
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 gap-1.5 rounded-full bg-gradient-to-r from-pink-600 to-pink-700 px-4 py-2.5 text-[13px] font-semibold text-white hover:from-pink-700 hover:to-pink-800 shadow-lg"
          >
            {isLastStep ? "Börja använda CCO" : "Nästa"}
            {!isLastStep && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Skip */}
        {!isLastStep && (
          <div className="mt-3 text-center">
            <button
              onClick={handleSkip}
              className="text-[12px] text-gray-500 hover:text-gray-700 transition-colors"
            >
              Hoppa över tutorial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}