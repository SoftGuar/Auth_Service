// Mock Redis before importing the service
jest.mock('redis', () => {
    const mockClient = {
      connect: jest.fn().mockResolvedValue(undefined),
      set: jest.fn().mockResolvedValue(undefined),
      get: jest.fn(),
      del: jest.fn().mockResolvedValue(undefined),
      on: jest.fn()
    };
    
    return {
      createClient: jest.fn(() => mockClient)
    };
  });
  
  // Import service after setting up the mock
  import { connectRedis, setToken, getToken, deleteToken } from '../services/cacheService';
  import { createClient } from 'redis';
  
  describe('Redis Service', () => {
    // Get reference to the mock client
    const mockRedisClient = (createClient as jest.Mock)();
    
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('connectRedis', () => {
      it('should connect to Redis and log success', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        
        await connectRedis();
        
        expect(mockRedisClient.connect).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('Redis connected');
        
        consoleSpy.mockRestore();
      });
  
    });
  
    describe('setToken', () => {
      it('should set token with expiration', async () => {
        await setToken('testKey', 'testToken', 3600);
        
        expect(mockRedisClient.set).toHaveBeenCalledWith('testKey', 'testToken', { EX: 3600 });
      });
  
      it('should set token without expiration', async () => {
        await setToken('testKey', 'testToken');
        
        expect(mockRedisClient.set).toHaveBeenCalledWith('testKey', 'testToken');
      });
    });
  
    describe('getToken', () => {
      it('should retrieve a token', async () => {
        const mockToken = 'retrievedToken';
        mockRedisClient.get.mockResolvedValue(mockToken);
        
        const result = await getToken('testKey');
        
        expect(mockRedisClient.get).toHaveBeenCalledWith('testKey');
        expect(result).toBe(mockToken);
      });
  
      it('should return null if token not found', async () => {
        mockRedisClient.get.mockResolvedValue(null);
        
        const result = await getToken('nonexistentKey');
        
        expect(result).toBeNull();
      });
    });
  
    describe('deleteToken', () => {
      it('should delete a token', async () => {
        await deleteToken('testKey');
        
        expect(mockRedisClient.del).toHaveBeenCalledWith('testKey');
      });
    });
  });