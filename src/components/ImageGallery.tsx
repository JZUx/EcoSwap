// ─────────────────────────────────────────────
// components/ImageGallery.tsx
// Carrusel de SOLO LECTURA para mostrar las fotos
// completas de un producto. A diferencia de
// ImageCarouselPicker, aquí no se pueden agregar
// ni quitar imágenes — solo deslizar para verlas.
// ─────────────────────────────────────────────

import React, { useState } from "react";
import { View, Image, FlatList, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useTheme } from "../context/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);

  // Detecta en qué foto quedó el usuario después de deslizar
  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setIndex(newIndex);
  };

  // Si el producto no tiene fotos, mostramos un placeholder simple
  if (images.length === 0) {
    return (
      <View style={[styles.placeholder, { backgroundColor: colors.background }]}>
        <Image
          source={{ uri: "https://placehold.co/600x400?text=Sin+foto" }}
          style={styles.placeholderImg}
        />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={images}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        )}
      />

      {/* Indicador de puntos, solo si hay más de 1 foto */}
      {images.length > 1 && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: SCREEN_WIDTH,
    height: 320,
  },
  placeholder: {
    width: SCREEN_WIDTH,
    height: 320,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImg: {
    width: "60%",
    height: "60%",
    opacity: 0.4,
  },
  dots: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: { width: 7, height: 7, borderRadius: 3.5, marginHorizontal: 3 },
});

export default ImageGallery;