<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script>
  import * as Three from 'three'

  export default {
    name: 'ThreeTest',
    data () {
      return {
        camera: null,
        scene: null,
        renderer: null,
        mesh: null
      }
    },
    methods: {
      init: function () {
        let container = document.getElementById('container')
        this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10)
        this.camera.position.z = 0.6
        this.scene = new Three.Scene()
        // this.scene.background = new THREE.Color(0xff0000);
        let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2)
        let material = new Three.MeshNormalMaterial()
        this.mesh = new Three.Mesh(geometry, material)
        this.scene.add(this.mesh)

        this.renderer = new Three.WebGLRenderer({antialias: true,alpha:true})
        // renderer.setClearColor(0xffffff,0);
        this.renderer.setSize(container.clientWidth, container.clientHeight)
        container.appendChild(this.renderer.domElement)
      },
      animate: function () {
        requestAnimationFrame(this.animate)
        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.02
        this.renderer.render(this.scene, this.camera)
      }
    },
    mounted () {
      this.init()
      this.animate()
    }
  }
</script>
<style scoped>
  #container {
    height: 90px;
    width: 90px;
    margin-bottom: 10px;
    /* background-color: rgb(48,65,86); */
  }
</style>
