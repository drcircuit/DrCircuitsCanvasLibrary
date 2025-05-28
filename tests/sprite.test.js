/**
 * Tests for sprite.js module
 */

import { describe, test, beforeEach, expect, mockFn } from './test-utils.js';
import { createSprite, sprite } from '../src/sprite.js';
import { vector } from '../src/vector.js';

describe('Sprite Module', () => {
    let mockSpriteSheet;
    let mockCanvas;
    let mockCtx;    beforeEach(() => {
        mockSpriteSheet = {
            width: 256,
            height: 256
        };
        
        mockCtx = {
            drawImage: mockFn(),
            getImageData: mockFn().mockImplementation(() => ({
                data: [255, 0, 0, 255] // Red pixel
            }))
        };
        
        mockCanvas = {
            width: 0,
            height: 0,
            getContext: mockFn().mockImplementation(() => mockCtx)
        };        // Mock document.createElement to return our mock canvas
        global.document = {
            createElement: mockFn().mockImplementation((tagName) => {
                if (tagName === 'canvas') {
                    return mockCanvas;
                }
                // Return a basic element for other tag types
                return {
                    style: {},
                    addEventListener: mockFn(),
                    removeEventListener: mockFn()
                };
            })
        };
    });

    describe('createSprite', () => {
        test('should create sprite with correct properties', () => {
            const sheet = mockSpriteSheet;
            const sprite = createSprite(sheet, 10, 20, 32, 48);

            expect(sprite.isSprite).toBe(true);
            expect(sprite.img).toBe(sheet);
            expect(sprite.pos.x).toBe(10);
            expect(sprite.pos.y).toBe(20);
            expect(sprite.width).toBe(32);
            expect(sprite.height).toBe(48);
        });

        test('should use vector for position', () => {
            const sprite = createSprite(mockSpriteSheet, 5, 15, 16, 16);

            expect(sprite.pos.isVector).toBe(true);
            expect(sprite.pos.x).toBe(5);
            expect(sprite.pos.y).toBe(15);
        });
    });    describe('sprite', () => {
        let spriteObj;
        let position;

        test('should create sprite object with correct properties', () => {
            position = vector(100, 150);
            spriteObj = sprite(mockSpriteSheet, position, 32, 32);
            
            expect(spriteObj.pos).toBe(position);
            expect(spriteObj.width).toBe(32);
            expect(spriteObj.height).toBe(32);
        });        test('should create internal canvas buffer', () => {
            const position = vector(100, 150);
            const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
            
            expect(global.document.createElement).toHaveBeenCalledWith('canvas');
            expect(mockCanvas.width).toBe(256);
            expect(mockCanvas.height).toBe(256);
            expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
        });

        test('should draw sprite sheet to internal buffer', () => {
            const position = vector(100, 150);
            const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
            
            expect(mockCtx.drawImage).toHaveBeenCalledWith(mockSpriteSheet, 0, 0);
        });        describe('add method', () => {
            test('should add sprite state', () => {
                const position = vector(100, 150);
                const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
                
                spriteObj.add('idle', 0, 0);
                spriteObj.add('walking', 32, 0);

                // We can't directly test the internal states array, 
                // but we can test the functionality through draw
                expect(typeof spriteObj.add).toBe('function');
            });
        });        describe('draw method', () => {
            test('should draw sprite state when state exists', () => {
                const position = vector(100, 150);
                const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
                const drawCtx = {
                    drawImage: mockFn()
                };

                spriteObj.add('idle', 64, 96);
                spriteObj.draw('idle', drawCtx);

                expect(drawCtx.drawImage).toHaveBeenCalledWith(
                    mockSpriteSheet,
                    64, 96, 32, 32,  // source rectangle
                    100, 150, 32, 32  // destination rectangle
                );
            });

            test('should not draw when state does not exist', () => {
                const position = vector(100, 150);
                const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
                const drawCtx = {
                    drawImage: mockFn()
                };

                spriteObj.draw('nonexistent', drawCtx);

                expect(drawCtx.drawImage).not.toHaveBeenCalled();
            });            test('should handle multiple states', () => {
                const position = vector(100, 150);
                const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
                const drawCtx = {
                    drawImage: mockFn()
                };

                spriteObj.add('state1', 0, 0);
                spriteObj.add('state2', 32, 32);

                spriteObj.draw('state1', drawCtx);
                expect(drawCtx.drawImage).toHaveBeenCalledWith(
                    mockSpriteSheet,
                    0, 0, 32, 32,
                    100, 150, 32, 32
                );

                spriteObj.draw('state2', drawCtx);
                expect(drawCtx.drawImage).toHaveBeenCalledWith(
                    mockSpriteSheet,
                    32, 32, 32, 32,
                    100, 150, 32, 32
                );
            });
        });        describe('collidesWith method', () => {
            test('should detect collision when sprites overlap', () => {
                const position = vector(100, 150);
                const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
                const otherSprite = createSprite(mockSpriteSheet, 110, 160, 32, 32);

                const collision = spriteObj.collidesWith(otherSprite);

                expect(collision).toBe(true);
            });

            test('should not detect collision when sprites do not overlap', () => {
                const position = vector(100, 150);
                const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
                const otherSprite = createSprite(mockSpriteSheet, 200, 200, 32, 32);

                const collision = spriteObj.collidesWith(otherSprite);

                expect(collision).toBe(false);
            });

            test('should detect edge collision', () => {
                const position = vector(100, 150);
                const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
                // Sprite at exactly adjacent position
                const otherSprite = createSprite(mockSpriteSheet, 132, 150, 32, 32);

                const collision = spriteObj.collidesWith(otherSprite);

                expect(collision).toBe(true);
            });

                        test('should handle collision with different sized sprites', () => {
                const position = vector(100, 150);
                const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
                const largerSprite = createSprite(mockSpriteSheet, 90, 140, 64, 64);

                const collision = spriteObj.collidesWith(largerSprite);

                expect(collision).toBe(true);
            });

            test('should work with sprite objects from sprite() function', () => {
                const position = vector(100, 150);
                const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
                const position2 = vector(110, 160);
                const otherSprite = sprite(mockSpriteSheet, position2, 32, 32);

                const collision = spriteObj.collidesWith(otherSprite);

                expect(collision).toBe(true);
            });
        });        describe('position updates', () => {
            test('should allow position modification', () => {
                const position = vector(100, 150);
                const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
                
                spriteObj.pos.x = 200;
                spriteObj.pos.y = 250;

                expect(spriteObj.pos.x).toBe(200);
                expect(spriteObj.pos.y).toBe(250);

                // Test that draw uses updated position
                const drawCtx = {
                    drawImage: mockFn()
                };

                spriteObj.add('test', 0, 0);
                spriteObj.draw('test', drawCtx);

                expect(drawCtx.drawImage).toHaveBeenCalledWith(
                    mockSpriteSheet,
                    0, 0, 32, 32,
                    200, 250, 32, 32
                );
            });
        });        describe('integration', () => {
            test('should support full sprite workflow', () => {
                const position = vector(100, 150);
                const spriteObj = sprite(mockSpriteSheet, position, 32, 32);
                const drawCtx = {
                    drawImage: mockFn()
                };

                // Add multiple animation states
                spriteObj.add('idle', 0, 0);
                spriteObj.add('walk1', 32, 0);
                spriteObj.add('walk2', 64, 0);

                // Draw different states
                spriteObj.draw('idle', drawCtx);
                spriteObj.draw('walk1', drawCtx);
                spriteObj.draw('walk2', drawCtx);

                expect(drawCtx.drawImage).toHaveBeenCalledTimes(3);

                // Move sprite
                spriteObj.pos.x += 10;
                spriteObj.pos.y += 5;

                // Check collision after movement
                const otherSprite = createSprite(mockSpriteSheet, 140, 180, 32, 32);
                const collision = spriteObj.collidesWith(otherSprite);

                expect(collision).toBe(true);
            });
        });
    });
});
