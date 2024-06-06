// Romario Linares & Kevin Gallegos
// Created: 6/5/2024
// Phaser: 3.70.0
//
// 
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets:
// https://kenney.nl/assets/pixel-platformer

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
    scene: [Load, Platformer]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);