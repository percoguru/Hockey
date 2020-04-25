import Matter from "matter-js";
import Wall from '../wall';
import Constants from '../../../constants';

// let boxIds = 0;
// const CreateBox = (entities, { touches, screen }) => {
    // let world = entities["physics"].world;
    // let boxSize = Math.trunc(Math.max(screen.width, screen.height) * 0.075);
    // touches.filter(t => t.type === "press").forEach(t => {
    //         let body = Matter.Bodies.rectangle(
    //                    t.event.pageX, t.event.pageY, 
    //                    boxSize, boxSize,
    //                    { frictionAir: 0.021 });
    //         Matter.World.add(world, [body]);
    //             entities[++boxIds] = {
    //                 body: body,
    //                 size: [boxSize, boxSize],
    //                 color: boxIds % 2 == 0 ? "pink" : "#B8E986",
    //                 renderer: Wall
    //             };
    //          });
    // return entities;
// };

const Physics = (entities, { touches, time, dispatch }) => {

  let engine = entities.physics.engine
  let world = entities.physics.world


  Matter.Engine.update(engine, time.delta)
  

  return entities;
};
  
export { Physics};