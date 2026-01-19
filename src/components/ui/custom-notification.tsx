import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationProps {
  title: string;
  message?: string;
  type?: NotificationType;
}

export const Notification = ({ title, message, type = "success" }: NotificationProps) => {
  const configs = {
    success: {
      icon: <CheckCircle2 className="h-6 w-6" />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/20",
    },
    error: {
      icon: <XCircle className="h-6 w-6" />,
      color: "text-red-500",
      bgColor: "bg-red-500/20",
    },
    info: {
      icon: <Info className="h-6 w-6" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    warning: {
      icon: <AlertCircle className="h-6 w-6" />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
  };

  const config = configs[type];

  return (
    <div className="flex w-full min-w-[320px] items-center gap-4 rounded-2xl bg-zinc-900 border border-white/10 p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${config.bgColor} ${config.color}`}>
        {config.icon}
      </div>
      <div className="flex flex-col">
        <h3 className="font-display font-bold text-white">{title}</h3>
        {message && <p className="text-sm text-zinc-400">{message}</p>}
      </div>
    </div>
  );
};

export const showNotification = (title: string, message?: string, type: NotificationType = "success", duration = 3000) => {
  toast.custom(() => <Notification title={title} message={message} type={type} />, {
    duration,
    position: 'top-center'
  });
};
