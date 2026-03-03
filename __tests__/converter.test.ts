import { jsonToXml, jsonToString } from '@/lib/converter';

describe('Converter', () => {
  const sampleJson = {
    name: "John",
    age: 30,
    city: "New York"
  };

  const sampleArray = [
    { name: "John", age: 30 },
    { name: "Jane", age: 25 }
  ];

  test('converts simple JSON to XML', () => {
    const xml = jsonToXml(sampleJson);
    expect(xml).toContain('<name>John</name>');
    expect(xml).toContain('<age>30</age>');
  });

  test('converts array JSON to String (escaped)', () => {
    const str = jsonToString(sampleArray);
    expect(str).toContain('\\"name\\":\\"John\\"');
    expect(str).toContain('\\"age\\":30');
    expect(str.startsWith('"')).toBe(true);
    expect(str.endsWith('"')).toBe(true);
  });

  test('converts object JSON to String (escaped)', () => {
    const str = jsonToString(sampleJson);
    expect(str).toContain('\\"name\\":\\"John\\"');
    expect(str).toContain('\\"age\\":30');
    expect(str).toContain('\\"city\\":\\"New York\\"');
    expect(str.startsWith('"')).toBe(true);
    expect(str.endsWith('"')).toBe(true);
  });
});
