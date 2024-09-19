import { ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar.jsx";
import Cookies from "js-cookie";
import { authApi, endpoints, standardApi } from "../helper/Apis.js";
import { useEffect, useRef, useState } from "react";
import tt, { map } from "@tomtom-international/web-sdk-maps";

import {services} from "@tomtom-international/web-sdk-services";


export default function Tracking() {
  const SAN_FRANCISCO = [-122.4194, 37.7749]
  const mapRef = useRef()

  console.log(mapRef)

  let map = useRef(null);
  let markers = useRef([])
  // let [markers, setMarkers] = useState([])
  console.log("market outside ", markers)


  const addMarker = (event) => {
    console.log("market inside func", markers.current)
    console.log("event marker", event)
    if(markers.current.length<2){

      const marker = new tt.Marker().setLngLat(event.lngLat).addTo(map.current);
      markers.current=[...markers.current, marker];
      console.log("inside markers", markers.current)
      // setMarkers(prev=>[...prev,marker])
    }else{
      alert("just 2 markers")
    }
  }
  const calculateRoute = async (routeOptions, color)=>{
    try {
      const response = await services.calculateRoute(routeOptions);
      const geojsonData = response.toGeoJson()
      map.current.addLayer({
        id:color,
        type:"line",
        source:{
          type:"geojson",
          data:geojsonData
        },
        paint:{
          "line-color":color,
          "line-width":6
        }
      })
    }catch (err){
      console.log(err)
    }
  }

  const route =async ()=>{
    if(markers.current.length>2){
      alert("just 2 markers")
    }
    alert("ok")
    const key = import.meta.env.VITE_TOM_TOM_API_KEY;
    const locations = markers.current.map((marker)=>marker.getLngLat())
    console.log("location________________________",locations, "marker___________",markers.current)
    calculateRoute({
        key,
      locations,
    },
      "green")
    calculateRoute({
      key,
      locations,
      travelMode: 'truck',
      vehicleLoadType:'otherHazmatExplosive',
      vehicleWeight:8000
    },
      "red"
    )
  }

  const startTracking = async () => {
    console.log(markers.current)
    let waypoints = []
    const key = import.meta.env.VITE_TOM_TOM_API_KEY;
    const locations = markers.current.map((marker)=>marker.getLngLat())
    console.log("location",locations)
    const response = await services.calculateRoute({key,locations,maxAlternatives:5})
    console.log("waypoints",response.routes[0].legs[0].points)
    waypoints=response.routes[0].legs[0].points
    waypoints =waypoints.map((point) => `${point.lng},${point.lat}`);
    let layerId = 'dynamic-route-layer';
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
      map.currentp.removeSource(layerId);
    }
    map.current.addLayer({
      id: layerId,
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      },
      paint: {
        'line-color': 'yellow',
        'line-width': 6
      }
    });
    let firstMarker = null;
    const updateFirstMarker = (lng, lat) => {
      if (firstMarker) {
        firstMarker.setLngLat({lat:lat,lng:lng}).addTo(map.current); // Update the position of the existing marker
      } else {
        firstMarker = new tt.Marker() // Create a new marker if it doesn't exist
          .setLngLat({lat:lat,lng:lng})
          .addTo(map.current);
      }
    };

    while (waypoints.length > 1) {
      try {
        // Step 1: Format the waypoints
        const locations = waypoints.join(':');
        console.log('Current locations:', locations);

        // Step 2: Calculate the route for the current waypoints
        const response = await services.calculateRoute({
          key,
          locations:locations,
        });

        const geojsonData = response.toGeoJson();
        map.current.getSource(layerId).setData(geojsonData);
        let [lng, lat] = waypoints[0].split(",")
        updateFirstMarker(Number(lng), Number(lat))
        // new tt.Marker().setLngLat(currentLngLat).addTo(map);
        waypoints.shift() // Use slice to avoid mutating the original array

        console.log('Remaining waypoints:', waypoints);
        if(waypoints.length===1){
          map.current.removeLayer(layerId);
          map.current.removeSource(layerId);
          let [lng, lat] = waypoints[0].split(",")
          updateFirstMarker(Number(lng), Number(lat))
        }

      } catch (err) {
        console.error('Error updating route:', err);
      }
    }

  }


  useEffect(() => {
    console.log(mapRef)
    map.current = tt.map({
      key:import.meta.env.VITE_TOM_TOM_API_KEY,
      container:mapRef.current,
      center:SAN_FRANCISCO,
      zoom:15,
    })
    map.current.on("click", addMarker);
  }, []);

  const [suggestions, setSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState("")
  const search = async ()=> {
    console.log(searchValue)
    const response = await standardApi().get(endpoints["tomtom-search"](searchValue))
    console.log(response.data.results)
    setSuggestions(response.data.results)
  }

  const [openAutocompleteSearchForm, setOpenAutocompleteSearchForm] = useState(false)
  let originAddress = useRef()
  let destinationAddress = useRef()
  const [latestShipment, setLatestShipment] = useState()
  const removeMarkers = () => {
    console.log("marker__+____________-_",markers)
  }
  const geoCodeAddress = async (address) => {
    const response = await services.geocode({
      key:import.meta.env.VITE_TOM_TOM_API_KEY,
      query:address
    })
    console.log("geo response",response?.results[0].position)
    addMarker({lngLat:response?.results[0].position})
    map.current.setCenter(response?.results[0].position)
    if(markers.current.length===2){
      map.current.setZoom(15)
      route()
      // startTracking()
    }
  }
  const fetchLatestShipment = async () => {
    const token = Cookies.get("token")
    const response = await authApi(token).get(endpoints["shipment-latest"])
    console.log("latest shipment",response.data.shipment)
    setLatestShipment(response.data?.shipment)
    if(originAddress.current&&destinationAddress.current)
      return
    originAddress.current=response.data?.shipment.origin_address
    destinationAddress.current=response.data?.shipment.destination_address
    geoCodeAddress(originAddress?.current||"")
    geoCodeAddress(destinationAddress?.current||"")


  }
  useEffect(() => {
    fetchLatestShipment()
  }, []);


  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);

    const differenceInMs = now - past;

    const secondsAgo = Math.floor(differenceInMs / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const monthsAgo = Math.floor(daysAgo / 30);
    const yearsAgo = Math.floor(monthsAgo / 12);
    // Break down remainder units
    const remainingDays = daysAgo % 30;
    const remainingHours = hoursAgo % 24;
    const remainingMinutes = minutesAgo % 60;
    const remainingSeconds = secondsAgo % 60;

    return {
      years: yearsAgo,
      months: monthsAgo % 12,
      days: remainingDays,
      hours: remainingHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds
    };
  }

  const getTimeAgo = (date) => {
    const result = []
    if (timeAgo(date)?.years!==0)
      result.push(`${timeAgo(latestShipment?.date).years} years`)
    if (timeAgo(date)?.months!==0)
      result.push(`${timeAgo(latestShipment?.date).months} months`)
    if(timeAgo(date)?.days!==0)
      result.push(`${timeAgo(latestShipment?.date).days} days`)
    if(timeAgo(date)?.hours!==0)
      result.push(`${timeAgo(latestShipment?.date).hours} hours`)
    if (timeAgo(date)?.minute!==0)
      result.push(`${timeAgo(latestShipment?.date).minutes} minutes`)
    if(timeAgo(date)?.seconds!==0)
      result.push(`${timeAgo(latestShipment?.date).seconds} seconds`)

    return result.join(", ")
  }

  return (
    <>
      <ToastContainer position="top-right"/>

      <Sidebar/>
      <main className="h-screen sm:ml-64 flex flex-row bg-gray-100">
        <div className="flex">
          <div className="p-4 bg-white w-80">

            <div className="flex my-4 w-full relative">
              <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                     type="text" className="w-full px-3 py-2" />
              <button onClick={() => {
                search();
                setOpenAutocompleteSearchForm(true);
              }} className="px-2 py-2 bg-orange-500 text-white">Search
              </button>
              {suggestions && openAutocompleteSearchForm &&
                (
                  <div className="bg-white z-10 mt-1 rounded-b-sm absolute bottom-0 translate-y-[100%] right-0 left-0">
                    {suggestions.map((item, index) => {
                      return (
                        <div key={index} className="px-3 py-1 my-1 border-black border cursor-pointer">
                          <h4 className="text-lg">{item.address.freeformAddress}</h4>
                          <span className="text-sm">{item.type}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

            </div>
            <span onClick={route} className="p-3 bg-green-200 mr-5">Route</span>
            <span onClick={startTracking} className="p-3 bg-green-200 mr-5">Tracking</span>
            <div className="my-4 flex justify-between p-3 bg-orange-100 rounded-md">
              <section className="basis-2/3 flex flex-col gap-3">
                <h4 className="font-bold text-md">{latestShipment?.origin_address}</h4>
                <div>
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                       xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
                  </svg>
                </div>

                <h4 className="font-bold text-md">{latestShipment?.destination_address}</h4>
              </section>
              <section className="basis-1/3 flex gap-4 justify-between items-end text-right flex-col">
                <h4 className="font-bold rounded-full bg-orange-500 text-white p-2 w-fit">{latestShipment?.id}</h4>
                <h4 className="text-sm">
                  {getTimeAgo(latestShipment?.date)} ago
                </h4>
              </section>
            </div>
          </div>

          <div ref={mapRef} id="map" className="w-[calc(100vw-16rem-20rem)] h-screen relative">
          </div>
        </div>
      </main>
    </>
  )
}