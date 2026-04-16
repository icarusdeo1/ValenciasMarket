import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useCallback, useMemo, useState, useEffect } from 'react';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import type { MenuItem, SelectedChoice, CartItem } from '@/types';
import { calculateItemTotal, formatPrice } from '@/utils/calculateItemTotal';
import { useCartStore } from '@/stores';
import { useToast } from './Toast';
import { RadioGroup } from './RadioGroup';
import { ToggleOption } from './ToggleOption';
import { QuantitySelector } from './QuantitySelector';
import { Input } from './Input';
import { Button } from './Button';

type ItemDetailSheetProps = {
  item: MenuItem | null;
  editingCartItem?: CartItem | null;
  onClose: () => void;
};

export function ItemDetailSheet({ item, editingCartItem, onClose }: ItemDetailSheetProps) {
  const snapPoints = useMemo(() => ['60%', '90%'], []);
  const addItem = useCartStore((s) => s.addItem);
  const updateItem = useCartStore((s) => s.updateItem);
  const { show: showToast } = useToast();

  const [selectedChoices, setSelectedChoices] = useState<SelectedChoice[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (editingCartItem) {
      setSelectedChoices(editingCartItem.selectedChoices);
      setSpecialInstructions(editingCartItem.specialInstructions);
      setQuantity(editingCartItem.quantity);
    } else {
      setSelectedChoices([]);
      setSpecialInstructions('');
      setQuantity(1);
    }
  }, [editingCartItem, item]);

  const isEditing = !!editingCartItem;

  const requiredGroupIds = useMemo(
    () =>
      item?.optionGroups
        ?.filter((g) => g.required && g.type === 'single_select')
        .map((g) => g.id) ?? [],
    [item],
  );

  const allRequiredSelected = useMemo(
    () =>
      requiredGroupIds.every((gid) =>
        selectedChoices.some((c) => c.groupId === gid),
      ),
    [requiredGroupIds, selectedChoices],
  );

  const total = useMemo(() => {
    if (!item) return { raw: 0, formatted: '$0.00' };
    return calculateItemTotal(item.price, selectedChoices, quantity);
  }, [item, selectedChoices, quantity]);

  const handleRadioChange = useCallback(
    (groupId: string, choiceId: string, priceModifier: number) => {
      setSelectedChoices((prev) => [
        ...prev.filter((c) => c.groupId !== groupId),
        { groupId, choiceId, priceModifier },
      ]);
    },
    [],
  );

  const handleToggleChange = useCallback(
    (groupId: string, choiceId: string, priceModifier: number, selected: boolean) => {
      setSelectedChoices((prev) => {
        const without = prev.filter((c) => c.groupId !== groupId);
        if (selected) {
          return [...without, { groupId, choiceId, priceModifier }];
        }
        return without;
      });
    },
    [],
  );

  function handleAddToCart() {
    if (!item || !allRequiredSelected) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (isEditing && editingCartItem) {
      updateItem(
        editingCartItem.cartItemId,
        selectedChoices,
        specialInstructions,
        quantity,
      );
      showToast('Cart updated', 'success');
    } else {
      const added = addItem(item, selectedChoices, specialInstructions, quantity);
      if (added) {
        showToast(`Added to cart`, 'success');
      } else {
        showToast('Cart limit reached (50 items)', 'error');
      }
    }
    onClose();
  }

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  if (!item) return null;

  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: '#A0A0A0' }}
      backgroundStyle={{ backgroundColor: '#FFFFFF' }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: '100%', height: 200, borderRadius: 12 }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View className="h-[120px] w-full items-center justify-center rounded-xl bg-bg">
              <Text className="text-5xl">🍽️</Text>
            </View>
          )}

          <Text className="mt-3 text-2xl font-bold text-text-primary">
            {item.name}
          </Text>
          {item.description ? (
            <Text className="mt-1 text-base text-text-secondary">
              {item.description}
            </Text>
          ) : null}
          <Text className="mt-1 text-lg font-semibold text-brand-primary">
            {formatPrice(item.price)}
            {item.unit ? ` / ${item.unit}` : ''}
          </Text>

          {item.optionGroups?.map((group) => {
            if (group.type === 'single_select') {
              const selected = selectedChoices.find((c) => c.groupId === group.id);
              return (
                <View key={group.id} className="mt-4">
                  <RadioGroup
                    label={group.name}
                    required={group.required}
                    choices={group.choices.map((c) => ({
                      id: c.id,
                      label: c.label,
                      priceModifier: c.priceModifier,
                    }))}
                    selectedId={selected?.choiceId ?? null}
                    onChange={(choiceId) => {
                      const choice = group.choices.find((c) => c.id === choiceId);
                      handleRadioChange(group.id, choiceId, choice?.priceModifier ?? 0);
                    }}
                  />
                </View>
              );
            }

            if (group.type === 'optional_toggle') {
              const yesChoice = group.choices.find((c) => c.id === 'yes');
              if (!yesChoice) return null;
              const isSelected = selectedChoices.some(
                (c) => c.groupId === group.id && c.choiceId === 'yes',
              );
              return (
                <View key={group.id} className="mt-4">
                  <ToggleOption
                    label={group.name}
                    priceModifier={yesChoice.priceModifier}
                    selected={isSelected}
                    onChange={(sel) =>
                      handleToggleChange(
                        group.id,
                        'yes',
                        yesChoice.priceModifier ?? 0,
                        sel,
                      )
                    }
                  />
                </View>
              );
            }

            return null;
          })}

          <View className="mt-4">
            <Input
              label="Special Instructions"
              placeholder="Example: No pepper / sugar / salt please."
              multiline
              maxLength={500}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
            />
          </View>

          <View className="mb-4 mt-4 items-center">
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </View>

          <View className="h-[100px]" />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 border-t border-border-light bg-surface px-4 pb-8 pt-3 dark:border-border-dark dark:bg-surface-dark">
          <Button
            title={`${isEditing ? 'Update Cart' : 'Add to Cart'} — ${total.formatted}`}
            onPress={handleAddToCart}
            disabled={!allRequiredSelected}
          />
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}
