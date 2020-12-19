import { controllers } from '../controllers/types.js'
import { modules } from '../modules/types.js'
import { blocks } from '../blocks/types.js'

const plugInit = (all, plugs, store) => {
  const activeKeys = Object.keys(plugs)
  activeKeys.forEach(k => {
    const p = all[k]
    if (p && p.init) p.init(plugs[k])
    store.push({ plugin: p, conf: plugs[k], key: k })
  })
}

export default config => {
  const plugins = []

  plugInit(controllers, config.controllers, plugins)
  plugInit(modules, config.modules, plugins)

  const blocksKeysArr = []
  config.scenes.forEach(s => {
    s.blocks.forEach(b => {
      if (blocksKeysArr.indexOf(b.type) === -1) blocksKeysArr.push(b.type)
    })
  })

  const blocksKeys = []
  blocksKeysArr.forEach(d => (blocksKeys[d] = true))
  plugInit(blocks, blocksKeys, plugins)

  const all = []
  plugins.forEach(plug => {
    const p = plug.plugin
    const c = plug.conf
    if (p && p.run) {
      all.push(p.run(config, c))
    }
  })

  return all
}
