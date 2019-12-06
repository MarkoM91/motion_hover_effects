class EffectShell {
  constructor(container = document.body, itemsWrapper = null) {
    this.container = container
    this.itemsWrapper = itemsWrapper
    if (!this.container || !this.itemsWrapper) return
    this.setup()
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
}
