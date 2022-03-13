class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctxMap, canvasMap, mapContainer, cameraPerson) {

    canvasMap.setAttribute("width", this.lowerImage.naturalWidth + "px")
    canvasMap.setAttribute("height", this.lowerImage.naturalHeight + "px")
    mapContainer.setAttribute("width", this.lowerImage.naturalWidth + "px")
    mapContainer.setAttribute("height", this.lowerImage.naturalHeight + "px")
    
    ctxMap.drawImage(
      this.lowerImage, 
      0,
      0
      // utils.withGrid(1) - cameraPerson.x, 
      // utils.withGrid(1) - cameraPerson.y,
    )

    // Set Positon
    mapContainer.style.transform = `translate3d(${utils.withGrid(1) - cameraPerson.x}px, ${utils.withGrid(1) - cameraPerson.y}px, 0)`;


  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    console.log(currentX, currentY);
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    console.log(this.walls[`${x},${y}`]);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") {
        break;
      }
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior (if they are standing)
    Object.values(this.gameObjects).forEach(object => {
      const current = object.behaviorLoop[object.behaviorLoopIndex];
      if (current && current.type === "stand") {
        object.doBehaviorEvent(this);
      }
    })

  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {

      const relevantScenario = match.talking.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  DemoRoom: {
    id: "DemoRoom",
    lowerSrc: "/images/maps/room.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(0),
        y: utils.withGrid(1),
      }),
      // npcA: new Person({
      //   x: utils.withGrid(5),
      //   y: utils.withGrid(5),
      //   src: "/images/characters/people/hero.png",
      //   behaviorLoop: [
      //     { type: "walk", direction: "left", },
      //     { type: "walk", direction: "down", },
      //     { type: "walk", direction: "right", },
      //     { type: "walk", direction: "up", },
      //     //{ type: "stand", direction: "up", time: 400, },
      //   ],
      //   talking: [
      //     {
      //       required: ["TALKED_TO_ERIO"],
      //       events: [
      //         { type: "textMessage", text: "Isn't Erio the coolest?", faceHero: "npcA" },
      //       ]
      //     },
      //     {
      //       events: [
      //         { type: "textMessage", text: "I'm going to crush you!", faceHero: "npcA" },
      //         // { type: "battle", enemyId: "beth" },
      //         // { type: "addStoryFlag", flag: "DEFEATED_BETH"},
      //         // { type: "textMessage", text: "You crushed me like weak pepper.", faceHero: "npcA" },
      //         // { type: "textMessage", text: "Go away!"},
      //          //{ who: "npcB", type: "walk",  direction: "up" },
      //       ]
      //     }
      //   ]
      // }),
      // npcC: new Person({
      //   x: utils.withGrid(2),
      //   y: utils.withGrid(2),
      //   src: "/images/characters/people/hero.png",
      //   behaviorLoop: [
      //     { type: "stand", direction: "left", time: 500, },
      //     { type: "stand", direction: "down", time: 500, },
      //     { type: "stand", direction: "right", time: 500, },
      //     { type: "stand", direction: "up", time: 500, },
      //   ],
      // }),
      // npcB: new Person({
      //   x: utils.withGrid(8),
      //   y: utils.withGrid(5),
      //   src: "/images/characters/people/hero.png",
      //   talking: [
      //     {
      //       events: [
      //         { type: "textMessage", text: "Bahaha!", faceHero: "npcB" },
      //         { type: "addStoryFlag", flag: "TALKED_TO_ERIO"}
      //         //{ type: "battle", enemyId: "erio" }
      //       ]
      //     }
      //   ]
      //   // behaviorLoop: [
      //   //   { type: "walk",  direction: "left" },
      //   //   { type: "stand",  direction: "up", time: 800 },
      //   //   { type: "walk",  direction: "up" },
      //   //   { type: "walk",  direction: "right" },
      //   //   { type: "walk",  direction: "down" },
      //   // ]
      // }),
      // pizzaStone: new PizzaStone({
      //   x: utils.withGrid(2),
      //   y: utils.withGrid(7),
      //   storyFlag: "USED_PIZZA_STONE",
      //   pizzas: ["v001", "f001"],
      // }),
    },
    walls: {

      //Objects
      [utils.asGridCoord(-2,0)] : true, // bed
      [utils.asGridCoord(1,0)] : true, // closet
      [utils.asGridCoord(2,0)] : true, // tv
      [utils.asGridCoord(3,0)] : true, // tv
      [utils.asGridCoord(-2,3)] : true, // chair
      [utils.asGridCoord(-1,3)] : true, // chair
      [utils.asGridCoord(-2,4)] : true, // Desk
      [utils.asGridCoord(-1,4)] : true, // Desk

      // Walls
      [utils.asGridCoord(-2,-1)] : true,
      [utils.asGridCoord(-1,-1)] : true,
      [utils.asGridCoord(0,-1)] : true,
      [utils.asGridCoord(1,-1)] : true,
      [utils.asGridCoord(2,-1)] : true,
      [utils.asGridCoord(3,-1)] : true,

      [utils.asGridCoord(-3,0)] : true,
      [utils.asGridCoord(-3,1)] : true,
      [utils.asGridCoord(-3,2)] : true,
      [utils.asGridCoord(-3,3)] : true,
      [utils.asGridCoord(-3,4)] : true,

      [utils.asGridCoord(-2,5)] : true,
      [utils.asGridCoord(-1,5)] : true,
      [utils.asGridCoord(0,5)] : true,
      [utils.asGridCoord(1,5)] : true,
      [utils.asGridCoord(2,5)] : true,
      [utils.asGridCoord(3,5)] : true,
      [utils.asGridCoord(4,5)] : true,

      [utils.asGridCoord(4,0)] : true,
      [utils.asGridCoord(4,1)] : true,
      [utils.asGridCoord(4,2)] : true,
      [utils.asGridCoord(4,3)] : true,
      [utils.asGridCoord(5,4)] : true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7,4)]: [
        {
          events: [
            { who: "npcB", type: "walk",  direction: "left" },
            { who: "npcB", type: "stand",  direction: "up", time: 500 },
            { type: "textMessage", text:"You can't be in there!"},
            { who: "npcB", type: "walk",  direction: "right" },
            { who: "hero", type: "walk",  direction: "down" },
            { who: "hero", type: "walk",  direction: "left" },
          ]
        }
      ],
      [utils.asGridCoord(4,4)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "Kitchen",

              // Initial Positon
              x: utils.withGrid(0),
              y: utils.withGrid(0), 
              direction: "right"
            }
          ]
        }
      ]
    }
    
  },
  Kitchen: {
    id: "Kitchen",
    lowerSrc: "/images/maps/kitchen.png",
    upperSrc: "/images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5),
      }),
      npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: "/images/characters/people/npc3.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "You made it! This video is going to be such a good time!", faceHero:"npcB" },
            ]
          }
        ]
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(5,10)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "Street",
              x: utils.withGrid(29),
              y: utils.withGrid(9), 
              direction: "down"
            }
          ]
        }
      ]
    }
  },
  Street: {
    id: "Street",
    lowerSrc: "/images/maps/StreetLower.png",
    upperSrc: "/images/maps/StreetUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(29,9)]: [
        {
          events: [
            { 
              type: "changeMap",
              map: "Kitchen",
              x: utils.withGrid(5),
              y: utils.withGrid(10), 
              direction: "up"
            }
          ]
        }
      ]
    }
  }
}