// ─────────────────────────────────────────────
// components/ImageCarouselPicker.tsx
// Permite seleccionar hasta 5 imágenes de la galería
// y navegarlas con flechas "siguiente / anterior"
// antes de publicar el producto.
// ─────────────────────────────────────────────

import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../context/ThemeContext";

const MAX_IMAGES = 5;

interface ImageCarouselPickerProps {
  images: string[]; // URIs locales seleccionadas
  onChange: (images: string[]) => void;
}

const ImageCarouselPicker: React.FC<ImageCarouselPickerProps> = ({ images, onChange }) => {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);

  // Abre la galería y agrega la imagen elegida (si no se llegó al máximo)
  const handleAddImage = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert("Límite alcanzado", `Puedes subir un máximo de ${MAX_IMAGES} fotos.`);
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso necesario", "Necesitamos acceso a tus fotos para continuar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    // Nota: si tu versión de expo-image-picker marca "MediaTypeOptions" como
    // deprecado, reemplázalo por: mediaTypes: ['images']

    if (!result.canceled && result.assets?.length) {
      const newImages = [...images, result.assets[0].uri];
      onChange(newImages);
      setIndex(newImages.length - 1); // Mostrar la recién agregada
    }
  };

  // Quita la imagen actual del arreglo
  const handleRemoveCurrent = () => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
    setIndex((prev) => Math.max(0, Math.min(prev, updated.length - 1)));
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(images.length - 1, i + 1));

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Fotos del producto ({images.length}/{MAX_IMAGES})
      </Text>

      {images.length > 0 ? (
        <View style={[styles.carousel, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Image source={{ uri: images[index] }} style={styles.image} resizeMode="cover" />

          {/* Botón eliminar foto actual */}
          <TouchableOpacity style={styles.removeBtn} onPress={handleRemoveCurrent}>
            <Text style={styles.removeBtnText}>✕</Text>
          </TouchableOpacity>

          {/* Flecha anterior */}
          {index > 0 && (
            <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={goPrev}>
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
          )}

          {/* Flecha siguiente */}
          {index < images.length - 1 && (
            <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={goNext}>
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          )}

          {/* Indicador de puntos */}
          <View style={styles.dots}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === index ? colors.primary : "rgba(255,255,255,0.6)" },
                ]}
              />
            ))}
          </View>
        </View>
      ) : (
        <View style={[styles.placeholder, { borderColor: colors.border }]}>
          <Text style={{ color: colors.textSecondary }}>Sin fotos todavía</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.addBtn, { borderColor: colors.primary }]}
        onPress={handleAddImage}
        disabled={images.length >= MAX_IMAGES}
      >
        <Text style={{ color: colors.primary, fontWeight: "600" }}>
          {images.length >= MAX_IMAGES ? "Máximo alcanzado" : "+ Agregar foto"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  carousel: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%" },
  placeholder: {
    height: 140,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  removeBtnText: { color: "#fff", fontWeight: "700" },
  arrow: {
    position: "absolute",
    top: "40%",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowLeft: { left: 8 },
  arrowRight: { right: 8 },
  arrowText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  dots: {
    position: "absolute",
    bottom: 8,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 3 },
  addBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
});

export default ImageCarouselPicker;