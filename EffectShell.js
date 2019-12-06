class EffectShell {
  constructor(container = document.body, itemsWrapper = null) {
    this.container = container
    this.itemsWrapper = itemsWrapper
    if (!this.container || !this.itemsWrapper) return
    this.setup()
    this.initEffectShell().then(() => {
      console.log('load finished');
      this.isLoaded = true
    })
    this.createEventsListener();
  }

  setup() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true})
    this.renderer.setSize(this.viewport.width, this.viewport.height)
    this.renderer.pixelRatio = window.devicePixelRatio
    this.container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      40,
      this.viewport.aspectRatio,
      0.1,
      100
    )
    this.camera.position.set(0, 0, 3)

    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  get viewport() {
    let width = this.container.clientWidth
    let height = this.container.clientHeight
    let aspectRatio = width / height
    return {
      width,
      height,
      aspectRatio
    }
  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.viewport.width, this.viewport.height)
  }

  get itemsElements() {
    const items = [this.itemsWrapper.querySelectorAll('.link')];

    return items.map((item, index) => ({
      element: item,
      img: item.querySelector('img') || null,
      index: index
    }))
  }

  initEffectShell() {
    let promises = []

    this.items = this.itemsElements

    const THREEtextureLoader = new THREE.TextureLoader()
    this.items.forEach((item, index) => {
      promises.psuh(
        this.loadTexture(
          THREEtextureLoader,
          item.img ? item.img.src : null,
          index
        )
      )
    })
    return new Promise((resolve, reject) => {
    Promise.all(promises).then(promises => {
      promises.forEach((promises, index) => {
        this.items[index].texture = promise.texture
      })
      resolve()
    })
  })
  }

  loadTexture(loader, url, index) {
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve({ texture: null, index })
        return
      }
      loader.load(
        url,
        texture => {
          resolve({ texture, index })
        },
        undefined,
        error => {
          console.log('An error happened.', error);
          reject(error)
        }
      )
    })
  }

  createEventsListener() {
    this.items.forEach((item, index) => {
      item.element.addEventListener(
        'mouseover',
        this._onMouseOver.bind(this, index),
        false
      )
    })

    thisw.container.addEventListener(
      'mousemove',
      this._onMouseMove.bind(this),
      false
    )
    this.itemsWrapper.addEventListener(
      'mouseleave',
      this._onMouseLeave.bind(this),
      false
    )
  }

  _onMouseLeave(event) {
    this.isMouseOver = false
    this._onMouseLeave(event)
  }

  _onMouseMove(event) {
    this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1;
    this.mouse.y = (event.clientY / this.viewport.height) * 2 + 1;

    this.onMouseMove(event);
  }

  _onMouseOver(index, event) {
    this.onMouseOver(index, event)
  }

  get viewSize() {
    let distance = this.camera.position.z
    let vFov = (this.camera.fov * Math.PI) / 180;
    let height = 2 * Math.tan(vFov / 2) * distance;
    let width = height * this.viewport.aspectRatio;
    return {width, height, vFov}
  }
}

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out-min)) / (in_max -in_min) * out_min
}

$(document).ready(function() {
  var x = new EffectShell();
});
