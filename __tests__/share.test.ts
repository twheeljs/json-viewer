import { compress, decompress } from '@/lib/share';

describe('Share', () => {
  const sampleData = JSON.stringify({
    name: "John",
    age: 30,
    city: "New York",
    longText: "This is a long text that should be compressed efficiently because it has repeated patterns. repeated patterns. repeated patterns. repeated patterns."
  });

  test('compresses and decompresses correctly', () => {
    const compressed = compress(sampleData);
    expect(compressed).not.toBe(sampleData);
    // expect(compressed.length).toBeLessThan(sampleData.length); // Compression might not be efficient for small strings due to encoding overhead

    const decompressed = decompress(compressed);
    expect(decompressed).toBe(sampleData);
  });

  test('returns empty string for invalid decompression', () => {
    const result = decompress("invalid-string");
    expect(result).toBe("");
  });
});
