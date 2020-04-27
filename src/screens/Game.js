import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import Matter, { Constraint } from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Ball from '../components/ball';
import Constants from '../../constants'

import Wall from '../components/wall'
import Player from '../components/player'
import Images from '../../assets/Images';
import Block from '../components/block';

import { Physics, handleTouches } from '../components/systems/Physics';



export default class Game extends Component {
    constructor(props){
        super(props);

        this.state = {
            running: false,
            score1: 0,
            score2: 0,
            welcome: true,
            paused: false,
            winner: false,
            end: false
        };



        this.gameEngine = null;

        this.entities = this.setupWorld();

        this.successReset = () => {
            Matter.Body.setPosition(this.entities.puck.body, {x: Constants.MAX_WIDTH/2, y: Constants.MAX_HEIGHT/2})
            Matter.Body.setPosition(this.entities.player1.body, { x:Constants.MAX_WIDTH/2, y: 210 })
        }

        this.reset = () => {
            this.setState({
                running: true,
                end: false
            })
            Matter.Body.setPosition(this.entities.puck.body, {x: Constants.MAX_WIDTH/2, y: Constants.MAX_HEIGHT/2})
        }

        this.resume = () => {
            this.setState({
                running: true,
                paused: false
            })
            Matter.Body.setPosition(this.entities.puck.body, {x: Constants.MAX_WIDTH/2, y: Constants.MAX_HEIGHT/2})
            Matter.Body.setVelocity(this.entities.puck.body, {x: Math.floor(Math.random() * (20 - 10 + 1) + 10), y: Math.floor(Math.random() * (20 - 10 + 1) + 10)})
        }
        
    }

    setupWorld = () => {
        let engine = Matter.Engine.create({ enableSleeping: false })
        let world = engine.world
        let gap_size = Constants.GAP_SIZE
        let width = Constants.MAX_WIDTH
        let height = Constants.MAX_HEIGHT

        world.gravity.y = 0.0

        let bottom_goal_left = Matter.Bodies.rectangle(
            (width - gap_size)/4, height - 50, (width - gap_size)/2, 20, { isStatic: true }
        )

        let bottom_goal_right = Matter.Bodies.rectangle(
            width - (width - gap_size)/4, height - 50, (width - gap_size)/2, 20, { isStatic: true }
        )

        let wallLeft = Matter.Bodies.rectangle(
            -95, height/2, 200, height-100, { isStatic: true } 
        )

        let wallRight = Matter.Bodies.rectangle(
            width+95, height/2, 200, height-100, { isStatic: true} 
        )

        let top_goal_left = Matter.Bodies.rectangle(
            (width - gap_size)/4, 50, (width - gap_size)/2, 20, { isStatic: true }
        )

        let top_goal_right = Matter.Bodies.rectangle(
            width - (width - gap_size)/4, 50, (width - gap_size)/2, 20, { isStatic: true }
        )

        let top_boundary = Matter.Bodies.rectangle(
            width/2, -10, 10000, 20, {
                label: "successBoundary",
                isStatic: true
            }
        )

        let bottom_boundary = Matter.Bodies.rectangle(
            width/2, height, 10000, 20, {
                label: "failBoundary",
                isStatic: true
            }
        )

        let puck = Matter.Bodies.circle(
        width/2, height/2, 20, {
            inertia: 0,
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0.00,
            restitution: 1,
            label: "puck"
          }
        )

        let player1 = Matter.Bodies.circle(
            width/2, 100, 45, { label: "player1"} 
        )
        let player2 = Matter.Bodies.circle(
            width/2, height - 100, 45, {
                label: "player2"
            }
        )

        let topLeftWall = Matter.Bodies.rectangle(
            -50, 50, 40, height/2, { isStatic: true, label: "successBoundary"}
        )

        let topRightWall = Matter.Bodies.rectangle(
            width + 50, 50, 20, height/2, { isStatic: true, label: "successBoundary"}
        ) 

        let bottomLeftWall = Matter.Bodies.rectangle(
            -50, height - 50, 20, height/2, { isStatic: true, label: "failBoundary"}
        )
        
        let bottomRightWall = Matter.Bodies.rectangle(
            width + 100, height - 50, 20, height/2, { isStatic: true, label: "failBoundary"}
        )


        Matter.World.add(world, [bottom_goal_left, bottom_goal_right, top_goal_left, top_goal_right, wallLeft, wallRight, puck, player2, player1, top_boundary, bottom_boundary, topLeftWall, topRightWall, bottomLeftWall, bottomRightWall]);
      
        Matter.Body.setVelocity(puck, {x: Math.floor(Math.random() * (20 - 10 + 1) + 10), y:Math.floor(Math.random() * (20 - 10 + 1) + 10)})
        
        Matter.Events.on(engine, 'collisionStart', (event) => {
            var pairs = event.pairs;
            var objA = pairs[0].bodyA.label;
            var objB = pairs[0].bodyB.label;

            if((objA === "puck" && (objB=== "player1" || objB === "player2"))  || ( ( objA === "player1" || objA === "player2" )  && objB === "puck") )
            {
                
                if(objA === "player1" || objB === "player1")
                   {
                    Matter.Body.setVelocity(player1, {x: 0, y: 0})
                    Matter.Body.setVelocity(puck, {x: - (puck.velocity.x+5), y: -(puck.velocity.y+5)})
                   } 

                else{
                    Matter.Body.setVelocity(player2, {x: 0, y: 0})
                    Matter.Body.setVelocity(puck, {x: - (puck.velocity.x+5), y: -(puck.velocity.y+5)})
                }
                
            }

            if((objA === "successBoundary" && objB === "puck" )|| (objB === "succesBoundary" && objA === "puck")){
                if(this.state.running)
                this.setState({
                    score2: this.state.score2 + 1,
                    paused: true,
                    running: false
                })
                if(this.state.score2 === 6)
                {
                    this.setState({
                        winner: "White",
                        score1: 0,
                        score2: 0,
                        running: false,
                        paused: true,
                        end: true
                    })
                }
                Matter.Body.setPosition(this.entities.puck.body, {x: Constants.MAX_WIDTH/2, y: Constants.MAX_HEIGHT/2})
                Matter.Body.setVelocity(this.entities.puck.body, {x: 0, y: 0})
            }

            if((objA === "failBoundary" && objB === "puck" )|| (objB === "failBoundary" && objA === "puck")){
                if(this.state.running)
                this.setState({
                    score1: this.state.score1 + 1,
                    paused: true,
                    running: false
                })
                if(this.state.score1 === 6)
                {
                    this.setState({
                        winner: "Red",
                        score1: 0,
                        score2: 0,
                        running: false,
                        paused: true,
                        end: true
                    })
                }
                Matter.Body.setPosition(this.entities.puck.body, {x: Constants.MAX_WIDTH/2, y: Constants.MAX_HEIGHT/2})
                Matter.Body.setVelocity(this.entities.puck.body, {x: 0, y: 0})

            }



        });


    
        return {
            physics: { engine: engine, world: world },
            bottom_goal_left: {body: bottom_goal_left,size: [(width - gap_size)/2, 5], color: 'white', renderer: Wall},
            bottom_goal_right: {body: bottom_goal_right,size: [(width - gap_size)/2, 5], color: 'white', renderer: Wall},
            top_goal_left: {body: top_goal_left, size: [(width - gap_size)/2, 5], color: 'white', renderer: Wall},
            top_goal_right: {body: top_goal_right, size: [(width - gap_size)/2, 5], color: 'white', renderer: Wall},
            wallRight: {body: wallRight, size: [200, height-100], color: 'white', renderer: Wall},
            wallLeft: {body: wallLeft, size: [200, height-100], color: 'white', renderer: Wall},
            puck: {body: puck, radius: 20, color: '#F7EF64', label: "puck", renderer: Ball},
            player1: {body: player1, radius: 45, color: '#ff756D', text: 0, label: "player1", renderer: Player},
            player2: {body: player2, radius: 45, color: '#DEF3FD', label: "player2", text: 0,renderer: Player},
            top_boundary: {body: top_boundary, size: [1000, 20], color: "#ebeb34", renderer: Wall},
            bottom_boundary: {body: bottom_boundary, size: [1000, 20], color: "black", renderer: Wall},
            bottomLeftWall: {body: bottomLeftWall, size: [20, height/2], renderer: Wall},
            topLeftWall: {body: topLeftWall, size: [20, height/2], renderer: Wall},
            bottomRightWall: {body: bottomRightWall, size: [20, height/2], renderer: Wall},
            bottomRightWall: {body: bottomRightWall, size: [20, height/20], renderer: Wall}
        }
    }



    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
                {/* <TouchableOpacity onPress={this.pause}>
                <View style={styles.pauseButton}>
                    <Text style={styles.buttonText}>I I</Text>
                </View>
                </TouchableOpacity> */}
                <GameEngine
                    ref={(ref) => { this.gameEngine = ref; }}
                    style={styles.gameContainer}
                    systems={[Physics, handleTouches]}
                    running={this.state.running}
                    onEvent={this.handleCollision}
                    entities={this.entities}>
                    {/* <StatusBar hidden={true} /> */}
                </GameEngine>
                <Text style={styles.score1}>{this.state.score1}</Text>
                <Text style={styles.score2}>{this.state.score2}</Text>
                {/* {!this.state.running && !this.state.welcome && <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
                    <View style={styles.fullScreen}>
                        <Text style={styles.gameOverText}>Game Over</Text>
                        <Text style={styles.gameOverSubText}>Try Again</Text>
                    </View>
                </TouchableOpacity>} */}
                {this.state.paused && !this.state.end && !this.state.running && <TouchableOpacity style={styles.fullScreenButton} onPress={this.resume}>
                    <View style={styles.fullScreen}>
                        <Text style={styles.gameOverText}>Scored!!</Text>
                        <Text style={styles.gameOverSubText}>Resume</Text>
                    </View>
                </TouchableOpacity>}
                {!this.state.paused && !this.state.running && this.state.welcome && <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
                    <View style={styles.fullScreen}>
                        <Text style={styles.gameOverText}>Welcome</Text>
                        <Text style={styles.gameOverSubText}>Start</Text>
                    </View>
                </TouchableOpacity>}
                {this.state.end && this.state.welcome && <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
                    <View style={styles.fullScreen}>
                        <Text style={styles.gameOverText}>{this.state.winner} Wins</Text>
                        <Text style={styles.gameOverSubText}>Play Again</Text>
                    </View>
                </TouchableOpacity>}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b4d7a2',
    },
    backgroundImage: {
        position: 'absolute',
        top: 50,
        bottom: 50,
        left: 0,
        right: 0,
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_HEIGHT - 100
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    gameOverText: {
        color: 'white',
        fontSize: 48,
        // fontFamily: '04b_19'
    },
    gameOverSubText: {
        color: 'white',
        fontSize: 24,
        // fontFamily: '04b_19'
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    score2: {
        position: 'absolute',
        color: 'white',
        fontSize: 50,
        top: Constants.MAX_HEIGHT/2 + 50,
        left: 10,
        textShadowColor: '#444444',
        textShadowOffset: { width: 2, height: 2},
        textShadowRadius: 2,
        // fontFamily: '04b_19'
    },
    score1: {
        position: 'absolute',
        color: 'white',
        fontSize: 50,
        top: Constants.MAX_HEIGHT/2 - 100,
        left: 10,
        textShadowColor: '#444444',
        textShadowOffset: { width: 2, height: 2},
        textShadowRadius: 2,
        // fontFamily: '04b_19'
    },
    fullScreenButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1
    },
    pauseButton: {
        top: 40,
        left: 20,
        height: 40,
        width: 40,
        textAlign: "center",
        backgroundColor: 'yellow',
        alignContent: "center",
        fontWeight: "bold",
        borderRadius: 4
    },
    buttonText: {
        top: 10,
        left: 15
    }
});