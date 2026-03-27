import React, { useEffect, useRef } from 'react'
import * as THREE from "three"
import { Canvas, useThree } from '@react-three/fiber'
import {  useGLTF, useTexture, useAnimations } from '@react-three/drei'
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const Dog = () => {


    gsap.registerPlugin(useGSAP())
    gsap.registerPlugin(ScrollTrigger)


    const model = useGLTF("/models/dog.drc.glb")

    useThree(({ camera, gl }) => {
        camera.position.z = 0.55
        gl.toneMapping = THREE.ReinhardToneMapping
        gl.outputColorSpace = THREE.SRGBColorSpace
    })

    const { actions } = useAnimations(model.animations, model.scene)

    useEffect(() => {
        actions[ "Take 001" ].play()
    }, [ actions ])



    const [ normalMap, sampleMatCap ] = (useTexture([ "/dog_normals.jpg", "/matcap/mat-2.png" ]))
        .map(texture => {
            texture.flipY = false
            texture.colorSpace = THREE.SRGBColorSpace
            return texture
        })

    const [ branchMap, branchNormalMap ] = (useTexture([ "/branches_diffuse.jpeg", "branches_normals.jpeg" ]))
        .map(texture => {
            texture.colorSpace = THREE.SRGBColorSpace
            return texture
        })

    const dogMaterial = new THREE.MeshMatcapMaterial({
        normalMap: normalMap,
        matcap: sampleMatCap
    })

    const branchMaterial = new THREE.MeshMatcapMaterial({
        normalMap: branchNormalMap,
        map: branchMap
    })


    model.scene.traverse((child) => {
        if (child.name.includes("DOG")) {
            child.material = dogMaterial
        } else {
            child.material = branchMaterial
        }
    })

    const dogModel = useRef(model)


    useGSAP(() => {

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#section-1",
                endTrigger: "#section-3",
                start: "top top",
                end: "bottom bottom",
                markers: true,
                scrub: true
            }
        })

        tl
            .to(dogModel.current.scene.position, {
                z: "-=0.75",
                y: "+=0.1"
            })
            .to(dogModel.current.scene.rotation, {
                x: `+=${Math.PI / 15}`
            })
            .to(dogModel.current.scene.rotation, {
                y: `-=${Math.PI}`,
                
            }, "third")
            .to(dogModel.current.scene.position, {
                x: "-=0.5",
                z:"+=0.6",
                y:"-=0.05"
            }, "third")

    }, [])



    return (
        <>
            <primitive object={model.scene} position={[ 0.25, -0.55, 0 ]} rotation={[ 0, Math.PI / 3.9, 0 ]} />
            <directionalLight position={[ 0, 5, 5 ]} color={0xFFFFFF} intensity={10} />
        </>
    )
}

export default Dog