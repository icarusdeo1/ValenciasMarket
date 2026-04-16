import { Text, Pressable } from 'react-native';
import { useEffect, useCallback, useState, createContext, useContext, type ReactNode } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

type ToastType = 'success' | 'error' | 'info';

type ToastMessage = {
  id: number;
  text: string;
  type: ToastType;
};

type ToastContextValue = {
  show: (text: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}

const TYPE_BG: Record<ToastType, string> = {
  success: 'bg-brand-secondary',
  error: 'bg-error',
  info: 'bg-surface dark:bg-surface-dark',
};

const TYPE_TEXT: Record<ToastType, string> = {
  success: 'text-white',
  error: 'text-white',
  info: 'text-text-primary dark:text-text-primary-dark',
};

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  const translateY = useSharedValue(-80);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 250 });
    translateY.value = withDelay(
      3000,
      withTiming(-80, { duration: 250 }, (finished) => {
        if (finished) runOnJS(onDismiss)();
      }),
    );
  }, [translateY, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className={`mx-4 mb-2 rounded-lg px-4 py-3 shadow-md ${TYPE_BG[toast.type]}`}
    >
      <Pressable onPress={onDismiss}>
        <Text className={`text-sm font-medium ${TYPE_TEXT[toast.type]}`}>
          {toast.text}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((text: string, type: ToastType = 'info') => {
    setToasts((prev) => [...prev, { id: nextId++, text, type }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Animated.View className="absolute left-0 right-0 top-14 z-50" pointerEvents="box-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </Animated.View>
    </ToastContext.Provider>
  );
}
