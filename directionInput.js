class DirectionInput {
  constructor() {
    this.heldDirections = [];
    this.walking = new Howl({
      src: [
        '../assets/sounds/walking.wav'
      ],
      loop: true,
    })

    this.map = {
      "ArrowUp": "up",
      "KeyW": "up",
      "ArrowDown": "down",
      "KeyS": "down",
      "ArrowLeft": "left",
      "KeyA": "left",
      "ArrowRight": "right",
      "KeyD": "right",
    }
  }

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener("keydown", e => {
      const dir = this.map[e.code];
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.walking.rate(4)
        this.walking.play()
        this.heldDirections.unshift(dir);
      }
    });
    document.addEventListener("keyup", e => {
      this.walking.pause()
      const dir = this.map[e.code];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    })

  }

}