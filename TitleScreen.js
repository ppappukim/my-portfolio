class TitleScreen {
  constructor({ progress }) {
    this.progress = progress;
  }
  getOptions(resolve) {
    // const safeFile = this.progress.getSaveFile();
    return [
      { 
        label: "Start",
        description: "Start a new pizza adventure!",
        handler: () => {
          this.close();
          this.sound.sfx.gameStart.play()
          this.sound.music.playing.play()
          resolve();
        }
      },
      { 
        label: "About",
        description: "Start a new pizza adventure!",
        handler: () => {
          this.close();
          resolve();
        }
      },
      { 
        label: "Contact",
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
      <div class="screen-header">
        <div class="header-part1"></div>
        <div class="header-part2"></div>
        <div class="header-part3"></div>
        <div class="header-dot1"></div>
        <div class="header-dot2"></div>
        <div class="header-dot3"></div>
      </div>
      <div class="screen-body">
        <div class="title">
          <img class="bubbo" src="/images/bubbo.svg" alt="Bubbo Portfolio" />
          <img class="portfolio" src="/images/portfolio.svg" alt="Bubbo Portfolio" />
        </div>
      </div>
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
  createScreenBottomElement() {
    this.screenBottomElement = document.createElement("div");
    this.screenBottomElement.classList.add("copyright");
    this.screenBottomElement.innerHTML = (`
      <div class="copyright">
        Copyright © 2021 bubbo kim portfolio
      </div>
    `)
    this.element.appendChild(this.screenBottomElement);
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
      overworld.style.background = "#1955D9"
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

      this.createScreenBottomElement()
    })
  }

}