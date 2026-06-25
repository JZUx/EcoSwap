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
//
// El botón "+" ahora navega a una pantalla modal dedicada
// (CreateProductScreen) en vez de abrir un <Modal> aquí mismo.
// ─────────────────────────────────────────────

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EcoCard from "../../components/EcoCard";
import { useTheme } from "../../context/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchArticles } from "../../store/articlesSlice";
import type { RootStackParamList } from "../../navigation/AppNavigator";

const HomeScreen: React.FC = () => {
  // Colores según el tema activo (claro u oscuro)
  const { colors } = useTheme();

  // Estado global de artículos (Redux)
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.articles);

  // Navegación: HomeScreen vive dentro de MainTabs, que a su vez vive
  // dentro del Stack raíz. Por eso usamos getParent() para navegar
  // a una pantalla que está al mismo nivel que MainTabs (CreateProduct).
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Al entrar a la pantalla, pedimos los artículos a Supabase
  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  // Pull-to-refresh: vuelve a pedir los artículos
  const handleRefresh = () => {
    dispatch(fetchArticles());
  };

  // Navega a la pantalla modal para publicar un nuevo producto
  const goToCreateProduct = () => {
    navigation.getParent()?.navigate("CreateProduct");
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
            onPress={() => navigation.getParent()?.navigate("ProductDetail", { articleId: item.id })}
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
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Botón flotante para ir a la pantalla de publicar un nuevo artículo */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={goToCreateProduct}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    paddingBottom: 100,
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
});

export default HomeScreen;