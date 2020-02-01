import jQuery from 'jquery'

const vmObj = {
  name: require('../../encryptees/featuresAvailable')[1],
  props: {},
  data () {
    return {
    }
  },
  computed: {},
  methods: {
    getPageForm () {
      let $form = jQuery('.presentation.presentation-basic form[action*=korian]')
      if ($form.length > 0) {
        return jQuery($form.get(0))
      }
      return null
    },
    submitPageForm () {
      console.warn('- submitPageForm -')
      const $form = this.getPageForm()
      if ($form) {
        $form.submit()
      }
      return null
    },
    enable () {
      // do stuff ...
      this.submitPageForm()
    },
    disable () {
      // do stuff ...
    },
  },
  destroyed () {
    console.debug('destroyed')
    this.disable()
  },
  created () {
    console.debug('created')
    this.$on('DOM:Ready', () => {
      console.debug('dom is ready !')
      this.enable()
    })

    this.$on('Loop:Tick', () => {
      this.submitPageForm()
    })
    // this.$on('Loop:randomizedTick', () => {
    //   console.debug('main randomized loop ticked !')
    // })
    // this.$on('Browser:isDevtoolOpen', () => {
    //   console.debug('Devtool is open !')
    // })
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
