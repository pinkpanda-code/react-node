import React, { useState, useEffect, useRef} from 'react'
import Header from './components/Header'
import Map from './components/Map'
import Slider from './components/Slider'
import Button from './components/Button'
import './App.css';

const App = () => {

    const [count, setCount] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [centreLocation, setCentreLocation] = useState(null);
    const currentIntervalRef = useRef(null);
    const officeLocations = [{name: "Singapore", lat: 1.285194, lng: 103.8522982}, {name: "London", lat: 51.5049375, lng: -0.0964509}];

    //first load
    useEffect(() => {
        refreshMap();
    },[])

    //function to reset map to nearest office location using user current location
    const refreshMap = async () =>{
        await setNearestLocation();
        setCount(count ? count : 10); //default taxi count to 10
    }

    //load if count/centre location changes, auto reload every 30 secs after that
    useEffect(() => {
        if(count && centreLocation){
            clearInterval(currentIntervalRef.current);

            refreshMarkers(count); //initial call before interval starts

            //30 secs refresh interval
            currentIntervalRef.current = setInterval(() => {
                refreshMarkers(count)
            }, 30000);

            return () => clearInterval(currentIntervalRef.current);
        }
    },[count,centreLocation])

    //function to refresh map markers (taxi locations)
    const refreshMarkers = async (value) => {
        //api to node backend to get latest taxi locations
        const res = await fetch(`http://localhost:3080/getTaxi/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify({taxiCount: value, lat: centreLocation.lat, lng: centreLocation.lng}),
        });

        let result = await res.json();

        if(res.status === 200){
            setMarkers(result.drivers); //update map markers
        }else {
            alert(result.errorMessage);
        }
    }

    //function to update map centre location, will which triggers useEffect and refresh the markers
    const changeMapLocation = (location) => {
        setCentreLocation({
            lat : location.lat,
            lng : location.lng,
        })
    }

    //function to update taxi count, will which triggers useEffect and refresh the markers
    const changeCount = (value) => {
        setCount(value);
    }

    /*functions to calculate nearest office location START*/
    const deg2Rad = (deg) => {
        return deg * Math.PI / 180;
    }

    const pythagorasEquirectangular = (lat1, lon1, lat2, lon2) => {
        lat1 = deg2Rad(lat1);
        lat2 = deg2Rad(lat2);
        lon1 = deg2Rad(lon1);
        lon2 = deg2Rad(lon2);
        let R = 6371; // km
        let x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
        let y = (lat2 - lat1);
        return Math.sqrt(x * x + y * y) * R;
    }

    const nearestOffice = (latitude, longitude) => {
        let minDif = 99999;
        let closest;

        for (let i in officeLocations) {
            let dif = pythagorasEquirectangular(latitude, longitude, officeLocations[i]["lat"], officeLocations[i]["lng"]);
            if (dif < minDif) {
                closest = officeLocations[i];
                minDif = dif;
            }
        }

        return closest;
    }
    /*functions to calculate nearest office location END*/

    //function to set map location to nearest office location using user current location
    const setNearestLocation = async () => {
        const location = window.navigator && window.navigator.geolocation

        if(location){
            await location.getCurrentPosition((position)=>{
                let nearestLocation = nearestOffice(position.coords.latitude,position.coords.longitude)

                setCentreLocation({
                    lat : nearestLocation.lat,
                    lng : nearestLocation.lng,
                })
            })
        }
    }

    return (
        <div className="app">
            <Header title={'Splyt Test'} />

            {centreLocation ?
                <Map markers={markers} center={centreLocation} />
                : <></>
            }

            <div className="btn-container">
                {'Office Location(s) : '}
                <div className="btn-row">
                    {officeLocations.map((location, index) => (
                        <Button text={location.name} key={index} onClick={() => changeMapLocation(location)}/>
                    ))}

                    <Button text={'Nearest Office Location'} onClick={() => refreshMap()}/>
                </div>
            </div>

            <Slider
                title={'No of Taxi(s)'}
                count={count}
                min={5}
                max={20}
                onMouseUp={(event) => changeCount(event.target.value)}
                onKeyUp={(event) => changeCount(event.target.value)}
            />
        </div>
    );
}

export default App;
