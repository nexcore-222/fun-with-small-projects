import os
from PIL import Image, ImageSequence
import imageio
import argparse

def compress_image(input_path, output_path, target_size_kb):
    """Compress static images (JPEG, PNG, WEBP) or GIFs to target size in KB."""
    img = Image.open(input_path)
    ext = img.format.lower()
    
    if ext in ['jpeg', 'jpg', 'png', 'webp']:
        quality = 95
        img_copy = img.copy()
        while True:
            #Save image with current quality and optimization
            img_copy.save(output_path, quality=quality, optimize=True)
            size_kb = os.path.getsize(output_path) / 1024
            #Break if target size reached or quality too low
            if size_kb <= target_size_kb or quality <= 10:
                break
            quality -= 5
        print(f"Saved {output_path} ({int(size_kb)} KB) with quality={quality}")
    elif ext == 'gif':
        compress_gif(input_path, output_path, target_size_kb)
    else:
        print(f"Unsupported format: {ext}")

def compress_gif(input_path, output_path, target_size_kb):
    """Compress GIF by reducing colors and optionally resizing frames."""
    gif = imageio.mimread(input_path)
    #Convert frames to palette mode (256 colors)
    resized_gif = [Image.fromarray(frame).convert("P", palette=Image.ADAPTIVE) for frame in gif]
    temp_path = "temp.gif"
    #Save temporary GIF with default duration
    imageio.mimsave(temp_path, resized_gif, duration=0.1)
    size_kb = os.path.getsize(temp_path) / 1024

    #Iteratively reduce resolution if GIF is still too large
    scale = 0.9
    while size_kb > target_size_kb:
        resized_gif = [frame.resize((int(frame.width*scale), int(frame.height*scale)), Image.LANCZOS) for frame in resized_gif]
        imageio.mimsave(temp_path, resized_gif, duration=0.1)
        size_kb = os.path.getsize(temp_path) / 1024
        scale -= 0.05
        if scale <= 0.1:
            break
    #Renaming
    os.rename(temp_path, output_path)
    print(f"Saved {output_path} ({int(size_kb)} KB)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Compress images and GIFs to target size (KB)")
    parser.add_argument("input", help="Input file path")
    parser.add_argument("output", help="Output file path")
    parser.add_argument("size", type=int, help="Target size in KB")
    args = parser.parse_args()
    
    compress_image(args.input, args.output, args.size)
