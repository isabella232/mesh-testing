const h = require('virtual-dom/h')
const s = require('virtual-dom/virtual-hyperscript/svg')
const renderBaseGraph = require('./base')
const renderPieChart = require('../pie')

module.exports = renderGraph

function renderGraph(state, actions, { nodeToPieData }) {
  return renderBaseGraph(state, actions, { renderNode, renderLink })

  function renderNode(node, state, actions) {
    const { selectedNode, networkState } = state
    const isSelected = selectedNode === node.id
    const size = (isSelected ? 10 : 5) * 2

    const data = nodeToPieData(node, state)
    if (data) {
      return (

        // render data as pie chart
        renderPieChart({
          data,
          centerX: node.x,
          centerY: node.y,
          width: size,
          height: size,
          outerRadius: size/2,
          onclick: () => actions.selectNode(node.id),
        })

      )
    } else {

      // no data - just draw simple circle
      return (

        s('circle', {
          r: size/2,
          fill: node.color,
          cx: node.x,
          cy: node.y,
          onclick: () => actions.selectNode(node.id)
        }, [
          s('title', `${node.id}`),
        ])

      )

    }
  }

  function renderLink(link, state, actions) {
    const { source, target } = link
    return (

      s('line', {
        strokeWidth: link.value,
        x1: source.x,
        y1: source.y,
        x2: target.x,
        y2: target.y,
      })

    )
  }

}