import React, { useEffect, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import Leaflet from "leaflet"

import { useNfs } from "../../hooks/Nfs"

import { LoadingComponent } from "../../components/Loading"
import mapIcon from "../../assets/icons/mapIcon.svg"

const PendingNfsMap = () => {
  const [loadingPage, setLoadingPage] = useState(true)

  const { nfsArray, setNfsArray, getPendingNfs } = useNfs()

  useEffect(() => {
    const getNfsToDeliveryFromDB = async () => {
      const { data } = await getPendingNfs()

      const filteredPendingNfs = data.filter(nf => nf.status !== "shipping")

      setNfsArray(filteredPendingNfs)

      return setLoadingPage(false)
    }

    return getNfsToDeliveryFromDB()
  }, [getPendingNfs, setNfsArray])

  const markerIcon = Leaflet.icon({
    iconUrl: mapIcon,
    iconSize: [38, 38],
    iconAnchor: [15, 35],
    popupAnchor: [5, -30]
  })

  if (loadingPage) return <LoadingComponent />
  return (
    <MapContainer
      center={[-22.8213219, -43.2804769]}
      zoom={10}
      style={{ width: "100%", height: "100vh", marginTop: 5, zIndex: 100 }}
    >
      <TileLayer
        url="https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?apiKey=I516H8P7d-TsFoo6NK8IfwULAbZR1u5CmNHSqLYdonk&ppi=320"
      />

      {nfsArray.map(nf => (
        <Marker
          key={nf.id}
          position={[nf.coordinates.lat, nf.coordinates.lng]}
          icon={markerIcon}
        >
          <Popup
            closeButton={false}
            position={[
              nf.coordinates.lat,
              nf.coordinates.lng
            ]}
          >
            <strong>Número da NF: </strong> {nf.number}
            <br />

            <strong>Data que chegou: </strong> {new Date(nf.date).toLocaleDateString("pt-br")}
            <br />

            <strong>Cliente: </strong> {nf.customer_name}
            <br />

            <strong>Peso: </strong> {nf.weight} Kg
            <br />

            <strong>Valor: </strong> {nf.value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
              })}
            <br />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default PendingNfsMap