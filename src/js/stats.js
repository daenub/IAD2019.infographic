import React, {useMemo} from "react"
import ReactDOM from "react-dom"

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

const data = {
  points: {
    title: "Punkte",
    bars: [
      {
        label: "11 / 12",
        values: [5, 11],
      },
      {
        label: "12 / 13",
        values: [5, 13],
      },
      {
        label: "13 / 14",
        values: [13, 27],
      },
      {
        label: "14 / 15",
        values: [15, 40],
      },
      {
        label: "15 / 16",
        values: [14, 47],
      },
      {
        label: "16 / 17",
        values: [12, 37],
      },
      {
        label: "17 / 18",
        values: [14, 39],
      },
      {
        label: "18 / 19",
        values: [15, 41],
      },
      {
        label: "19 / 20",
        values: [16, 49],
      },
    ],
    valueLabels: ["Goals", "Assists"],
  },
}

const Stats = () => {
  return (
    <div className="stats">
      <BarChart data={data.points} />
    </div>
  )
}

const BarChart = ({data}) => {
  const {title, bars, valueLabels} = data

  const maxValue = useMemo(() => {
    return max(bars.map(bar => sum(bar.values)))
  }, [bars])

  return (
    <div className="bar-chart">
      <div className="bar-chart__y-axis">
        <div className="bar-chart__y-axis-max">{maxValue}</div>
        <div className="bar-chart__y-axis-min">0</div>
      </div>
      <ul className="bar-chart__bars">
        {bars.map(bar => {
          const value = sum(bar.values)
          return (
            <li className="bar-chart__bar" key={bar.label}>
              <div
                className="bar-chart__bar-indicator"
                style={{height: `${map(value, 0, maxValue, 0, 100)}%`}}
              >
                <span className="bar-chart__value">{sum(bar.values)}</span>
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
