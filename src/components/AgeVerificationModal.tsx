import { View, Text, Modal } from 'react-native';
import { Button } from './Button';

type AgeVerificationModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AgeVerificationModal({ visible, onConfirm, onCancel }: AgeVerificationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50 px-8">
        <View className="w-full rounded-2xl bg-surface p-6 dark:bg-surface-dark">
          <Text className="mb-2 text-center text-xl font-bold text-text-primary dark:text-text-primary-dark">
            Age Verification
          </Text>
          <Text className="mb-6 text-center text-base text-text-secondary dark:text-text-secondary-dark">
            Are you 21 or older?
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button title="No" variant="outline" onPress={onCancel} />
            </View>
            <View className="flex-1">
              <Button title="Yes" onPress={onConfirm} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
