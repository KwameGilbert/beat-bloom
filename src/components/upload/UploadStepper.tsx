import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
}

interface UploadStepperProps {
  steps: Step[];
  currentStep: number;
}

export const UploadStepper = ({ steps, currentStep }: UploadStepperProps) => {
  return (
    <div className="mb-12 relative">
      <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-secondary" />
      <div 
        className="absolute top-1/2 left-0 h-0.5 bg-orange-500 transition-all duration-500 -translate-y-1/2" 
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      <div className="relative flex justify-between">
        {steps.map((step) => {
          const Icon = step.icon;
          const active = currentStep >= step.id;
          const current = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={cn(
                "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                active ? "border-orange-500 bg-orange-500 text-white" : "border-secondary bg-background text-muted-foreground",
                current && "ring-4 ring-orange-500/20"
              )}>
                {active && step.id < currentStep ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className={cn(
                "mt-2 text-xs font-bold uppercase tracking-widest transition-colors",
                active ? "text-orange-500" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
