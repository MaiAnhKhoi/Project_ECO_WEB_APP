import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useCallback, useMemo } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import "@/global.css";
import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ProductCardTile } from "@/components/product/ProductCardTile";
import { useAppColors } from "@/hooks/use-app-colors";
import { useStyleAnalysis } from "@/hooks/useStyleAnalysis";
import { AI_QUERY_KEYS } from "@/queries/aiQueries";
import { fetchAIStyleHistoryDetail } from "@/services/aiApi";
import type { StyleAnalysisResponse } from "@/types/ai";
import { navLockRun } from "@/utils/navLock";

// -----------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

// -----------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------

function SkeletonBlock({
  height,
  borderRadius = 12,
  marginBottom = 0,
  colors,
}: {
  height: number;
  borderRadius?: number;
  marginBottom?: number;
  colors: ReturnType<typeof useAppColors>;
}) {
  return (
    <View
      style={{
        height,
        borderRadius,
        marginBottom,
        backgroundColor: colors.surfaceMuted,
      }}
    />
  );
}

function StyleTagRow({
  label,
  value,
  icon,
  colors,
}: {
  label: string;
  value: string;
  icon: string;
  colors: ReturnType<typeof useAppColors>;
}) {
  return (
    <View
      style={[
        styles.tagCard,
        { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
      ]}
    >
      <Text style={styles.tagIcon}>{icon}</Text>
      <View style={styles.tagText}>
        <Text style={[styles.tagLabel, { color: colors.mutedText }]}>
          {label}
        </Text>
        <Text style={[styles.tagValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

function ConfidenceBar({
  value,
  colors,
}: {
  value: number;
  colors: ReturnType<typeof useAppColors>;
}) {
  const pct = Math.round(value * 100);
  return (
    <View style={styles.confidenceWrap}>
      <View style={styles.confidenceHeader}>
        <Text style={[styles.confidenceLabel, { color: colors.mutedText }]}>
          Độ chính xác
        </Text>
        <Text style={[styles.confidenceValue, { color: colors.text }]}>
          {pct}%
        </Text>
      </View>
      <View style={[styles.confidenceBar, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.confidenceFill,
            { backgroundColor: colors.tint, width: `${pct}%` as any },
          ]}
        />
      </View>
    </View>
  );
}

// -----------------------------------------------------------------------
// Main screen
// -----------------------------------------------------------------------

export default function AIStyleAnalysisScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const params = useLocalSearchParams<{ historyId?: string }>();
  const historyIdNum = useMemo(() => {
    const n = params.historyId ? Number(params.historyId) : NaN;
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [params.historyId]);

  const [imageUri, setImageUri] = useState<string | null>(null);

  const { mutate: analyze, data, isPending, error, isSuccess, reset } =
    useStyleAnalysis();

  const historyQ = useQuery({
    queryKey:
      historyIdNum != null
        ? AI_QUERY_KEYS.styleHistoryDetail(historyIdNum)
        : ["ai-style-history-detail", "idle"],
    queryFn: () => fetchAIStyleHistoryDetail(historyIdNum!),
    enabled: historyIdNum != null,
  });

  const historyAsResult: StyleAnalysisResponse | null = useMemo(() => {
    if (!historyQ.data) return null;
    const row = historyQ.data;
    const c = row.confidenceScore;
    return {
      gender: row.gender ?? "UNKNOWN",
      bodyType: row.bodyType,
      skinTone: row.skinTone,
      recommendedStyle: row.recommendedStyle,
      confidenceScore: typeof c === "number" ? c : 0,
      analyzedImageUrl: row.imageUrl ?? "",
      needsGenderConfirmation: Boolean(row.needsGenderConfirmation),
      products: row.products ?? [],
      fromCache: false,
    };
  }, [historyQ.data]);

  const effectiveData: StyleAnalysisResponse | null =
    isSuccess && data ? data : historyAsResult;

  const previewUri = imageUri ?? historyAsResult?.analyzedImageUrl ?? null;

  const clearHistoryRoute = useCallback(() => {
    if (historyIdNum != null) {
      router.replace("/ai-style-analysis" as any);
    }
  }, [router, historyIdNum]);

  const pickImage = useCallback(async (source: "camera" | "gallery") => {
    const perm =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!perm.granted) {
      Alert.alert(
        "Cần cấp quyền",
        source === "camera"
          ? "Vui lòng cho phép truy cập camera."
          : "Vui lòng cho phép truy cập thư viện ảnh.",
      );
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.9,
            allowsEditing: true,
            aspect: [3, 4],
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.9,
            allowsEditing: true,
            aspect: [3, 4],
          });

    if (result.canceled) return;

    const asset = result.assets[0];

    // Nén ảnh nếu > 5MB để giảm upload time
    let finalUri = asset.uri;
    if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE_BYTES) {
      try {
        const compressed = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 1024 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        finalUri = compressed.uri;
      } catch {
        // Fallback: dùng ảnh gốc
      }
    }

    setImageUri(finalUri);
    reset();
    clearHistoryRoute();
  }, [reset, clearHistoryRoute]);

  const handlePickSource = useCallback(() => {
    Alert.alert("Chọn ảnh", "Bạn muốn chụp ảnh hay chọn từ thư viện?", [
      {
        text: "Chụp ảnh",
        onPress: () => navLockRun(() => pickImage("camera")),
      },
      {
        text: "Thư viện ảnh",
        onPress: () => navLockRun(() => pickImage("gallery")),
      },
      { text: "Huỷ", style: "cancel" },
    ]);
  }, [pickImage]);

  const handleAnalyze = useCallback(() => {
    if (!imageUri || isPending) return;
    analyze(imageUri);
  }, [imageUri, isPending, analyze]);

  const handleReset = useCallback(() => {
    setImageUri(null);
    reset();
    clearHistoryRoute();
  }, [reset, clearHistoryRoute]);

  const errorMessage =
    error ? ((error as Error).message || "Không thể phân tích ảnh") : null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.divider,
            backgroundColor: colors.background,
          },
        ]}
      >
        <CustomIconButton
          onPress={() => navLockRun(() => router.back())}
          accessibilityLabel="Quay lại"
        >
          <AppIcon name="chevron-left" size={22} color={colors.text} />
        </CustomIconButton>

        <View style={styles.headerCenter}>
          <Text style={[styles.breadcrumb, { color: colors.mutedText }]}>
            Trang chủ
          </Text>
          <AppIcon name="chevron-right" size={12} color={colors.mutedText} />
            <Text style={[styles.breadcrumbActive, { color: colors.text }]}>
              Phân tích phong cách
            </Text>
        </View>

        <CustomIconButton
          onPress={() => navLockRun(() => router.push("/(tabs)" as any))}
          accessibilityLabel="Về trang chủ"
        >
          <AppIcon name="home" size={20} color={colors.mutedText} />
        </CustomIconButton>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero section */}
        <View style={[styles.hero, { backgroundColor: colors.background }]}>
          <View style={[styles.heroBadge, { backgroundColor: colors.tint }]}>
            <AppIcon name="camera" size={14} color="#fff" />
            <Text style={styles.heroBadgeText}>Phân tích phong cách</Text>
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Khám phá phong cách{"\n"}phù hợp với bạn
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedText }]}>
            Upload ảnh — AI phân tích vóc dáng, tông da và gợi ý sản phẩm phù hợp
          </Text>
        </View>

        {/* Upload / Preview area */}
        <View style={styles.uploadSection}>
          {!previewUri ? (
            /* Drop zone — press to pick */
            <Pressable
              onPress={handlePickSource}
              style={[
                styles.dropzone,
                {
                  backgroundColor: colors.surfaceMuted,
                  borderColor: colors.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Chọn ảnh để phân tích"
              className="active:opacity-70"
            >
              <View
                style={[
                  styles.dropzoneIcon,
                  { backgroundColor: colors.iconButtonBg },
                ]}
              >
                <AppIcon name="image" size={32} color={colors.mutedText} />
              </View>
              <Text style={[styles.dropzoneTitle, { color: colors.text }]}>
                Chọn ảnh để phân tích
              </Text>
              <Text style={[styles.dropzoneSub, { color: colors.mutedText }]}>
                Chụp ảnh hoặc chọn từ thư viện · JPEG, PNG
              </Text>

              {/* Feature highlights */}
              <View style={styles.featureList}>
                {[
                  { icon: "👤", text: "Phân tích vóc dáng" },
                  { icon: "🎨", text: "Nhận diện tông da" },
                  { icon: "✨", text: "Gợi ý phong cách cá nhân" },
                ].map(({ icon, text }) => (
                  <View key={text} style={styles.featureItem}>
                    <Text>{icon}</Text>
                    <Text
                      style={[styles.featureText, { color: colors.mutedText }]}
                    >
                      {text}
                    </Text>
                  </View>
                ))}
              </View>
            </Pressable>
          ) : (
            /* Preview */
            <View style={styles.previewWrap}>
              <Image
                source={{ uri: previewUri }}
                style={styles.previewImg}
                contentFit="cover"
                transition={200}
              />
              <Pressable
                onPress={handlePickSource}
                style={[
                  styles.changeBtn,
                  { backgroundColor: "rgba(0,0,0,0.55)" },
                ]}
                accessibilityLabel="Đổi ảnh"
                className="active:opacity-70"
              >
                <AppIcon name="camera" size={16} color="#fff" />
                <Text style={styles.changeBtnText}>Đổi ảnh</Text>
              </Pressable>
            </View>
          )}
        </View>

        {historyIdNum && historyQ.isPending && !effectiveData ? (
          <View style={styles.section}>
            <LoadingSpinner
              visible
              fullscreen={false}
              message="Đang tải kết quả từ lịch sử…"
            />
          </View>
        ) : null}

        {historyIdNum && historyQ.isError ? (
          <View style={styles.section}>
            <Text style={{ color: colors.mutedText, textAlign: "center" }}>
              Không tải được lịch sử phân tích.
            </Text>
          </View>
        ) : null}

        {/* Action buttons */}
        {imageUri && !isSuccess && (
          <View style={styles.actionsRow}>
            <CustomButton
              title="Phân tích phong cách"
              onPress={handleAnalyze}
              loading={isPending}
              disabled={isPending}
              leftIcon={
                !isPending ? (
                  <AppIcon name="zap" size={16} color="#fff" />
                ) : undefined
              }
              style={styles.analyzeBtn as any}
            />
            <CustomButton
              title="Chọn ảnh mới"
              variant="secondary"
              onPress={handleReset}
              style={styles.resetBtn as any}
            />
          </View>
        )}

        {/* Loading skeletons */}
        {isPending && (
          <View style={styles.section}>
            <LoadingSpinner
              visible
              fullscreen={false}
              message="AI đang phân tích phong cách của bạn…"
            />
            <View style={styles.skeletonBlock}>
              <SkeletonBlock height={24} borderRadius={6} marginBottom={16} colors={colors} />
              <View style={styles.skeletonTagRow}>
                {[1, 2, 3].map((k) => (
                  <SkeletonBlock key={k} height={72} borderRadius={12} colors={colors} />
                ))}
              </View>
              <SkeletonBlock height={8} borderRadius={999} marginBottom={24} colors={colors} />
              <View style={styles.skeletonProductRow}>
                {[1, 2].map((k) => (
                  <SkeletonBlock key={k} height={220} borderRadius={14} colors={colors} />
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Error state */}
        {errorMessage && !isPending && (
          <View
            style={[
              styles.errorBox,
              {
                backgroundColor: "#fef2f2",
                borderColor: "#fecaca",
              },
            ]}
          >
            <AppIcon name="alert-circle" size={24} color="#dc2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <CustomButton
              title="Thử lại"
              onPress={handleAnalyze}
              style={styles.retryBtn as any}
            />
          </View>
        )}

        {/* Analysis Result */}
        {effectiveData && !isPending && (
          <StyleResult
            data={effectiveData}
            colors={colors}
            onReset={handleReset}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// -----------------------------------------------------------------------
// StyleResult — kết quả phân tích
// -----------------------------------------------------------------------

function StyleResult({
  data,
  colors,
  onReset,
}: {
  data: StyleAnalysisResponse;
  colors: ReturnType<typeof useAppColors>;
  onReset: () => void;
}) {
  const router = useRouter();

  return (
    <View style={styles.section}>
      {/* Result header */}
      <View style={styles.resultHeader}>
        <Text style={[styles.resultTitle, { color: colors.text }]}>
          Kết quả phân tích
        </Text>
        {data.fromCache && (
          <View
            style={[styles.cacheBadge, { backgroundColor: "#ecfdf5", borderColor: "#a7f3d0" }]}
          >
            <Text style={[styles.cacheBadgeText, { color: "#059669" }]}>
              Từ bộ nhớ đệm
            </Text>
          </View>
        )}
      </View>

      {/* Gender confirmation notice */}
      {data.needsGenderConfirmation && (
        <View style={styles.genderNotice}>
          <Text style={styles.genderNoticeText}>
            ⚠️ AI chưa xác định rõ giới tính. Gợi ý sản phẩm có thể chưa chính xác. Thử lại với ảnh rõ nét hơn.
          </Text>
        </View>
      )}

      {/* Style tags */}
      <View style={styles.tagRow}>
        {data.gender && data.gender !== "UNKNOWN" && (
          <StyleTagRow
            label="Giới tính"
            value={data.gender === "MALE" ? "Nam" : data.gender === "FEMALE" ? "Nữ" : "Unisex"}
            icon="🧑"
            colors={colors}
          />
        )}
        <StyleTagRow label="Vóc dáng" value={data.bodyType} icon="👤" colors={colors} />
        <StyleTagRow label="Tông da" value={data.skinTone} icon="🎨" colors={colors} />
        <StyleTagRow label="Phong cách" value={data.recommendedStyle} icon="✨" colors={colors} />
      </View>

      {/* Confidence bar */}
      <ConfidenceBar value={data.confidenceScore ?? 0} colors={colors} />

      {/* Product recommendations */}
      {data.products && data.products.length > 0 && (
        <View style={styles.productsSection}>
          <Text style={[styles.productsTitle, { color: colors.text }]}>
            Sản phẩm phù hợp
            {data.gender === "MALE" ? " (Nam)" : data.gender === "FEMALE" ? " (Nữ)" : ""}
          </Text>
          <View style={styles.productsGrid}>
            {data.products.map((product) => (
              <View key={product.id} style={styles.productCardWrap}>
                <ProductCardTile
                  product={{
                    id: product.id,
                    title: product.name,
                    imgSrc: product.imageUrl ?? "",
                    price: product.price,
                    oldPrice: product.originalPrice ?? undefined,
                    slug: product.slug,
                  } as any}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.resultActions}>
        <CustomButton
          title="Phân tích ảnh mới"
          onPress={onReset}
          leftIcon={<AppIcon name="camera" size={16} color="#fff" />}
        />
        <CustomButton
          title="Tạo outfit với AI"
          variant="secondary"
          onPress={() => navLockRun(() => router.push("/ai-stylist" as any))}
          style={{ marginTop: 10 } as any}
        />
      </View>
    </View>
  );
}

// -----------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  breadcrumb: {
    fontSize: 13,
  },
  breadcrumbActive: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Hero
  hero: {
    padding: 20,
    paddingBottom: 8,
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 30,
  },
  heroSub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  // Upload
  uploadSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  dropzone: {
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  dropzoneIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  dropzoneTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  dropzoneSub: {
    fontSize: 13,
    textAlign: "center",
  },
  featureList: {
    marginTop: 16,
    gap: 8,
    alignSelf: "stretch",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 8,
  },
  featureText: {
    fontSize: 13,
  },

  previewWrap: {
    borderRadius: 20,
    overflow: "hidden",
    aspectRatio: 3 / 4,
    position: "relative",
  },
  previewImg: {
    width: "100%",
    height: "100%",
  },
  changeBtn: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  changeBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },

  // Actions
  actionsRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  analyzeBtn: {
    borderRadius: 16,
    paddingVertical: 14,
  },
  resetBtn: {
    paddingVertical: 12,
  },

  // Skeletons
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  skeletonBlock: {
    gap: 12,
    marginTop: 16,
  },
  skeletonTagRow: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  skeletonProductRow: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },

  // Error
  errorBox: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#dc2626",
    textAlign: "center",
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },

  // Result
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  cacheBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  cacheBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  tagRow: {
    gap: 10,
    marginBottom: 16,
  },
  tagCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagIcon: {
    fontSize: 22,
  },
  tagText: {
    flex: 1,
  },
  tagLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "500",
  },
  tagValue: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },

  confidenceWrap: {
    marginBottom: 24,
  },
  confidenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  confidenceLabel: {
    fontSize: 13,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  confidenceBar: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  confidenceFill: {
    height: "100%",
    borderRadius: 999,
  },

  productsSection: {
    marginBottom: 24,
  },
  productsTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  productCardWrap: {
    width: "48%",
  },

  resultActions: {
    gap: 0,
    marginTop: 8,
  },

  genderNotice: {
    padding: 12,
    backgroundColor: "#fffbeb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fcd34d",
    marginBottom: 12,
  },
  genderNoticeText: {
    fontSize: 13,
    color: "#92400e",
    lineHeight: 18,
  },
});
