// ─────────────────────────────────────────────
// screens/main/ProductDetailScreen.tsx
// Pantalla de detalle de un producto: muestra todas
// sus fotos en grande, junto con título, categoría
// y descripción completa.
//
// - Si el usuario actual es el DUEÑO (isOwner), se muestran
//   botones para Editar o Eliminar la publicación.
// - Si NO es el dueño, se muestra la información de contacto
//   (teléfono + ubicación) del dueño, leída desde "profiles".
// ─────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ImageGallery from "../../components/ImageGallery";
import CustomButton from "../../components/CustomButton";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteArticle } from "../../store/articlesSlice";
import { supabase } from "../../lib/supabase";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

// Forma mínima del perfil del dueño que necesitamos mostrar aquí
interface OwnerContact {
  phone: string | null;
  department: string | null;
  city: string | null;
}

const ProductDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ProductDetailRouteProp>();
  const { articleId } = route.params;

  // Usuario logueado actualmente (para saber si es el dueño)
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  // Buscamos el artículo actual en el estado global de Redux
  const article = useAppSelector((state) =>
    state.articles.items.find((item) => item.id === articleId)
  );

  // true solo si el producto le pertenece al usuario logueado
  const isOwner = user?.id === article?.user_id;

  // Información de contacto del DUEÑO del producto (no es "mi" perfil,
  // por eso se trae directo con un fetch local y no desde Redux)
  const [ownerContact, setOwnerContact] = useState<OwnerContact | null>(null);

  useEffect(() => {
    if (!article) return;

    supabase
      .from("profiles")
      .select("phone, department, city")
      .eq("id", article.user_id)
      .maybeSingle()
      .then(({ data }) => setOwnerContact(data));
  }, [article?.user_id]);

  // Navega a CreateProductScreen, pero en modo edición (le pasamos el articleId)
  const handleEdit = () => {
    navigation.navigate("CreateProduct", { articleId });
  };

  // Pide confirmación antes de borrar, y regresa al dashboard si se confirma
  const handleDelete = () => {
    Alert.alert(
      "Eliminar producto",
      "¿Seguro que quieres eliminar esta publicación? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await dispatch(deleteArticle(articleId));
            navigation.goBack();
          },
        },
      ]
    );
  };

  // Caso borde: si el artículo ya no existe (ej. fue borrado), evitamos un crash
  if (!article) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backText, { color: colors.primary }]}>‹ Dashboard</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 40 }}>
          Este producto ya no está disponible.
        </Text>
      </SafeAreaView>
    );
  }

  // ¿Hay algo que mostrar en la sección de contacto?
  const hasContactInfo = !!(ownerContact?.phone || ownerContact?.city || ownerContact?.department);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Encabezado con botón de regresar al dashboard */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.primary }]}>‹ Dashboard</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carrusel de fotos completas (usamos images, o image_url como respaldo) */}
        <ImageGallery
          images={
            article.images?.length
              ? article.images
              : article.image_url
              ? [article.image_url]
              : []
          }
        />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>
            <View style={[styles.badge, { backgroundColor: colors.primary + "22" }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>Disponible</Text>
            </View>
          </View>

          <Text style={[styles.category, { color: colors.textSecondary }]}>
            📦 {article.category ?? "General"}
          </Text>

          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Descripción</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {article.description || "Sin descripción disponible."}
          </Text>

          {/* Sección de contacto: solo si NO eres el dueño y hay info que mostrar */}
          {!isOwner && hasContactInfo && (
            <View style={[styles.contactBox, { borderColor: colors.border }]}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                Contactar al dueño
              </Text>
              {ownerContact?.phone && (
                <Text style={[styles.description, { color: colors.text }]}>
                  📞 {ownerContact.phone}
                </Text>
              )}
              {(ownerContact?.city || ownerContact?.department) && (
                <Text style={[styles.description, { color: colors.text }]}>
                  📍 {ownerContact?.city}
                  {ownerContact?.city && ownerContact?.department ? ", " : ""}
                  {ownerContact?.department}
                </Text>
              )}
            </View>
          )}

          {/* Botones de Editar / Eliminar — solo visibles si es tu propio producto */}
          {isOwner && (
            <View style={styles.ownerActions}>
              <CustomButton title="Editar" onPress={handleEdit} />
              <CustomButton title="Eliminar" variant="outline" onPress={handleDelete} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {},
  backText: { fontSize: 16, fontWeight: "600" },
  content: { padding: 20 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  title: { fontSize: 22, fontWeight: "800", flex: 1, marginRight: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: "700" },
  category: { fontSize: 14, marginBottom: 18 },
  sectionLabel: { fontSize: 13, fontWeight: "700", marginBottom: 6, textTransform: "uppercase" },
  description: { fontSize: 15, lineHeight: 22, marginBottom: 4 },
  contactBox: { marginTop: 20, padding: 14, borderWidth: 1, borderRadius: 12 },
  ownerActions: { marginTop: 24, gap: 10 },
});

export default ProductDetailScreen;