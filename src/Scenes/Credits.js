class Credits extends Phaser.Scene {
    constructor() {
        super("credits");
    }

    preload() {
        this.load.setPath("./assets/");
        
    }

    create() {
    this.credits = this.add.text(275,50, "CREATED BY: ", {fontFamily: "Stencil Std, fantasy", fontSize: 30, fill: "#FFFFFF"});
    this.credits = this.add.text(235,100, "Romario Linares", {fontFamily: "Stencil Std, fantasy", fontSize: 30, fill: "#FFFFFF"});
    this.credits = this.add.text(281,150, "Kevin Gallegos", {fontFamily: "Stencil Std, fantasy", fontSize: 30, fill: "#FFFFFF"});
    this.credits = this.add.text(200,200, "Created with Phaser.JS", {fontFamily: "Stencil Std, fantasy", fontSize: 30, fill: "#FFFFFF"});
    this.credits = this.add.text(200,250, "Assets by Kenney", {fontFamily: "Stencil Std, fantasy", fontSize: 30, fill: "#FFFFFF"});
    const creditsButton = this.add.text(10, 300, "Return", {fontFamily: "Stencil Std, fantasy", fontSize: 30, fill: "#D99D3A"})
        .setInteractive()
        .on("pointerdown", () => this.scene.start("title"));
    
    }

    update() {
    }
}