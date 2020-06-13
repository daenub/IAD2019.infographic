const $ = (s, context) => context.querySelector(s)
const $$ = s => Array.prototype.slice.call(document.querySelectorAll(s))

const mousePos = {
  x: 0,
  y: 0,
}

let tooltipEl = null
let requestId = null

const mouseMoveHandler = ({pageX, pageY}) => {
  mousePos.x = pageX
  mousePos.y = pageY
}

const activateMoveListener = () => {
  document.body.addEventListener("mousemove", mouseMoveHandler)
  tooltipEl.classList.add("active")
  requestId = requestAnimationFrame(moveTooltip)
}

const deactivateMoveListener = () => {
  document.body.removeEventListener("mousemove", mouseMoveHandler)
  tooltipEl.classList.remove("active")
  cancelAnimationFrame(requestId)
}

const moveTooltip = () => {
  console.log("moveTooltip")
  tooltipEl.style.transform = `translate(${mousePos.x}px, ${mousePos.y}px) translate(-50%, -100%)`

  requestId = requestAnimationFrame(moveTooltip)
}

const createTooltip = () => {
  tooltipEl = document.createElement("div")
  tooltipEl.classList.add("tooltip")
  document.body.appendChild(tooltipEl)
}

const prefixClassName = className => "tooltip--" + className

const handleMouseEvents = el => {
  const content = $("[data-tooltip-content]", el).innerHTML
  const customClass = el.dataset.tooltip
    ? prefixClassName(el.dataset.tooltip)
    : null

  el.addEventListener("mouseenter", e => {
    tooltipEl.innerHTML = content

    if (customClass) {
      tooltipEl.classList.add(customClass)
    }

    activateMoveListener()
  })

  el.addEventListener("mouseleave", e => {
    deactivateMoveListener()
    tooltipEl.innerHTML = ""

    if (customClass) {
      tooltipEl.classList.remove(customClass)
    }
  })
}

export const initTooltip = () => {
  createTooltip()

  $$("[data-tooltip]").forEach(handleMouseEvents)
}
