'use client'
import React, { useState } from "react";
import VehicleSlider from "./VehicleSlider";
import AuthModel from "./AuthModel";
import HeroSection from "./HeroSection";

function PublicHome() {
    const [authOpen,setAuthOpen]=useState(false)

    return (
        <>
            <HeroSection/>
            <VehicleSlider/>
            <AuthModel open={authOpen} onClose={()=>setAuthOpen(false)}/>
        </>
    )
}

export default PublicHome