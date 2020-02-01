import tool from '../Utils/tool'

const jQuery = require('jquery')

// VM
const vmObj = {
  name: require('../../encryptees/featuresAvailable')[0],
  props: {},
  data () {
    return {
      domMenuEntry: null,
    }
  },
  computed: {},
  methods: {
    enable () {
      // do stuff
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

    this.$on('DOM:Ready', () => {
      this.enable()
    })
  },
  watch: {
    '$parent.isEnabled' (isEnabled) {
      if (!isEnabled) {
        this.disable()
      } else {
        this.enable()
      }
    },
  }
}

const console = require('../Utils/console').factory(() => {
  return 'KORIANWAL :: ' + vmObj.name
})

// let vm = new Vue(vmObj)
export default vmObj
