import Vuex from 'vuex'
import defaultState from './state.js'
import * as actions from './actions.js'
import { mutations } from './mutations.js'
import * as getters from './getters.js'
import createLogger from 'vuex/dist/logger'

const debug = process.env.NODE_ENV !== 'production'

export default () => {
  return new Vuex.Store({
    state: defaultState,
    actions,
    mutations,
    getters,
    strict: debug,
    plugins: debug ? [createLogger()] : []
  })
}
