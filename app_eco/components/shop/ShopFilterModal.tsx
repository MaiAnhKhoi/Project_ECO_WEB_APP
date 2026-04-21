import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";
import type { FilterBrand, FilterCategory, FilterColor, FilterResponse, FilterSize, ShopFilters, SortOption, AvailabilityFilter } from "@/types/filter";
import { resolveColorHexFlexible } from "@/utils/color";

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ title, expanded, onToggle }: { title: string; expanded: boolean; onToggle: () => void }) {
  const colors = useAppColors();
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center justify-between py-3.5 active:opacity-80"
    >
      <Text className="text-[15px] font-bold" style={{ color: colors.text }}>
        {title}
      </Text>
      <AppIcon name={expanded ? "chevron-up" : "chevron-down"} size={18} color={colors.mutedText} />
    </Pressable>
  );
}

function Divider() {
  const colors = useAppColors();
  return <View style={{ height: 1, backgroundColor: colors.divider }} />;
}

function RadioRow({
  label,
  sub,
  selected,
  onPress,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useAppColors();
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-3 active:opacity-80"
    >
      <View className="flex-row items-center gap-2.5">
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: selected ? colors.tint : colors.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selected ? (
            <View
              style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.tint }}
            />
          ) : null}
        </View>
        <Text
          className="text-[15px]"
          style={{ color: selected ? colors.tint : colors.text, fontWeight: selected ? "600" : "400" }}
        >
          {label}
        </Text>
      </View>
      {sub ? (
        <Text className="text-[13px]" style={{ color: colors.mutedText }}>
          {sub}
        </Text>
      ) : null}
    </Pressable>
  );
}

function SizeChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const colors = useAppColors();
  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-80"
      style={{
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.tint : colors.border,
        backgroundColor: selected ? `${colors.tint}14` : colors.surfaceMuted,
      }}
    >
      <Text
        className="text-[13px] font-semibold"
        style={{ color: selected ? colors.tint : colors.text }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ColorSwatch({
  name,
  hex,
  cssClass,
  selected,
  onPress,
}: {
  name: string;
  hex?: string | null;
  cssClass?: string | null;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useAppColors();
  const resolvedHex = resolveColorHexFlexible({ hex, cssClass, fallbackName: name });
  const isLight = (() => {
    const raw = resolvedHex.replace("#", "");
    if (raw.length !== 6) return false;
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.8;
  })();

  return (
    <Pressable onPress={onPress} className="items-center active:opacity-80" style={{ width: 60 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: resolvedHex,
          borderWidth: selected ? 2.5 : isLight ? 1 : 0,
          borderColor: selected ? colors.tint : "rgba(0,0,0,0.15)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected ? <AppIcon name="check" size={16} color={isLight ? "#111" : "#fff"} /> : null}
      </View>
      <Text
        numberOfLines={1}
        className="mt-1 text-[11px]"
        style={{
          color: selected ? colors.tint : colors.mutedText,
          fontWeight: selected ? "700" : "400",
          maxWidth: 56,
          textAlign: "center",
        }}
      >
        {name}
      </Text>
    </Pressable>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  filters: FilterResponse | null;
  current: ShopFilters;
  onApply: (next: ShopFilters) => void;
  onClose: () => void;
};

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "default", label: "Mặc định" },
  { key: "priceAsc", label: "Giá tăng dần" },
  { key: "priceDesc", label: "Giá giảm dần" },
  { key: "nameAsc", label: "Tên A → Z" },
  { key: "nameDesc", label: "Tên Z → A" },
];

const AVAILABILITY_OPTIONS: { key: AvailabilityFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "inStock", label: "Còn hàng" },
  { key: "outOfStock", label: "Hết hàng" },
];

export function ShopFilterModal({ visible, filters, current, onApply, onClose }: Props) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();

  // Draft state (chỉ apply khi bấm "Áp dụng")
  const [draft, setDraft] = useState<ShopFilters>(current);
  const [minInput, setMinInput] = useState<string>(current.minPrice !== null ? String(current.minPrice) : "");
  const [maxInput, setMaxInput] = useState<string>(current.maxPrice !== null ? String(current.maxPrice) : "");

  // Expanded sections
  const [exp, setExp] = useState({
    sort: true,
    availability: true,
    price: true,
    color: true,
    size: true,
    brand: true,
    category: false,
  });

  const toggleExp = (key: keyof typeof exp) =>
    setExp((prev) => ({ ...prev, [key]: !prev[key] }));

  // Chỉ đồng bộ khi mở sheet (tránh `current` đổi reference mỗi render → ghi đè draft đang sửa)
  useEffect(() => {
    if (visible) {
      setDraft(current);
      setMinInput(current.minPrice !== null ? String(current.minPrice) : "");
      setMaxInput(current.maxPrice !== null ? String(current.maxPrice) : "");
    }
  }, [visible]);

  const patch = useCallback(<K extends keyof ShopFilters>(key: K, val: ShopFilters[K]) => {
    setDraft((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleApply = () => {
    const minRaw = minInput.trim() ? Number(minInput.replace(/\D/g, "")) : null;
    const maxRaw = maxInput.trim() ? Number(maxInput.replace(/\D/g, "")) : null;
    const minPrice = minRaw === null || Number.isNaN(minRaw) ? null : minRaw;
    const maxPrice = maxRaw === null || Number.isNaN(maxRaw) ? null : maxRaw;
    onApply({ ...draft, minPrice, maxPrice });
    onClose();
  };

  const handleReset = () => {
    const minP = filters?.price.min ?? null;
    const maxP = filters?.price.max ?? null;
    setDraft({
      sort: "default",
      availability: "all",
      minPrice: null,
      maxPrice: null,
      color: null,
      size: null,
      brandId: null,
      categorySlug: null,
    });
    setMinInput("");
    setMaxInput("");
  };

  const priceMin = filters?.price.min ?? 0;
  const priceMax = filters?.price.max ?? 0;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />

          <View
            style={[
              styles.sheet,
              {
                maxHeight: winH * 0.88,
                backgroundColor: colors.background,
                borderTopColor: colors.border,
                paddingBottom: Math.max(insets.bottom, 16),
              },
            ]}
          >
            {/* ── Handle ── */}
            <View className="mb-3 mt-2 items-center">
              <View
                className="h-1 w-10 rounded-full"
                style={{ backgroundColor: colors.border }}
              />
            </View>

            {/* ── Header ── */}
            <View className="mb-1 flex-row items-center justify-between px-4">
              <Text className="text-[18px] font-bold" style={{ color: colors.text }}>
                Lọc & sắp xếp
              </Text>
              <CustomIconButton onPress={onClose} accessibilityLabel="Đóng">
                <AppIcon name="x" size={22} color={colors.text} />
              </CustomIconButton>
            </View>

            {/* ── Body (scrollable) ── */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
            >
              {/* ── SẮP XẾP ── */}
              <SectionHeader title="Sắp xếp" expanded={exp.sort} onToggle={() => toggleExp("sort")} />
              {exp.sort ? (
                <View
                  className="mb-4 rounded-2xl px-3"
                  style={{ backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }}
                >
                  {SORT_OPTIONS.map((o, i) => (
                    <View key={o.key}>
                      <RadioRow
                        label={o.label}
                        selected={draft.sort === o.key}
                        onPress={() => patch("sort", o.key)}
                      />
                      {i < SORT_OPTIONS.length - 1 ? <Divider /> : null}
                    </View>
                  ))}
                </View>
              ) : null}

              <Divider />

              {/* ── TÌNH TRẠNG ── */}
              <SectionHeader
                title="Tình trạng"
                expanded={exp.availability}
                onToggle={() => toggleExp("availability")}
              />
              {exp.availability ? (
                <View
                  className="mb-4 rounded-2xl px-3"
                  style={{ backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }}
                >
                  {AVAILABILITY_OPTIONS.map((o, i) => {
                    const countVal =
                      o.key === "inStock"
                        ? filters?.availability.inStock
                        : o.key === "outOfStock"
                        ? filters?.availability.outOfStock
                        : undefined;
                    return (
                      <View key={o.key}>
                        <RadioRow
                          label={o.label}
                          sub={countVal !== undefined ? `(${countVal})` : undefined}
                          selected={draft.availability === o.key}
                          onPress={() => patch("availability", o.key)}
                        />
                        {i < AVAILABILITY_OPTIONS.length - 1 ? <Divider /> : null}
                      </View>
                    );
                  })}
                </View>
              ) : null}

              <Divider />

              {/* ── GIÁ ── */}
              <SectionHeader title="Khoảng giá" expanded={exp.price} onToggle={() => toggleExp("price")} />
              {exp.price ? (
                <View className="mb-4">
                  {priceMin > 0 || priceMax > 0 ? (
                    <Text className="mb-2 text-[12px]" style={{ color: colors.mutedText }}>
                      Khoảng cho phép: {priceMin.toLocaleString("vi-VN")}₫ – {priceMax.toLocaleString("vi-VN")}₫
                    </Text>
                  ) : null}
                  <View className="flex-row items-center gap-3">
                    <View
                      className="flex-1 flex-row items-center gap-1.5 rounded-2xl px-3"
                      style={{
                        height: 46,
                        backgroundColor: colors.surfaceMuted,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <Text className="text-[13px]" style={{ color: colors.mutedText }}>
                        Từ
                      </Text>
                      <TextInput
                        value={minInput}
                        onChangeText={setMinInput}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={colors.mutedText}
                        style={{ flex: 1, color: colors.text, fontSize: 14, paddingVertical: 0 }}
                      />
                    </View>
                    <Text className="text-[16px] font-light" style={{ color: colors.mutedText }}>
                      –
                    </Text>
                    <View
                      className="flex-1 flex-row items-center gap-1.5 rounded-2xl px-3"
                      style={{
                        height: 46,
                        backgroundColor: colors.surfaceMuted,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <Text className="text-[13px]" style={{ color: colors.mutedText }}>
                        Đến
                      </Text>
                      <TextInput
                        value={maxInput}
                        onChangeText={setMaxInput}
                        keyboardType="numeric"
                        placeholder="∞"
                        placeholderTextColor={colors.mutedText}
                        style={{ flex: 1, color: colors.text, fontSize: 14, paddingVertical: 0 }}
                      />
                    </View>
                  </View>
                </View>
              ) : null}

              <Divider />

              {/* ── MÀU SẮC ── */}
              {filters && filters.colors.length > 0 ? (
                <>
                  <SectionHeader title="Màu sắc" expanded={exp.color} onToggle={() => toggleExp("color")} />
                  {exp.color ? (
                    <View className="mb-4">
                      <View className="flex-row flex-wrap gap-3">
                        {filters.colors.map((c) => (
                          <ColorSwatch
                            key={c.id}
                            name={c.name}
                            hex={c.hex}
                            cssClass={c.cssClass}
                            selected={draft.color === c.name}
                            onPress={() => patch("color", draft.color === c.name ? null : c.name)}
                          />
                        ))}
                      </View>
                    </View>
                  ) : null}
                  <Divider />
                </>
              ) : null}

              {/* ── KÍCH THƯỚC ── */}
              {filters && filters.sizes.length > 0 ? (
                <>
                  <SectionHeader title="Kích thước" expanded={exp.size} onToggle={() => toggleExp("size")} />
                  {exp.size ? (
                    <View className="mb-4">
                      <View className="flex-row flex-wrap gap-2">
                        {filters.sizes.map((s) => (
                          <SizeChip
                            key={s.size}
                            label={`${s.size} (${s.count})`}
                            selected={draft.size === s.size}
                            onPress={() => patch("size", draft.size === s.size ? null : s.size)}
                          />
                        ))}
                      </View>
                    </View>
                  ) : null}
                  <Divider />
                </>
              ) : null}

              {/* ── THƯƠNG HIỆU ── */}
              {filters && filters.brands.length > 0 ? (
                <>
                  <SectionHeader title="Thương hiệu" expanded={exp.brand} onToggle={() => toggleExp("brand")} />
                  {exp.brand ? (
                    <View
                      className="mb-4 rounded-2xl px-3"
                      style={{ backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }}
                    >
                      {filters.brands.map((b, i) => (
                        <View key={b.id}>
                          <RadioRow
                            label={b.name}
                            sub={`(${b.count})`}
                            selected={draft.brandId === b.id}
                            onPress={() => patch("brandId", draft.brandId === b.id ? null : b.id)}
                          />
                          {i < filters.brands.length - 1 ? <Divider /> : null}
                        </View>
                      ))}
                    </View>
                  ) : null}
                  <Divider />
                </>
              ) : null}

              {/* ── DANH MỤC ── */}
              {filters && filters.categories.length > 0 ? (
                <>
                  <SectionHeader
                    title="Danh mục"
                    expanded={exp.category}
                    onToggle={() => toggleExp("category")}
                  />
                  {exp.category ? (
                    <View
                      className="mb-4 rounded-2xl px-3"
                      style={{ backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }}
                    >
                      {filters.categories.map((cat, i) => (
                        <View key={cat.id}>
                          <RadioRow
                            label={cat.name}
                            sub={`(${cat.count})`}
                            selected={draft.categorySlug === cat.slug}
                            onPress={() =>
                              patch("categorySlug", draft.categorySlug === cat.slug ? null : cat.slug)
                            }
                          />
                          {i < filters.categories.length - 1 ? <Divider /> : null}
                        </View>
                      ))}
                    </View>
                  ) : null}
                </>
              ) : null}
            </ScrollView>

            {/* ── Footer buttons ── */}
            <View className="flex-row gap-3 px-4 pt-3">
              <View className="flex-1">
                <CustomButton
                  title="Đặt lại"
                  variant="secondary"
                  onPress={handleReset}
                  style={{ paddingVertical: 14, borderRadius: 14 }}
                />
              </View>
              <View className="flex-1">
                <CustomButton
                  title="Áp dụng"
                  onPress={handleApply}
                  style={{ paddingVertical: 14, borderRadius: 14 }}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    borderTopWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
});
