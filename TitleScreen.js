class TitleScreen {
  constructor({ progress }) {
    this.progress = progress;
    this.sound = null,
    this.intro = new Howl({
      src: [
        'assets/sounds/intro.mp3'
      ],
      autoplay: true,
      // loop: true,
    })
  }

  getOptions(resolve) {
    // const safeFile = this.progress.getSaveFile();
    return [
      { 
        label: "Start",
        description: 'Go to View Portfolio',
        handler: () => {
          this.close();
          resolve();
        }
      },
      { 
        label: "About",
        description: 'My name is bubbo kim',
        handler: () => {
          if (this.aboutElement) return

          // Create Avout Modal
          this.creaeteAboutElement()
          let overworld = document.getElementsByClassName("overworld")[0]
          overworld.appendChild(this.aboutElement);

          // Close Modal - ESC Key
          this.actionListener = new KeyPressListener("Escape", () => {
            this.aboutElement.remove()
            this.aboutElement = null
            this.actionListener.unbind()
          })
          // Close Modal - Click Mouse
          this.aboutElement.addEventListener("click", () => {
            this.aboutElement.remove()
            this.aboutElement = null
          }, { once: true })
        }
      },
      { 
        label: "Contact",
        description: 'Do you want contact me?',
        handler: () => {
          if (this.contactElement) return

          // Create Conmtact Modal
          this.creaeteContactElement()
          let overworld = document.getElementsByClassName("overworld")[0]
          overworld.appendChild(this.contactElement);

          // Close Modal - ESC Key
          this.actionListener = new KeyPressListener("Escape", () => {
            this.contactElement.remove()
            this.contactElement = null
            this.actionListener.unbind()
          })
          // Close Modal - Click Mouse
          this.contactElement.addEventListener("click", () => {
            this.contactElement.remove()
            this.contactElement = null
          }, { once: true })
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
  creaeteAboutElement() {
    this.aboutElement = document.createElement("div");
    this.aboutElement.classList.add("about");
    this.aboutElement.innerHTML = (`
      <div class="screen-header">
        <div class="header-part1"></div>
        <div class="header-part2"></div>
        <div class="header-part3"></div>
        <div class="header-dot1"></div>
        <div class="header-dot2"></div>
        <div class="header-dot3"></div>
      </div>
      <div class="screen-body">
        <div class="title">About</div>
        <div class="body">
          <div style="padding-top:30px" class="row">
            <div class="r-title">Name</div>
            <div class="r-desc">Bubbo Kim</div>
          </div>
          <div class="row">
            <div class="r-title">Birthday</div>
            <div class="r-desc">1989 Nov 26</div>
          </div>
          <div class="row">
            <div class="r-title">Gender</div>
            <div class="r-desc">Male</div>
          </div>
          <div style="padding-bottom:30px" class="row">
            <div class="r-title">From</div>
            <div class="r-desc">Seoul Korea</div>
          </div>
          <div id="aboutCloseButton" class="g-button">CLOSE</div>                       
        </div>
      </div>
    `)
  }
  creaeteContactElement() {
    this.contactElement = document.createElement("div");
    this.contactElement.classList.add("contact");
    this.contactElement.innerHTML = (`
      <div class="screen-header">
        <div class="header-part1"></div>
        <div class="header-part2"></div>
        <div class="header-part3"></div>
        <div class="header-dot1"></div>
        <div class="header-dot2"></div>
        <div class="header-dot3"></div>
      </div>
      <div class="screen-body">
        <div class="title">Contact</div>
        <div class="body">
          <div style="padding-top:30px" class="row">
            <div class="r-title">Email</div>
            <div class="r-desc">rlaqjqqh2@gmail.com</div>
          </div>
          <div style="padding-bottom:30px" class="row">
            <div class="r-title">Phone</div>
            <div class="r-desc">01055904096</div>
          </div>
          <div id="contactCloseButton" class="g-button">CLOSE</div>                       
        </div>
      </div>
    `)
  }

  close() {
    this.intro.pause()
    this.keyboardMenu.end();
    this.element.remove();
  }
  
  init(container) {
    return new Promise(resolve => {
      this.createElement();
      this.createSoundELement()
      
      // Sound Element
      let overworld = document.getElementsByClassName("overworld")[0]
      overworld.style.background = "#1955D9"
      overworld.appendChild(this.soundElement);

      // Sound
      if (!this.intro.playing()) this.intro.play()
      this.soundGlobal = new Sound();
      this.soundGlobal.volumeUpDown()
      this.soundGlobal.volumeMute()



      // Keyboard Menu
      this.keyboardMenu = new KeyboardMenu({});
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve))
      container.appendChild(this.element);

      // Create Bottom Element
      this.createScreenBottomElement()
    })
  }

}