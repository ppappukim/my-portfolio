class Hud {
  constructor() {
    this.scoreboards = [];
  }

  update() {
    this.scoreboards.forEach(s => {
      s.update(window.playerState.pizzas[s.id])
    })
  }

  createElement() {

    if (this.element) {
      this.element.remove();
      this.scoreboards = [];
    }
    this.element = document.createElement("div");
    this.element.classList.add("Hud");

    const image = new Image();
    image.src = "/images/hud.png"
    this.element.appendChild(image);

    // const {playerState} = window;
    // playerState.lineup.forEach(key => {
    //   const pizza = playerState.pizzas[key];
    //   const scoreboard = new Combatant({
    //     id: key,
    //     ...Pizzas[pizza.pizzaId],
    //     ...pizza,
    //   }, null)
    //   scoreboard.createElement();
    //   this.scoreboards.push(scoreboard);
    //   this.element.appendChild(scoreboard.hudElement);
    // })
    // this.update();
  }

  init(container) {
    this.createElement();
    let overworld = document.querySelector(".overworld");
    overworld.appendChild(this.element);

    // document.addEventListener("PlayerStateUpdated", () => {
    //   this.update();
    // })

    // document.addEventListener("LineupChanged", () => {
    //   this.createElement();
    //   container.appendChild(this.element);
    // })

  }



}