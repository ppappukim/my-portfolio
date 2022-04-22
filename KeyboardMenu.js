class KeyboardMenu {
  constructor(config={}) {
    this.options = []; //set by updater method
    this.up = null;
    this.down = null;
    this.prevFocus = null;
    this.descriptionContainer = config.descriptionContainer || null;
    this.currentIndex = 0
  }

  setOptions(options) {
    this.options = options;
    this.element.innerHTML = this.options.map((option, index) => {
      const disabledAttr = option.disabled ? "disabled" : "";
      const defaultSelect = index === 0 ? "select" : ""
      return (`
        <div class="option ${defaultSelect}">
          <div ${disabledAttr} data-button="${index}" data-description="${option.description}">
            ${option.label}
          </div>
          <span class="right">${option.right ? option.right() : ""}</span>
        </div>    
      `)
    }).join("");

    
    this.element.querySelectorAll(".option").forEach(button => {

      // console.log(this.element);
      // button.classList.add("select")

      button.addEventListener("click", (e) => {
        const chosenOption = this.options[this.currentIndex];
        chosenOption.handler();
      })
      window.addEventListener("keypress", (e) => {
        if (e.keyCode === 13) { // Enter
          e.preventDefault();
          const chosenOption = this.options[this.currentIndex];
          chosenOption.handler();
        }
      })
      // button.addEventListener("mouseover", (e) => {
      //   console.log('?');
      //   const chosenOption = this.options[e.target.dataset.button];
      //   chosenOption.handler();
      // })
      // button.addEventListener("mouseenter", () => {
      //   button.focus();
      // })
      // button.addEventListener("focus", () => {
      //   this.prevFocus = button;
      //   this.descriptionElementText.innerText = button.dataset.description;
      // })
    })

    // setTimeout(() => {
    //   this.element.querySelector("button[data-button]:not([disabled])").focus();
    // }, 10)
  }

  checkSelectButton(direction, e) {
    let array = Array.from(this.element.children)

    // Hover
    if (direction === "hover") { 
      this.currentIndex = Number(e.target.dataset.button)
      array.map((option, index) => {
        if (this.currentIndex === index) array[this.currentIndex].classList.add("select")
        else option.classList.remove("select")
      })
      return
    }

    array.map((option, index) => {
      if (option.classList.contains("select")) {
        this.currentIndex = index
        option.classList.remove("select")
      }
    })

    // up
    if (direction === "up") {
      if (this.currentIndex === 0) return array[this.currentIndex].classList.add("select")
      this.currentIndex = this.currentIndex - 1
      array[this.currentIndex].classList.add("select")
    }

    // down
    if (direction === "down") {
      if (this.currentIndex === array.length-1) return array[this.currentIndex].classList.add("select")
      this.currentIndex = this.currentIndex + 1
      array[this.currentIndex].classList.add("select")
    }
  }

  createElement() {
      this.element = document.createElement("div");
      this.element.classList.add("KeyboardMenu");
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

  end() {
    //Remove menu element and description element
    this.element.remove();
    // this.descriptionElement.remove();

    //Clean up bindings
    this.up.unbind();
    this.down.unbind();
    this.element.removeEventListener("mouseover", (e) => {})

    //Stop music
    Howler.stop()
  }

  init(container) {
    this.sound = new Sound
    this.createElement();
    // (this.descriptionContainer || container).appendChild(this.descriptionElement);
    container.appendChild(this.element);

    this.up = new KeyPressListener("ArrowUp", () => {
      this.checkSelectButton("up")
      this.sound.sfx.changeList.play()
    })
    this.down = new KeyPressListener("ArrowDown", () => {
      this.checkSelectButton("down")
      this.sound.sfx.changeList.play()
    })
    this.element.addEventListener("mouseover", (e) => {
      console.log("hover");
      this.sound.sfx.changeList.play()
      this.checkSelectButton("hover", e)
    })

  }

}