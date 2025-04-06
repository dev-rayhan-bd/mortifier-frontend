"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    GoogleMap,
    Marker,
    InfoWindow,
    DirectionsRenderer,
    useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "600px",
};

function Map() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAFDdENuKmGpQiN7NLZGp5Prw1VQ8hEcms",
        libraries: ["places", "geometry"],
    });

    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [distance, setDistance] = useState(null);
    const [directions, setDirections] = useState(null);
    // const [travelMode, setTravelMode] = useState("DRIVING");


    // Get your current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                    console.log("Your location:", { lat: latitude, lng: longitude });
                },
                (err) => console.error("Geolocation error:", err)
            );
        }
    }, []);

    // Fake users near you
    const users = [
        {
            name: "Alice",
            location: { lat: 23.7521, lng: 90.4320 },
            avatar: "https://i.pravatar.cc/150?img=1",
        },
        {
            name: "Bob",
            location: { lat: 23.7503, lng: 90.4305 },
            avatar: "https://i.pravatar.cc/150?img=2",
        },
        {
            name: "Charlie",
            location: { lat: 23.7518, lng: 90.4299 },
            avatar: "https://i.pravatar.cc/150?img=3",
        },
        {
            name: "Diana",
            location: { lat: 23.7532, lng: 90.4331 },
            avatar: "https://i.pravatar.cc/150?img=4",
        },
        {
            name: "Ethan",
            location: { lat: 23.7499, lng: 90.4318 },
            avatar: "https://i.pravatar.cc/150?img=5",
        },
    ];


    // Handle click on user marker
    const handleUserClick = (user) => {
        setSelectedUser(user);

        if (currentLocation && window.google?.maps?.geometry) {
            const yourLatLng = new window.google.maps.LatLng(
                currentLocation.lat,
                currentLocation.lng
            );
            const userLatLng = new window.google.maps.LatLng(
                user.location.lat,
                user.location.lng
            );

            // Calculate distance
            const distInMeters =
                window.google.maps.geometry.spherical.computeDistanceBetween(
                    yourLatLng,
                    userLatLng
                );
            const distInKm = (distInMeters / 1000).toFixed(2);
            setDistance(distInKm);

            // ✅ Fetch route
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: yourLatLng,
                    destination: userLatLng,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === "OK") {
                        setDirections(result);
                    } else {
                        console.error("Directions request failed due to " + status);
                    }
                }
            );
        }
    };


    const darkMapStyle = [
        {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "off"
                },
                {
                    "hue": "#0017ff"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#444444"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#f2f2f2"
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": "39"
                },
                {
                    "weight": "0.56"
                },
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "landscape.natural.landcover",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "hue": "#ff0000"
                }
            ]
        },
        {
            "featureType": "landscape.natural.terrain",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "color": "#ab4040"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "saturation": "-100"
                },
                {
                    "color": "#abd4a8"
                }
            ]
        },
        {
            "featureType": "poi.attraction",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi.attraction",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.government",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi.government",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.medical",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi.medical",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.place_of_worship",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi.place_of_worship",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.school",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi.school",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.sports_complex",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi.sports_complex",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 45
                },
                {
                    "color": "#b5c1b8"
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#8fc7cc"
                },
                {
                    "visibility": "on"
                }
            ]
        }
    ]

    const mapOptions = {
        styles: darkMapStyle,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        // disableAutoPan: true // Disable auto panning when opening info windows
    };


    return isLoaded && currentLocation ? (
        <div className=" mx-auto w-auto md:w-[500px] py-10">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentLocation}
                zoom={15}
                options={mapOptions}
            >
                {/* You (Blue dot) */}
                <Marker
                    position={currentLocation}
                    label={{
                        // text: "You",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: "bold",
                    }}
                    icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        scaledSize: new window.google.maps.Size(40, 40),
                    }}
                />

                {/* Other users */}
                {users.map((user, i) => (
                    <Marker
                        key={i}
                        position={user.location}
                        icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // change color or use a custom icon
                            scaledSize: new window.google.maps.Size(40, 40),
                        }}
                        onClick={() => handleUserClick(user)}
                        title={user.name}
                    />
                ))}

                {selectedUser && (
                    <InfoWindow
                        position={selectedUser.location}
                        onCloseClick={() => {
                            setSelectedUser(null);
                            setDistance(null);
                            setDirections(null);
                        }}
                    >
                        <div style={{
                            padding: "10px 12px",
                            borderRadius: "10px",
                            maxWidth: "200px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                            fontFamily: "'Segoe UI', sans-serif",
                            margin: 0,
                        }}>
                            <button
                                onClick={() => {
                                    setSelectedUser(null);
                                    setDistance(null);
                                    setDirections(null);
                                }}
                                style={{
                                    position: "absolute",
                                    top: "4px",
                                    right: "6px",
                                    background: "transparent",
                                    border: "none",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    color: "#888",
                                    marginRight: "5px",
                                }}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                            <div className=" flex items-center gap-2">
                                <Image
                                    src={selectedUser.avatar}
                                    alt={selectedUser.name}
                                    width={40}
                                    height={40}
                                    className="w-8"
                                    style={{
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                                    }}
                                />

                                <h4
                                    style={{
                                        margin: "0 0 4px 0",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#2C3E50",
                                    }}
                                >
                                    {selectedUser.name}
                                </h4>
                            </div>


                            <p
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    margin: "6px 0",
                                    fontSize: "13.5px",
                                    color: "#555",
                                }}
                            >
                                <span style={{ fontSize: "16px" }}>📍</span>
                                <span>
                                    {selectedUser.location.lat.toFixed(5)},{" "}
                                    {selectedUser.location.lng.toFixed(5)}
                                </span>
                            </p>

                            {distance && (
                                <p
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        margin: "6px 0 0",
                                        fontSize: "13.5px",
                                        fontWeight: "bold",
                                        color: "#0B8043",
                                    }}
                                >
                                    <span style={{ fontSize: "16px" }}>📏</span>
                                    <span>{distance} km away</span>
                                </p>
                            )}
                        </div>
                    </InfoWindow>
                )}
                {directions && <DirectionsRenderer directions={directions} />}

            </GoogleMap>
        </div>

    ) : (
        <p>Loading map and your location...</p>
    );

}

export default Map;
