class Person extends GameObject {
  constructor (config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isStanding = false

    this.isPlayerControlled = config.isPlayerControlled || false

    this.direction = "down";

    this.directionUpdate = {
      "up": ["y", -1],
      "down": ["y", 1],
      "left": ["x", -1],
      "right": ["x", 1],
    }
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    }
    else {

      // keyboard 눌렀을 때, keyboard가 arrow버튼일 때
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow 
        })
      }
    }
    this.updateSprite(state)
  }

  startBehavior(state, behavior) {

    // wall 체크
    this.direction = behavior.direction;
    
    if (behavior.type === "walk") {

      // 만약 wall이 있으면 걷는 걸 멈춰라.
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {

        // 캐릭터가 막으면 2초후에 다시시도
        behavior.retry && setTimeout( () => {
          this.startBehavior(state, behavior)
        }, 2000)
        return;
      }

      // 걷기!
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16; // 캐릭터가 한번에 갈수있는 거리
      this.updateSprite(state)
    }

    if (behavior.type === "stand") {
      this.isStanding = true
      setTimeout(() => {
        utils.emitEvent("PersonStandingComplete", {
          whoId: this.id
        })
        this.isStanding = false

      }, behavior.time)
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining === 0) {
      // finish walk!
      utils.emitEvent("PersonWalkingComplete", {
        whoId: this.id
      })
    }
  }


  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction)
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction)
  }
}