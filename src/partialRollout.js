'use strict'

const ROLLOUT_THRESHOLD = 2000
let matchesThreshold

const isAdmin = document.location.search.includes('admin')

start()

function start () {
  try {
    matchesThreshold = checkThreshold(ROLLOUT_THRESHOLD)
  } catch (err) {
    // checkThreshold throws if localStorage access is disallowed, warn + abort
    console.warn('MetaMask Mesh Testing - threshold check failed:', err)
    return
  }

  if (isAdmin) {
    console.log('MetaMask Mesh Testing - loading admin panel')
    activate()
  } else if (matchesThreshold) {
    console.log('MetaMask Mesh Testing - threshold matched -- activating test')
    activate()
  } else if (window.location.hostname === 'localhost') {
    console.log('MetaMask Mesh Testing - development detected -- activating test')
    activate()
  } else {
    console.log('MetaMask Mesh Testing - threshold not matched -- skipping test')
  }
}

function activate () {
  const src = isAdmin ? './admin-bundle.js' : './client-bundle.js'
  activateBundle(src)
}

function activateBundle (src) {
  const script = document.createElement('script')
  script.src = src
  script.type = 'text/javascript'
  document.body.appendChild(script)
}

function checkThreshold (rolloutThreshold) {
  if (window.localStorage.getItem('forceTest') === 'true') return true

  // abort while disabled
  console.info('Metamask Mesh Testing - this experiment has been temporarily disabled.')
  return false

  // load or setup id
  let id = Number(window.localStorage.getItem('id'))
  if (!id) {
    id = generateId()
    window.localStorage.setItem('id', id)
  }

  // check if id matches parital rollout threshold
  const matchesThreshold = ((id % rolloutThreshold) === 0)
  return matchesThreshold
}

function generateId () {
  return Math.floor(Math.random() * 1e9)
}
