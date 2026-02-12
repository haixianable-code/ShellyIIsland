
import React from 'react';
import { useNotificationStore, NotificationType } from '../store/useNotificationStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ICONS: Record<NotificationType, React.ElementType> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info
};

const THEMES: Record<NotificationType, string> = {
  success: 'bg-[#8bc34a] text-white border-[#78c850] shadow-[0_4px_0_#5a9a3b]',
  error: 'bg-[#ff7b72] text-white border-[#ff8a80] shadow-[0_4px_0_#d32f2f]',
  info: 'bg-[#2d4a47] text-white border-[#4b7d78] shadow-[0_4px_0_#1a2e2c]'
};

const NotificationToast: React.FC = () => {
  const { notifications, remove } = useNotificationStore();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 pointer-events-none w-full max-w-xs px-4">
      {notifications.map((n) => {
        const Icon = ICONS[n.type];
        return (
          <div 
            key={n.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl border-4 ${THEMES[n.type]} animate-slideDown shadow-lg`}
          >
            <Icon size={20} className="shrink-0" />
            <p className="flex-1 text-xs font-black uppercase tracking-tight leading-tight">
              {n.message}
            </p>
            <button onClick={() => remove(n.id)} className="opacity-50 hover:opacity-100 transition-opacity">
               <X size={14} />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-20px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slideDown { animation: slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default NotificationToast;
