class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d")
    this.map = null;
  }

  startGameLoop () {
    const step = () => {
      // cavas 지우기
      this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
      
      // 캐릭터 정중앙
      const cameraPerson = this.map.gameObjects.hero;

      // 모든 오브젝트 위치 업데이트 (*오브젝트 그리기전에 실행해야 움직일때 바운스가 안생김)
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        })
      })

      // lower map 그리기
      this.map.drawLowerImage(this.ctx, cameraPerson)

      // 오브젝트 그리기
      Object.values(this.map.gameObjects).sort((a,b) => {
        return a.y - b.y;
      } ).forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson);
      })

      // upper map 그리기
      this.map.drawUpperImage(this.ctx, cameraPerson)

      requestAnimationFrame(() => {
        step()
      })
    }
    step()
  }
  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom)
    this.map.mountObjects();

    this.directionInput = new DirectionInput();
    this.directionInput.init()
    this.directionInput.direction; // "down"
    this.startGameLoop()

    this.map.startCutscene([
      { who: "hero", type: "walk",  direction: "down" },
      { who: "hero", type: "walk",  direction: "down" },
      { who: "npcA", type: "walk",  direction: "left" },
      { who: "npcA", type: "walk",  direction: "left" },
      { who: "npcA", type: "stand",  direction: "up", time: 800 },
    ])

  }
}