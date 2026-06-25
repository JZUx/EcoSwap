// ─────────────────────────────────────────────
// screens/main/HomeScreen.tsx
// Pantalla principal con el feed de artículos
// disponibles para intercambio.
//
// El contenido (artículos) viene de Redux, que a su vez
// los trae de Supabase. Esto demuestra:
// - Estado global con Redux Toolkit (items, loading, error)
// - Conexión real a Supabase (lectura y escritura)
// - Contexto global de tema (colores claro/oscuro)
// ─────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import EcoCard from "../../components/EcoCard";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchArticles, createArticle } from "../../store/articlesSlice";
import { isNotEmpty } from "../../utils/validators";

const HomeScreen: React.FC = () => {
  // Colores según el tema activo (claro u oscuro)
  const { colors } = useTheme();

  // Usuario actual (necesitamos su id para publicar artículos)
  const { user } = useAuth();

  // Estado global de artículos (Redux)
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.articles);

  // Estado local: visibilidad del modal para publicar un artículo
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [titleError, setTitleError] = useState("");
  const [publishing, setPublishing] = useState(false);

  // Al entrar a la pantalla, pedimos los artículos a Supabase
  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  // Pull-to-refresh: vuelve a pedir los artículos
  const handleRefresh = () => {
    dispatch(fetchArticles());
  };

  // Publicar un nuevo artículo
  const handlePublish = async () => {
    setTitleError("");

    if (!isNotEmpty(title)) {
      setTitleError("El título es obligatorio");
      return;
    }
    if (!user) return;

    setPublishing(true);
    const result = await dispatch(
      createArticle({
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || "General",
        user_id: user.id,
      })
    );
    setPublishing(false);

    if (createArticle.rejected.match(result)) {
      Alert.alert("No se pudo publicar", String(result.payload));
      return;
    }

    // Limpiar formulario y cerrar modal
    setTitle("");
    setDescription("");
    setCategory("");
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Encabezado de la pantalla */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.greeting, { color: colors.primary }]}>Hola, bienvenido 👋</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Artículos disponibles cerca de ti
        </Text>
      </View>

      {/* Mensaje de error si Supabase falla (ej. sin internet) */}
      {error ? (
        <Text style={[styles.errorBanner, { color: colors.error }]}>
          No se pudieron cargar los artículos: {error}
        </Text>
      ) : null}

      {/* Lista de artículos usando FlatList para rendimiento óptimo */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EcoCard
            title={item.title}
            category={item.category ?? "General"}
            location="Cerca de ti"
            isAvailable={true}
            onPress={() => Alert.alert(item.title, item.description ?? "Sin descripción")}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Todavía no hay artículos publicados. ¡Sé el primero! 🌱
            </Text>
          ) : null
        }
        // Espacio al final de la lista para que no quede pegado
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Botón flotante para publicar un nuevo artículo */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal: formulario para publicar un artículo */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>
              Publicar artículo
            </Text>

            <CustomInput
              label="Título"
              value={title}
              onChangeText={setTitle}
              placeholder="Ej. Bicicleta usada"
              errorMessage={titleError}
            />
            <CustomInput
              label="Categoría"
              value={category}
              onChangeText={setCategory}
              placeholder="Ej. Deportes"
            />
            <CustomInput
              label="Descripción"
              value={description}
              onChangeText={setDescription}
              placeholder="Cuéntanos del artículo"
            />

            <CustomButton title="Publicar" onPress={handlePublish} loading={publishing} />
            <CustomButton
              title="Cancelar"
              variant="outline"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    // Sombra ligera en el encabezado
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  errorBanner: {
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 8,
  },
  list: {
    paddingVertical: 12,
    paddingBottom: 100, // Espacio extra para la tab bar y el FAB
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    paddingHorizontal: 32,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },
});

export default HomeScreen;
