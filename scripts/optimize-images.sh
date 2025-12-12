#!/bin/bash

# Script para otimizar imagens PNG e JPG
# Reduz tamanho mantendo qualidade

IMAGES_DIR="assets/images"
QUALITY=85
RESIZE_WIDTH=1920

echo "🖼️  Iniciando otimização de imagens..."
echo "Pasta: $IMAGES_DIR"
echo "---"

# Verificar se ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick não instalado. Execute: sudo apt-get install imagemagick"
    exit 1
fi

# Otimizar JPGs
for file in "$IMAGES_DIR"/*.jpg "$IMAGES_DIR"/*.jpeg; do
    if [ -f "$file" ]; then
        ORIGINAL_SIZE=$(du -h "$file" | cut -f1)
        convert "$file" -quality $QUALITY -resize "${RESIZE_WIDTH}>" "$file"
        NEW_SIZE=$(du -h "$file" | cut -f1)
        echo "✅ $file | $ORIGINAL_SIZE → $NEW_SIZE"
    fi
done

# Otimizar PNGs com pngquant (se disponível) ou ImageMagick
for file in "$IMAGES_DIR"/*.png; do
    if [ -f "$file" ]; then
        ORIGINAL_SIZE=$(du -h "$file" | cut -f1)
        
        if command -v pngquant &> /dev/null; then
            pngquant --quality=$QUALITY --force --output="$file" "$file"
        else
            convert "$file" -quality $QUALITY -resize "${RESIZE_WIDTH}>" "$file"
        fi
        
        NEW_SIZE=$(du -h "$file" | cut -f1)
        echo "✅ $file | $ORIGINAL_SIZE → $NEW_SIZE"
    fi
done

# Otimizar WebP (se houver)
for file in "$IMAGES_DIR"/*.webp; do
    if [ -f "$file" ]; then
        ORIGINAL_SIZE=$(du -h "$file" | cut -f1)
        cwebp -q $QUALITY "$file" -o "$file.tmp" && mv "$file.tmp" "$file"
        NEW_SIZE=$(du -h "$file" | cut -f1)
        echo "✅ $file | $ORIGINAL_SIZE → $NEW_SIZE"
    fi
done

echo "---"
echo "📊 Resumo de otimização:"
du -sh "$IMAGES_DIR"
echo "✅ Imagens otimizadas com sucesso!"
