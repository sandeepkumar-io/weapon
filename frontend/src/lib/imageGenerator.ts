export function getImageUrlForRifle(rifleName: string): string {
  // Using DiceBear Avatars API - highly reliable, no CORS issues
  // Creates unique images based on rifle name

  const encodedName = encodeURIComponent(rifleName);

  // Use different styles for variety
  const styles = ['initials', 'shapes'];
  const hash = rifleName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const styleIndex = hash % styles.length;
  const style = styles[styleIndex];

  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedName}&backgroundColor=1e293b,0f172a,1e1b4b&scale=100`;
}

export function getFallbackImageUrl(rifleName: string): string {
  // Fallback placeholder image with rifle name
  const encodedName = encodeURIComponent(rifleName);

  const colors = ['1e293b', '0f172a', '1e1b4b', '172554', '1e3a8a'];
  const hash = rifleName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hash % colors.length;
  const bgColor = colors[colorIndex];

  return `https://ui-avatars.com/api/?name=${encodedName}&background=${bgColor}&color=ffffff&size=800&font-size=0.3&bold=true`;
}
