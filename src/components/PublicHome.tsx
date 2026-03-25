'use client'
import React, { useState } from "react";
import VechicleSlider from "./VechicleSlider";
import AuthModel from "./AuthModel";
import HeroSection from "./HeroSection";

function PublicHome() {
    const [authOpen,setAuthOpen]=useState(false)

    return (
        <>
            <HeroSection/>
            <VechicleSlider/>
            <AuthModel open={authOpen} onClose={()=>setAuthOpen(false)}/>
        </>
    )
}

export default PublicHome