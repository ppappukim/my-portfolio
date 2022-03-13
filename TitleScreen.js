class TitleScreen {
  constructor({ progress }) {
    this.progress = progress;
  }
  getOptions(resolve) {
    // const safeFile = this.progress.getSaveFile();
    return [
      { 
        label: "Start Game",
        description: "Start a new pizza adventure!",
        handler: () => {
          this.close();
          this.sound.sfx.gameStart.play()
          this.sound.music.playing.play()
          resolve();
        }
      },
      { 
        label: "Who Is Me?",
        description: "Start a new pizza adventure!",
        handler: () => {
          this.close();
          resolve();
        }
      },
      { 
        label: "Contact Me",
        description: "Start a new pizza adventure!",
        handler: () => {
          this.close();
          resolve();
        }
      },
      // safeFile ? {
      //   label: "Continue Game",
      //   description: "Resume your adventure",
      //   handler: () => {
      //     this.close();
      //     resolve(safeFile);
      //   }
      // } : null
    ].filter(v => v);
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = (`
      <img class="TitleScreen_logo" src="/images/title.png" alt="Bubbo Portfolio" />
    `)
  }
  createSoundELement() {
    this.soundElement = document.createElement("div");
    this.soundElement.classList.add("sound-controls");
    this.soundElement.innerHTML = (`
      <div class="sound-icon">
        <img class="" src="/images/sound/sound-icon.svg"/>
      </div>
      <div class="sound-volume">
        <div class="sound-volume-value"></div>
      </div>
      <div class="sound-volume-controller">
      <div class="sound-volume-up" >
        <img src="/images/sound/sound-up-icon.svg"/>
      </div>
      <div class="sound-volume-down">
        <img src="/images/sound/sound-down-icon.svg"/>
      </div>
    `)
  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }
  
  init(container) {
    return new Promise(resolve => {
      this.createElement();
      this.createSoundELement()
      let overworld = document.getElementsByClassName("overworld")[0]
      // overworld.style.background = "#0fa6d4"
      overworld.style.backgroundImage = `url("/images/background.png")`
      overworld.style.backgroundSize = `192px`
      overworld.appendChild(this.element);
      overworld.appendChild(this.soundElement);

      // sound
      this.sound = new Sound();
      this.sound.music.intro.play()
      this.sound.volumeUpDown()
      this.sound.volumeMute()




      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve))
    })
  }

}