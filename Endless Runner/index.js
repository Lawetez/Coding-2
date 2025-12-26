var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
function floor(x, height) {
    this.x = x;
    this.width = 700;
    this.height = height;
}
var world = {
    height: 480,
    width: 640,
    gravity: 10,
    floorTiles: [
        new floor(0, 140)
    ],
    draw: function() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);
        for(index in this.floorTiles) {
            var tile = this.floorTiles[index];
            var y = world.height - tile.height;
            ctx.fillStyle = "blue";
            ctx.fillRect(tile.x, y, tile.width, tile.height);
        }
    }
}
function tick() {
    world.draw();
    window.setTimeout("tick()", 1000/60);
}
tick();