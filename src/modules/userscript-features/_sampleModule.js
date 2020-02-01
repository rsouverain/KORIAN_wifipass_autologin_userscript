// import tool from '../Utils/tool'
// const jQuery = require('jquery')

const vmObj = {
  name: require('../../encryptees/featuresAvailable')[-1],
  props: {},
  data () {
    return {}
  },
  computed: {},
  methods: {
    enable () {
      // do stuff

      this.$on('DOM:Ready', () => {
        console.debug('dom is ready !')
      })
      this.$on('Loop:Tick', () => {
        console.debug('main loop ticked !')
      })
      this.$on('Loop:randomizedTick', () => {
        console.debug('main randomized loop ticked !')
      })
      this.$on('Browser:isDevtoolOpen', () => {
        console.debug('Devtool is open !')
      })

    },
    disable () {
      // do stuff
    },
  },
  destroyed () {
    console.debug('destroyed')
    this.disable()
  },
  created () {
    console.debug('created')
    this.enable()
  },
  watch: {
    '$parent.isEnabled' (isEnabled) {
      console.debug('Userscript isEnabled changed ! ', isEnabled)
      if (isEnabled) {
        this.enable()
      } else {
        this.disable()
      }
    },
  }
}

const console = require('../Utils/console').factory(() => {
  return 'KORIANWAL :: ' + vmObj.name
})

// let vm = new Vue(vmObj)
export default vmObj
