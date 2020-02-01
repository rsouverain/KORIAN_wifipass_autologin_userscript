/**
 * Main.js
 */
import Vue from 'vue'
import jsApi from '../encryptees/jsApi'
import featuresAvailable from '../encryptees/featuresAvailable'
import featuresAvailableModuleObjects from './userscript-features/index'
import tool from '../modules/Utils/tool'
const console = require('./Utils/console').factory('KORIANWAL :: main')

const vmObj = {
  props: {},
  data () {
    return {
      isEnabled: false,
      isDevtoolOpen: false,
      isNonProdEnv: false,
      loopInterval: null,
      loopRandomized: null,
      enabledFeatureModules: [],
      enabledFeatures: [
        0,
        1, // wifiBasicFormSubmit
      ]
    }
  },
  computed: {
  },
  methods: {
    triggerHook () {
      // if (!this.isEnaled) {
      //   return false
      // }
      console.debug('triggerHook: ', arguments)
      if (arguments.length <= 0) {
        console.error('triggerHook must have at least one argument')
        return false
      }

      this.enabledFeatureModules.forEach((vm, i) => {
        vm.$emit.apply(vm, arguments)
      })

      return true
    },
    enableFeatureModule (featAvKey) {
      if (typeof featuresAvailable[featAvKey] !== 'undefined') {
        // Feature is available
        let avFeatureName = featuresAvailable[featAvKey]
        featuresAvailableModuleObjects.forEach((vmObj, i) => {
          if (vmObj.name === avFeatureName) {
            vmObj.name = tool.aes.decrypt(vmObj.name)
            console.log('Enabling feature: ', vmObj.name)
            vmObj.parent = this
            this.enabledFeatureModules.push(new Vue(vmObj))
          }
        })
      }
    },
    enableFeatures () {
      console.log('enableFeatures')
      this.enableFeatureModule(0) // core.userscriptUi

      // Toggleable features
      this.enabledFeatures.forEach((featAvKey, iFeatAv) => {
        this.enableFeatureModule(featAvKey)
      })
    },
    destroyFeatures () {
      this.enabledFeatureModules.forEach((vm, i) => {
        vm.$destroy()
      })
    },
    isMatching () {
      return true
      // return (this.matchHaystack().indexOf(this.matchNeedle()) !== -1)
    },
    // matchNeedle () {
    //   let jsValue = tool.jsVarEnc(jsApi[0], global)
    //   if (jsValue !== undefined) {
    //     return tool.hash256(jsValue)
    //   } else {
    //     return null
    //   }
    // },
    // matchHaystack () {
    //   return networkKeys
    // },
    guessIsNonProdEnv () {
      // let envObj = tool.jsVarEnc(jsApi[1], global)
      // this.isNonProdEnv = (typeof envObj.production === 'undefined' || !envObj.production)
      this.isNonProdEnv = false
    },
    guessIsDevToolOpen () {
      this.isDevtoolOpen = tool.isDevtoolOpen()
    },
    removeLoop () {
      if (this.loopInterval !== null) {
        clearInterval(this.loopInterval)
        this.loopInterval = null
      }
    },
    removeRandomizedLoop () {
      if (this.loopRandomized !== null) {
        clearTimeout(this.loopRandomized)
        this.loopRandomized = null
      }
    },
    createLoop () {
      this.removeLoop()
      this.loopInterval = setInterval(() => {
        if (this.isEnabled) {
          // console.log('Main interval tick')
          // this.guessIsDevToolOpen()
          this.guessIsNonProdEnv()
          this.triggerHook('Loop:Tick')
        }
      }, 800)

      this.createRandomizedLoop()
    },
    createRandomizedLoop () {
      let intervalMs = tool.rand(tool.rand(500, 5000), tool.rand(6000, 20200))
      console.debug('createRandomizedLoop with intervalMs: ', intervalMs)
      this.loopRandomized = setTimeout(() => {
        this.guessIsDevToolOpen() // could be done in main Loop if required
        if (this.isEnabled) {
          this.triggerHook('Loop:randomizedTick')
        }
        this.createRandomizedLoop()
      }, intervalMs)
    }
  },
  destroyed () {
    console.warn('- destroyed -')
    this.removeLoop()
    this.removeRandomizedLoop()
    this.destroyFeatures()
  },
  created () {
    this.isEnabled = this.isMatching() && !this.isNonProdEnv
    console.debug('- created -', this.isEnabled)
  },
  watch: {
    enabledFeatureModules (vm) {
    },
    isNonProdEnv (isNonProd, wasNonProd) {
      // this.triggerHook('Env:isNonProdChanged', isNonProd)
      this.isEnabled = !isNonProd
    },
    isEnabled (isEnabled, wasEnabled) {
      if (isEnabled) {
        this.createLoop()
        this.createRandomizedLoop()
        this.enableFeatures()
        global.document.addEventListener('DOMContentLoaded', (event) => {
          this.triggerHook('DOM:Ready', event)
        })
      } else {
        // this.$destroy()
      }
    },
    isDevtoolOpen (n, o) {
      // console.warn('isDevtoolOpen: ', n, o)
      this.triggerHook('Browser:isDevtoolOpen', n)
    }
  }
}

let vm = new Vue(vmObj)
if (process.env.CONSOLE_ENABLED) {
  global.userscriptMain = vm // <--- DEBUG ONLY
}
export default vm
