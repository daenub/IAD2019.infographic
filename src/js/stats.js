import React, {useMemo, useState, useCallback} from "react"
import ReactDOM from "react-dom"
import ReactTooltip from "react-tooltip"

export const initStats = () => {
  ReactDOM.render(<Stats />, document.querySelector("#stats"))
}

const sum = array => array.reduce((acc, num) => acc + num, 0)
const max = array =>
  array.reduce((acc, num) => (acc === null ? num : Math.max(acc, num)), null)
const min = array =>
  array.reduce((acc, num) => (acc === null ? num : Math.min(acc, num)), null)
const map = (value, start1, stop1, start2, stop2) =>
  ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2

const STAT_TYPES = {
  pim: "pim",
  p: "p",
  s: "s",
  toi: "toi",
  passes: "passes",
}

const CHART_TYPES = {
  bar: "bar",
  barMulti: "barMulti",
}

const data = {
  [STAT_TYPES.p]: {
    title: "Punkte",
    chartType: CHART_TYPES.barMulti,
    bars: [
      {
        label: "11/12",
        values: [5, 11],
      },
      {
        label: "12/13",
        values: [5, 13],
      },
      {
        label: "13/14",
        values: [13, 27],
      },
      {
        label: "14/15",
        values: [15, 40],
      },
      {
        label: "15/16",
        values: [14, 47],
      },
      {
        label: "16/17",
        values: [12, 37],
      },
      {
        label: "17/18",
        values: [14, 39],
      },
      {
        label: "18/19",
        values: [15, 41],
      },
      {
        label: "19/20",
        values: [16, 49],
      },
    ],
    valueLabels: ["Goals", "Assists"],
  },
  [STAT_TYPES.s]: {
    title: "Schüsse",
    chartType: CHART_TYPES.bar,
    bars: [
      {
        label: "11/12",
        value: 64,
      },
      {
        label: "12/13",
        value: 96,
      },
      {
        label: "13/14",
        value: 168,
      },
      {
        label: "14/15",
        value: 201,
      },
      {
        label: "15/16",
        value: 198,
      },
      {
        label: "16/17",
        value: 217,
      },
      {
        label: "17/18",
        value: 253,
      },
      {
        label: "18/19",
        value: 274,
      },
      {
        label: "19/20",
        value: 260,
      },
    ],
  },
  [STAT_TYPES.pim]: {
    title: "Strafminuten",
    chartType: CHART_TYPES.bar,
    bars: [
      {
        label: "11/12",
        value: 14,
      },
      {
        label: "12/13",
        value: 8,
      },
      {
        label: "13/14",
        value: 18,
      },
      {
        label: "14/15",
        value: 26,
      },
      {
        label: "15/16",
        value: 43,
      },
      {
        label: "16/17",
        value: 18,
      },
      {
        label: "17/18",
        value: 24,
      },
      {
        label: "18/19",
        value: 42,
      },
      {
        label: "19/20",
        value: 41,
      },
    ],
  },
  [STAT_TYPES.toi]: {
    title: "Eiszeit",
    chartType: CHART_TYPES.bar,
    prettifyValue: v => {
      let m = Math.floor(v / 60)
      let s = v % 60

      return `${m}:${s.toString().padStart(2, 0)}`
    },
    bars: [
      {
        label: "11/12",
        value: 1103,
      },
      {
        label: "12/13",
        value: 1412,
      },
      {
        label: "13/14",
        value: 1585,
      },
      {
        label: "14/15",
        value: 1588,
      },
      {
        label: "15/16",
        value: 1592,
      },
      {
        label: "16/17",
        value: 1504,
      },
      {
        label: "17/18",
        value: 1468,
      },
      {
        label: "18/19",
        value: 1510,
      },
      {
        label: "19/20",
        value: 1547,
      },
    ],
  },
}

const marker = [
  {
    key: STAT_TYPES.s,
    label: "Schüsse",
    x: 40,
    y: 56,
  },
  {
    key: STAT_TYPES.toi,
    label: "Eiszeit",
    x: 85,
    y: 87,
  },
  {
    key: STAT_TYPES.p,
    label: "Punkte",
    x: 67,
    y: 95,
  },
  {
    key: STAT_TYPES.pim,
    label: "Strafminuten",
    x: 58,
    y: 27,
  },
  // {
  //   key: STAT_TYPES.passes,
  //   label: "passes",
  //   x: 52,
  //   y: 15,
  // },
]

const Stats = () => {
  const [state, setState] = useState({
    currentStat: STAT_TYPES.p,
  })

  const handleSelection = useCallback(
    key => {
      setState(state => ({...state, currentStat: key}))
    },
    [setState]
  )

  const Chart =
    data[state.currentStat].chartType === CHART_TYPES.barMulti
      ? MultiBarChart
      : BarChart

  return (
    <div className="stats">
      <Selector onSelect={handleSelection} />
      <div className="stats__chart-wrapper">
        <Chart data={data[state.currentStat]} />
      </div>
    </div>
  )
}

const Selector = ({onSelect}) => {
  const [tooltipContent, setTooltipContent] = useState("")

  return (
    <div className="stats__selector" data-tip="">
      <img src={require("../images/selection-sq.jpg")} alt="Roman Josi" />
      {marker.map(m => (
        <button
          key={m.key}
          className="stats__marker"
          style={{top: `${m.y}%`, left: `${m.x}%`}}
          onClick={() => onSelect(m.key)}
          onMouseEnter={() => setTooltipContent(m.label)}
          onMouseLeave={() => setTooltipContent("")}
        />
      ))}
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </div>
  )
}

const BarChart = ({data}) => {
  const {title, bars, prettifyValue} = data

  const maxValue = useMemo(() => {
    return max(bars.map(bar => bar.value))
  }, [bars])

  return (
    <div className="bar-chart">
      <h2 className="bar-chart__title">{title}</h2>
      <div className="bar-chart__y-axis">
        <div className="bar-chart__y-axis-max">
          {prettifyValue ? prettifyValue(maxValue) : maxValue}
        </div>
        <div className="bar-chart__y-axis-min">0</div>
      </div>
      <ul className="bar-chart__bars">
        {bars.map(bar => {
          return (
            <li className="bar-chart__bar" key={bar.label}>
              <div
                className="bar-chart__bar-indicator"
                style={{height: `${map(bar.value, 0, maxValue, 0, 100)}%`}}
              >
                <span className="bar-chart__value">
                  {prettifyValue ? prettifyValue(bar.value) : bar.value}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="bar-chart__labels">
        {bars.map(bar => (
          <span key={bar.label} className="bar-chart__label">
            {bar.label}
          </span>
        ))}
      </div>
    </div>
  )
}

const MultiBarChart = ({data}) => {
  const {bars, valueLabels, title} = data

  const maxValue = useMemo(() => {
    return max(bars.map(bar => sum(bar.values)))
  }, [bars])

  return (
    <div className="bar-chart bar-chart--multi">
      <h2 className="bar-chart__title">{title}</h2>
      <div className="bar-chart__y-axis">
        <div className="bar-chart__y-axis-max">{maxValue}</div>
        <div className="bar-chart__y-axis-min">0</div>
      </div>
      <ul className="bar-chart__bars">
        {bars.map(bar => {
          const sumValue = sum(bar.values)
          return (
            <li className="bar-chart__bar" key={bar.label}>
              <div
                className="bar-chart__bar-indicator"
                style={{height: `${map(sumValue, 0, maxValue, 0, 100)}%`}}
              >
                <span className="bar-chart__value">{sum(bar.values)}</span>
                {bar.values.map(v => (
                  <div
                    key={v}
                    className="bar-chart__value-part"
                    style={{height: `${map(v, 0, sumValue, 0, 100)}%`}}
                  >
                    {v}
                  </div>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
      <div className="bar-chart__labels">
        {bars.map(bar => (
          <span key={bar.label} className="bar-chart__label">
            {bar.label}
          </span>
        ))}
      </div>
      <ul className="bar-chart__legend">
        {valueLabels.map(label => (
          <li key={label} className="bar-chart__legend-item">
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
