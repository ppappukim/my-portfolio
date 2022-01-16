// 캐릭터가 움직일때 애니메이션을 정의합니다.
class Sprite {
  constructor (config) {

    // 이미지 셋업
    this.image = new Image();
    this.image.src = config.src
    this.image.onload = () => {
      this.isLoaded = true;
    }

    // shadow
    this.shadow = new Image();
    this.useShadow = true;
    if (this.useShadow) {
      this.shadow.src = "/images/characters/shadow.png"
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }


    // 애니메이션을 정의하고 초기 설정을 합니다.
    this.animations = config.animations || {

      // 움직이지 않을때
      "idle-up": [ [0,2] ],
      "idle-down": [ [0,0] ],
      "idle-left": [ [0,3] ],
      "idle-right": [ [0,1] ],

      // 움직일때
      "walk-up": [ [1,2],[0,2],[3,2],[0,2] ],
      "walk-down": [ [1,0],[0,0],[3,0],[0,0] ],
      "walk-left": [ [1,3],[0,3],[3,3],[0,3] ],
      "walk-right": [ [1,1],[0,1],[3,1],[0,1] ],
    }
    this.currentAnimation =  "idle-down"// config.currentAnimation || "idleDown";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8; // 한칸 움직일 때 애니메이션 프레임 갯수
    this.animationFrameProgress = this.animationFrameLimit;

    // gameObject 설정
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress () {
    // Down
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    // Reset counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }


  }

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y ;

    // shodow와 캐릭터가 같이 나오게 하기 
    this.isShadowLoaded && ctx.drawImage(this.shadow, x,y)

    const [frameX, frameY] = this.frame;

    this.isLoaded && ctx.drawImage(
      this.image,
      frameX * 32, frameY * 32,
      32,32,
      x,y,
      32,32
    )
    this.updateAnimationProgress();
  }

}