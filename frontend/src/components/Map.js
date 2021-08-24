import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { FaTaxi } from 'react-icons/fa'

const Marker = ({ text }) => {
    return (
        <div style={{ color: '#ff6b6b' }} > <FaTaxi /> {text}</div>
    )
}

class Map extends Component {
    static defaultProps = {
        zoom: 14
    };

    render() {
        return (
            <div style={{ height: '500px', width: '50%', minWidth: '630px'}}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyApdEObsZgl9LRipYvw_YYSh8X-DWHkg6w' }}
                    defaultCenter={this.props.center}
                    center={this.props.center}
                    defaultZoom={this.props.zoom}
                >

                    {this.props.markers.map((marker, index) => (
                        <Marker
                            key={index}
                            lat={marker.location.latitude}
                            lng={marker.location.longitude}
                            text={'#' + (index+1)}
                        />
                    ))}

                </GoogleMapReact>
            </div>
        );
    }
}

export default Map;