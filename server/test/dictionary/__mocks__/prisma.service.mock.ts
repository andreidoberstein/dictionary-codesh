export const prismaMock = () => ({
  word: {
    count: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  wordHistories: {
    create: jest.fn(),
  },
  favorite: {
    upsert: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
});
