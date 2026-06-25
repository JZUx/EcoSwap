// ─────────────────────────────────────────────
// screens/main/CreateProductScreen.tsx
// Pantalla para PUBLICAR o EDITAR un producto.
// Si llega "articleId" por params, entra en modo edición:
// precarga los datos existentes y usa updateArticle.
// Si no llega nada, es modo creación normal (createArticle).
// ─────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CategoryDropdown from "../../components/CategoryDropdown";
import ImageCarouselPicker from "../../components/ImageCarouselPicker";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createArticle, updateArticle } from "../../store/articlesSlice";
import { CATEGORIES } from "../../utils/categories";
import { isNotEmpty } from "../../utils/validators";
import { supabase } from "../../lib/supabase";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type CreateProductRouteProp = RouteProp<RootStackParamList, "CreateProduct">;

const CreateProductScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute<CreateProductRouteProp>();

  // Si viene articleId, estamos editando un producto existente
  const articleId = route.params?.articleId;
  const isEditMode = !!articleId;

  // Buscamos el artículo en Redux solo si estamos editando
  const existingArticle = useAppSelector((state) =>
    isEditMode ? state.articles.items.find((item) => item.id === articleId) : undefined
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [titleError, setTitleError] = useState("");
  const [publishing, setPublishing] = useState(false);

  // Precargamos los datos existentes cuando entramos en modo edición
  useEffect(() => {
    if (existingArticle) {
      setTitle(existingArticle.title);
      setDescription(existingArticle.description ?? "");
      setCategory(existingArticle.category ?? "");
      setImages(existingArticle.images?.length ? existingArticle.images : []);
    }
  }, [existingArticle]);

  // Sube una imagen NUEVA (uri local) al bucket. Si la imagen ya es una URL
  // (https://...), significa que ya estaba subida desde antes (modo edición)
  // y la devolvemos tal cual, sin volver a subirla.
  const uploadImage = async (uri: string, index: number): Promise<string> => {
    if (uri.startsWith("http")) return uri;

    const fileExt = uri.split(".").pop() || "jpg";
    const fileName = `${user!.id}/${Date.now()}_${index}.${fileExt}`;

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: fileName,
      type: `image/${fileExt}`,
    } as any);

    const { error } = await supabase.storage
      .from("articles-images")
      .upload(fileName, formData);

    if (error) throw error;

    const { data } = supabase.storage.from("articles-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handlePublish = async () => {
    setTitleError("");

    if (!isNotEmpty(title)) {
      setTitleError("El título es obligatorio");
      return;
    }
    if (!user) return;

    setPublishing(true);
    try {
      // Subimos solo las imágenes nuevas; las que ya eran URL se reusan
      const uploadedUrls = await Promise.all(
        images.map((uri, i) => uploadImage(uri, i))
      );

      const result = isEditMode
        ? await dispatch(
            updateArticle({
              id: articleId!,
              title: title.trim(),
              description: description.trim(),
              category: category || "General",
              images: uploadedUrls,
            })
          )
        : await dispatch(
            createArticle({
              title: title.trim(),
              description: description.trim(),
              category: category || "General",
              user_id: user.id,
              images: uploadedUrls,
            })
          );

      const rejected = isEditMode
        ? updateArticle.rejected.match(result)
        : createArticle.rejected.match(result);

      if (rejected) {
        Alert.alert("No se pudo guardar", String((result as any).payload));
        return;
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error al subir imágenes", err.message ?? "Intenta de nuevo");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.primary }]}>‹ Dashboard</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>
          {isEditMode ? "Editar producto" : "Nuevo producto"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageCarouselPicker images={images} onChange={setImages} />

        <CustomInput
          label="Título"
          value={title}
          onChangeText={setTitle}
          placeholder="Ej. Bicicleta usada"
          errorMessage={titleError}
        />

        <CategoryDropdown
          label="Categoría"
          selected={category}
          options={CATEGORIES}
          onSelect={setCategory}
        />

        <CustomInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          placeholder="Cuéntanos del artículo"
        />

        <CustomButton
          title={isEditMode ? "Guardar cambios" : "Publicar"}
          onPress={handlePublish}
          loading={publishing}
        />
        <CustomButton title="Cancelar" variant="outline" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: { marginRight: 12 },
  backText: { fontSize: 16, fontWeight: "600" },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  content: { padding: 20, paddingBottom: 60 },
});

export default CreateProductScreen;