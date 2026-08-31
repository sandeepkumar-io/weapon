export function getImageUrlForRifle(rifleName: string): string {
  const encodedName = encodeURIComponent(rifleName);
  const gradients = [
    'c0392b,e74c3c', // Red gradient
    '2c3e50,34495e', // Blue-gray gradient
    '8e44ad,9b59b6', // Purple gradient
    '27ae60,2ecc71', // Green gradient
    'e67e22,f39c12', // Orange gradient
    'd35400,e74c3c', // Dark orange gradient
    '16a085,1abc9c', // Teal gradient
    'c0392b,d32f2f', // Deep red gradient
  ];

  const hash = rifleName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradientIndex = hash % gradients.length;
  const gradient = gradients[gradientIndex];

  return `https://ui-avatars.com/api/?name=${encodedName}&background=${gradient}&color=ffffff&size=800&font-size=0.35&bold=true&format=svg`;
}

export function getFallbackImageUrl(rifleName: string): string {
  // High-quality fallback with Picsum (real photos) or premium placeholder
  const hash = rifleName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return `https://picsum.photos/800/600?random=${hash}`;
}
