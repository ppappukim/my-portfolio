
class Sound {
  constructor () {

    // Init
    this.up = document.querySelector(".sound-volume-up")
    this.down = document.querySelector(".sound-volume-down")
    this.volume = document.querySelector(".sound-volume-value")
    this.icon = document.querySelector(".sound-icon")

    // music
    this.music = {
      // intro: new Howl({
      //   src: [
      //     'assets/sounds/intro.mp3'
      //   ],
      //   autoplay: true,
      //   // loop: true,
      // }),
      playing: new Howl({
        src: [
          'assets/sounds/playing.mp3'
        ],
        loop: true,
      }),
    }

    // sound effect
    this.sfx = {
      pressKey: new Howl({
        src: [
          'assets/sounds/pressKeyboard.wav'
        ],
      }),
      gameStart: new Howl({
        src: [
          'assets/sounds/gameStart.wav'
        ],
      }),
      textEntry: new Howl({
        src: [
          'assets/sounds/textEntry.wav'
        ],
      }),
      changeMap: new Howl({
        src: [
          'assets/sounds/changeMap.wav'
        ],
      }),
    }
  }

  volumeUpDown () {
    // Default set
    this.volume.style.height = `${Howler._volume * 100}` + "%"

    // volume up
    this.up.addEventListener("click", () => {
      if (Howler._muted) {
        Howler.mute(false)
        this.icon.childNodes[1].src = "/images/sound/sound-icon.svg"
      }
      let volumeUp = Howler._volume + .1
      this.volume.style.height = `${Howler._volume * 100 + 10}` + "%"
      Howler.volume(volumeUp);

      if (Howler._volume > 0) this.icon.childNodes[1].src = "/images/sound/sound-icon.svg"
    })

    // volume down
    this.down.addEventListener("click", () => {
      if (Howler._muted) {
        Howler.mute(false)
        this.icon.childNodes[1].src = "/images/sound/sound-icon.svg"
      }
      let volumeDown = Howler._volume - .1
      this.volume.style.height = `${Howler._volume * 100 - 10}` + "%"
      Howler.volume(volumeDown);

      if (Howler._volume < 0.1) {
        Howler.mute(true)
        this.icon.childNodes[1].src = "/images/sound/sound-mute-icon.svg"
      }
    })
  }

  volumeMute () {
    this.volume.style.height = `${Howler._volume * 100}` + "%"

    this.icon.addEventListener("click", () => { 
      if (!Howler._muted) {
        this.icon.childNodes[1].src = "/images/sound/sound-mute-icon.svg"
        Howler.mute(true)
        this.volume.style.height = "0%"
      }
      else {
        this.icon.childNodes[1].src = "/images/sound/sound-icon.svg"
        Howler.mute(false)
        this.volume.style.height = `${Howler._volume * 100}` + "%"
      }
      if (Howler._volume < 0.1) {
        Howler.volume(0.1);
        this.volume.style.height = "10%"
        this.icon.childNodes[1].src = "/images/sound/sound-icon.svg"
      }
    })
  }

}
