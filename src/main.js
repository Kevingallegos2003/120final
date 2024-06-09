// Romario Linares & Kevin Gallegos
// Created: 6/5/2024
// Phaser: 3.70.0
//
// 
//
// Final Platform Shooting Wave Game
// 
// Art assets from Kenny Assets:
// https://kenney.nl/assets/pixel-platformer
// https://kenney.nl/assets/impact-sounds
// https://kenney.nl/assets/music-jingles 

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 720,
    height: 360,
    //scene: [Load, Platformer, GameOver, Credits]//change back to bottom version
    scene: [Title, Load, Platformer, GameOver, Credits]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);