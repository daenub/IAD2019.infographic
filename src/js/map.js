import React, {useMemo, useState, useCallback, useRef, useEffect, memo} from "react"
import ReactDOM from "react-dom"
import ReactTooltip from "react-tooltip"

import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
  Line
} from "react-simple-maps";

import geoUrl from "../data/NA.json"
import teamCoords from "../data/team_coords.json"

const BASE_TEAM = teamCoords.find(({abbreviation}) => abbreviation === "NSH")

export const initMap = () => {
  ReactDOM.render(<MapChartMemo />, document.querySelector("#map"))
}

const COLORS = {
  gold: "#ffb81c",
  dixie: "#e0a219",
  navyBlue: "#041e42",
}

const offsets = {
  LAK: [-30, 0],
  ANA: [10, 30],
  TOR: [-15, -30],
  BUF: [30, -10],
  NYR: [60, 0],
  NYI: [55, 42],
  NJD: [18, 60],
}

// https://stackoverflow.com/a/1502821
const R = 6378137 // Earth’s mean radius in meter

const rad = x => x * Math.PI / 180

const getDistance = (p1, p2) => {
  p1 = {
    lng: p1[0],
    lat: p1[1]
  }

  p2 = {
    lng: p2[0],
    lat: p2[1]
  }

  const dLat = rad(p2.lat - p1.lat)
  const dLong = rad(p2.lng - p1.lng)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const MapChart = () => {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const tooltipContent = useMemo(() => {
    if (selectedTeam === null) {
      return ""
    } else {
      const team = teamCoords.find(team => team.abbreviation === selectedTeam)
      const name = team.name
      const distance = Math.round(getDistance(team.coordinates, BASE_TEAM.coordinates) / 1000)

      return `${name} – ${distance}km`
    }

  }, [selectedTeam])

  const selectTeam = abbreviation => setSelectedTeam(abbreviation)

  return (
    <div>
      <ComposableMap projection="geoAlbers" data-tip="">
        <Geographies geography={geoUrl}>
          {({ geographies }) => (
            <React.Fragment>
              {geographies.map(geo => {
                return (
                  <Geography
                    key={geo.rsmKey}
                    stroke="#FFF"
                    geography={geo}
                    fill="#DDD"
                  />
                )
              })}
              <Lines selectedTeam={selectedTeam} />
              <Teams selectTeam={selectTeam} selectedTeam={selectedTeam} />
            </React.Fragment>
          )}
        </Geographies>
      </ComposableMap>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </div>
  )
}

const MapChartMemo = memo(MapChart)

const Teams = ({selectTeam, selectedTeam}) => {
  return teamCoords.map(team => <Team selectTeam={selectTeam} team={team} key={team.name} selectedTeam={selectedTeam} />)
}

const Team = ({team, selectTeam, selectedTeam}) => {
  const {name, coordinates, abbreviation} = team

  const selected = selectedTeam === abbreviation || abbreviation === BASE_TEAM.abbreviation
  const deactivated = abbreviation !== BASE_TEAM.abbreviation && selectedTeam !== null && selectedTeam !== abbreviation
  const offset = offsets[abbreviation] || [0, 0]

  const classNames = ["map__team-logo"]

  if (selected) {
    classNames.push("map__team-logo--selected")
  } else if (deactivated) {
    classNames.push("map__team-logo--deactivated")
  }

  return (
    <React.Fragment>
      <Marker key={name} coordinates={coordinates}>
        <symbol id={`logo-${abbreviation}`} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="#fff" strokeWidth="3" stroke={COLORS.gold}></circle>
          <image x="10" y="10" height="80" width="80" xlinkHref={require(`../images/nhl-logos/${abbreviation}.png`)} fill="#fff"></image>
        </symbol>
        <circle
          r={8}
          fill={COLORS.gold}
          className={"map__team-anchor"}
          onMouseEnter={() => selectTeam(abbreviation)}
          onMouseLeave={() => selectTeam(null)}
        />
        <use
          width="40"
          height="40"
          x={-20 + offset[0]}
          y={-20 + offset[1]}
          xlinkHref={`#logo-${abbreviation}`}
          onMouseEnter={() => selectTeam(abbreviation)}
          onMouseLeave={() => selectTeam(null)}
          className={classNames.join(" ")}
        />
      </Marker>
    </React.Fragment>
  )
}

const Lines = ({selectedTeam}) => {
  return teamCoords.map(team => (<DistanceLine key={`line-${team.name}`} team={team} selectedTeam={selectedTeam} />))
}

const DistanceLine = ({team, selectedTeam}) => {
  return (
    <Line
      className="map__line"
      from={BASE_TEAM.coordinates}
      to={team.coordinates}
      stroke={COLORS.gold}
      opacity={selectedTeam === team.abbreviation ? 1 : 0}
    />
  )
}

/*{geographies.map(geo => {
  const centroid = geoCentroid(geo);
  const cur = allStates.find(s => s.val === geo.id);
  return (
    <g key={geo.rsmKey + "-name"}>
      {cur &&
        centroid[0] > -160 &&
        centroid[0] < -67 &&
        (Object.keys(offsets).indexOf(cur.id) === -1 ? (
          <Marker coordinates={centroid}>
            <text y="2" fontSize={14} textAnchor="middle">
              {cur.id}
            </text>
          </Marker>
        ) : (
          <Annotation
            subject={centroid}
            dx={offsets[cur.id][0]}
            dy={offsets[cur.id][1]}
          >
            <text x={4} fontSize={14} alignmentBaseline="middle">
              {cur.id}
            </text>
          </Annotation>
        ))}
    </g>
  );
})}
*/
