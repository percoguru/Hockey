import Matter from "matter-js";
import Wall from '../wall';
import Constants from '../../../constants';

const handleTouches = (entities, {touches}) => {
  touches.filter(t => t.type === "move").forEach(t => {
    let player1 = entities["player1"]
    let player2 = entities["player2"]

    if(t.event.pageY < Constants.MAX_HEIGHT/2){
      if (player1 && player1.body.position) {
        Matter.Body.setPosition(player1.body, { x: player1.body.position.x + t.delta.pageX, y:  player1.body.position.y + t.delta.pageY } )
        }
    }
    else {
      if (player2 && player2.body.position) {
        Matter.Body.setPosition(player2.body, { x: player2.body.position.x + t.delta.pageX, y:  player2.body.position.y + t.delta.pageY } )
        }
    }
  })

  
    return entities;
};


const Physics = (entities, { touches, time, dispatch }) => {

  let engine = entities.physics.engine
  let world = entities.physics.world

  Matter.Engine.update(engine, time.delta)
  

  return entities;
};
  
export { Physics, handleTouches };