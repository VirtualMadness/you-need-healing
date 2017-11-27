var MAP_WIDTH = 


//vscode-fold=1

//#region helpers

/**
 * Contiene un valor entre otros dos dados (mínimo y máximo) y devuelve el resultado
 * 
 * @param {number} val Valor a contener
 * @param {number} min Valor mínimo
 * @param {number} max Valor máximo
 * @returns {number} Valor resultado de la contención
 */
function clamp(val, min, max)
{
    return Math.max(min, Math.min(val, max));
}

/**
 * Interpola linealmente entre dos valores, inicial y objetivo, según un factor dado.
 * 
 * @param {number} val Valor inicial
 * @param {number} target Valor objetivo
 * @param {number} factor Factor de la aproximación (<0 -> undershoot, 0 -> valor inicial, 0.5 -> valor intermedio, 1 -> valor objetivo, >1 -> overshoot)
 * @returns {number} Resultado de la interpolación
 */
function lerp(val, target, factor)
{
    return val + (target - val) * factor;
}

/**
 * Interpola linealmente entre dos `Victor`, inicial y objetivo, según un factor dado.
 * 
 * @param {Victor} val 
 * @param {Victor} target 
 * @param {number} factor 
 * @returns {Victor} Resultado de la interpolación
 */
Victor.lerp = (val, target, factor) =>
{
    let a = target.subtract(val);
    let b = a.multiply(factor);
    let c = val.add(b);
    return c;
};

//#endregion

//#region enums

/**
 * Contenedor de valores. Se añaden así:
 * ```
 * Enum.Valor = new Enum("Valor")
 * ```
 * 
 * @class Enum
 */
class Enum
{
    constructor(name)
    {
        this.name = name;
        this.classname = "Enum";
    }

    toString()
    {
        return "${this.classname}.${this.name}";
    }
}

/**
 * Enum que contiene tipos de `Component`.
 * 
 * @class ComponentType
 * @extends {Enum}
 */
class ComponentType extends Enum
{
    /**
     * Clase/Enum que alberga los tipos de `Component`.
     * 
     * @param {string} name Nombre del `ComponentType` a crear.
     * @memberof ComponentType
     */
    constructor(name)
    {
        super(name);
        this.classname = "ComponentType";
    }
}
// ComponentTypes:
{
    ComponentType.Transform = new ComponentType("Transform");
    ComponentType.Kinematic = new ComponentType("Kinematic");
    ComponentType.Sprite = new ComponentType("Sprite");
    ComponentType.Collider = new ComponentType("Collider");
    ComponentType.Behaviour = new ComponentType("Behaviour");
    ComponentType.Input = new ComponentType("Input");
}


/**
 * Enum que contiene los tipos de `Collider`.
 * 
 * @class ColliderType
 * @extends {Enum}
 */
class ColliderType extends Enum
{
    /**
     * Clase/Enum que alberga los tipos de `Collider`.
     * 
     * @param {string} name Nombre del `ColliderType` deseado.
     * @memberof ColliderType
     */
    constructor(name)
    {
        super(name);
        this.classname = "ColliderType";
    }
}
// ColliderTypes:
{
    ColliderType.Rectangle = new ColliderType("Rectangle");
    ColliderType.Circle = new ColliderType("Circle");
}

/**
 * Enum que contiene los diferentes posibles estados de `Scene`
 * 
 * @class SceneState
 * @extends {Enum}
 */
class SceneState extends Enum
{
    /**
     * Clase/Enum que alberga los diferentes estados de reproducción de `Scene`.
     * 
     * @param {string} name Nombre del `SceneState` deseado.
     * @memberof sceneState
     */
    constructor(name)
    {
        super(name);
        this.classname = "SceneState";
    }
}

// SceneStates:
{
    SceneState.Play = new SceneState("Play");
    SceneState.Pause = new SceneState("Pause");
    SceneState.Step = new SceneState("Step");
}

//#endregion

//#region component

/**
 * Clase base para el resto de componentes, almacena la entidad a la que está asociado
 * 
 * @class Component
 */
class Component
{
    /**
     * Crea una instancia de `Component`.
     * @param {Entity} entity Entidad a la que el componente está asociado
     * @memberof Component
     */
    constructor(entity)
    {
        this.entity = entity;
    }

    clone(entity = this.entity)
    {
        return new Component(entity);
    }
}


//#endregion

//#region entities
/**
 * Agente base del motor, contiene componentes (```Component```).
 * 
 * @class Entity
 */
class Entity
{
    /**
     * Crea una instancia de `Entity`.
     * 
     * @param {string} id Cadena de identificación de la entidad dentro de la escena.
     * @param {Entity} parent Entidad padre. Se utiliza para situar la entidad en la escena.
     * @param {Transform} transform Transformación inicial de la entidad.
     * @memberof Entity
     */
    constructor(id, parent, transform = new Transform())
    {
        this.components = new Map();
        this.parent = parent;
        this.id = id;
        this.addComponent(transform);
    }
    
    /**
     * Devuelve una copia por valor de la entidad, con los mismos componentes y valores.
     * 
     * @returns {Entity} Copia de esta entidad.
     * @memberof Entity
     */
    clone()
    {
        let e = new Entity(this.id, this.parent);
        this.components.forEach((c)=>
        {
            e.addComponent(c.clone(e));
        });
        return e;
    }

    /**
     * Añade un componente a la entidad.
     * 
     * @param {Component} component Componente a añadir.
     * @returns {ComponentType} Devuelve el tipo de componente (`ComponentType`) añadido.
     * @memberof Entity
    */
    addComponent(component)
    {
        component.entity = this;
        this.components.set(component.type, component);
        return component.type;
    }

    /**
     * Elimina un componente de la entidad.
     * 
     * @param {ComponentType} type Tipo del componente.
     * @returns {boolean} Devuelve `true` si el componente se ha podido eliminar y `false` de lo contrario o si no existe.
     * @memberof Entity
     */
    removeComponent(type)
    {
        return this.components.delete(type);
    }
    
    /**
     * Devuelve el componente del tipo especificado de la entidad, o `null` si no lo tiene.
     * 
     * @param {ComponentType} type 
     * @returns {Component} Componente deseado o `null`.
     * @memberof Entity
     */
    getComponent(type)
    {
        return this.components.get(type);
    }

    update(dt)
    {
        let kinematic = this.getComponent(ComponentType.Kinematic);

        if (kinematic != null)
        {
            kinematic.update(dt);
        }
    }

    render(ctx)
    {
        let sprite = this.getComponent(ComponentType.Sprite);

        if (sprite != null)
        {
            sprite.render(ctx);
        }
    }

    toJSON()
    {
        let c = new Array();
        
        this.components.forEach(function(comp) {
            c.push(comp.toJSON());
        }, this);

        return c;
    }
}
//#endregion

//#region physics
/**
 * Almacena la posición, rotación y escala local del objeto respecto a su padre inmediato.
 * 
 * @class Transform
 * @extends {Component}
 */
class Transform extends Component
{
    /**
     * Crea una instancia de `Transform`.
     * @param {Entity} entity Entidad (`Entity`) a la que pertenece el componente.
     * @param {Victor} position Posición inicial.
     * @param {number} rotation Rotación inicial.
     * @param {Victor} scale Escala inicial.
     * @memberof Transform
     */
    constructor(entity, position = new Victor(0, 0), rotation = 0, scale = new Victor(1, 1))
    {
        super(entity);

        this.position = position;
        this.rotation = rotation;
        this.scale = scale;

        /*this.g_position = new Victor(0, 0);
        this.g_rotation = 0;
        this.g_scale = new Victor(1, 1);
        this.g_flag = false;*/

        this.type = ComponentType.Transform;
    }

    /**
     * Devuelve una copia de este componente (`Transform`) con los mismos valores.
     * 
     * @param {Entity} entity Entidad a la que el nuevo `Transform` estará asociado.
     * @returns {Transform} Copia del componente `Transform`.
     * @memberof Transform 
     */
    clone(entity = this.entity)
    {
        return new Transform(entity, this.position.clone(), this.rotation, this.scale.clone());
    }

    /**
     * Mueve la posición actual.
     * 
     * @param {Victor} vec Vector que se suma a la posición actual.
     * @memberof Transform
     */
    translate(vec)
    {
        this.position.add(vec);
        this.g_flag = false;
    }

    /**
     * Suma grados a la rotación actual.
     * 
     * @param {number} deg Número de grados a rotar.
     * @memberof Transform
     */
    rotate(deg)
    {
        this.rotation = (this.rotation + deg) % 360;
        this.g_flag = false;
    }

    /**
     * Multiplica la escala actual.
     *
     * @param {Victor} vec Vector por el que se multiplica la escala actual.
     * @memberof Transform
     */
    scale(vec)
    {
        this.scale.multiply(vec);
        this.g_flag = false;
    }


    /**
     * Devuelve un string con la información básica del `Transform`.
     * 
     * @returns {string} Cadena con información.
     * @memberof Transform
     */
    toString()
    {
        let s = "transform:\n\t· position: " + this.position.toString() + "\n\t· rotation: " + this.rotation + "\n\t· scale: " + this.scale.toString();
        return s;
    }

    /**
     * Devuelve un objeto con la información básica del `Transform`.
     * 
     * @returns {Object} Objeto con información.
     * @memberof Transform
     */
    toJSON()
    {
        let o = 
        {
            type: "Transform",
            data:
            {
                position: 
                {
                    x: this.position.x, 
                    y: this.position.y,
                },
                rotation: this.rotation,
                scale:
                {
                    x: this.scale.x,
                    y: this.scale.y
                }
            }
        };

        return o;
    }    

    getFlag()
    {
        if (this.entity.parent == null)
            return this.g_flag;
        else
            return this.g_flag && this.entity.parent.getComponent(ComponentType.Transform).getFlag();
        
    }    

    // #region getters & setters
    setPosition(pos)
    {
        this.position = pos;
    }

    
    getPosition()
    {
        return this.position;
    }


    setRotation(rot)
    {
        this.rotation = rot;
    }

    getRotation()
    {
        return this.rotation;
    }


    setScale(pos)
    {
        this.scale = pos;
    }

    getsScale()
    {
        return this.scale;
    }
    // #endregion
}

/**
 * Almacena y actualiza la velocidad, aceleración y fricción, y modifica el componente `Transform`
 * de la `Entity` al que pertenece.
 *
 * @class Kinematic
 * @extends {Component}
 */
class Kinematic extends Component
{

    constructor(entity, spd = new Victor(), acc = new Victor(), frc = new Victor(1, 1))
    {
        super(entity);
        this.transform = this.entity.getComponent(ComponentType.Transform);

        this.speed = spd;
        this.acceleration = acc;
        this.friction = frc;

        this.type = ComponentType.Kinematic;
    }

    /**
     * Devuelve una copia de este componente `Kinematic`, con los mismos valores.
     * 
     * @param {Entity} entity Entidad a la que el nuevo `Kinematic` estará asociado.
     * @returns {Kinematic} Copia del componente `Kinematic` 
     * @memberof Kinematic 
     */
    clone(entity = this.entity)
    {
        return new Kinematic(entity, this.speed.clone(), this.acceleration.clone(), this.friction.clone());
    }

    setAcceleration(acc)
    {
        this.acceleration = acc;
    }

    applyAcceleration(dt)
    {
        this.speed.add(this.acceleration.clone().multiply(Victor(dt, dt)));
    }

    applyFriction(dt)
    {
        this.speed = Victor.lerp(this.speed, Victor(0, 0), this.friction.clone().multiply(Victor(dt, dt)));
    }

    move(dt)
    {
        if(this.speed.x != 0 || this.speed.y != 0)
        {
            this.transform.translate(this.speed.clone().multiply(Victor(dt, dt)));
        }
    }

    update(dt)
    {
        this.move(dt);
        this.applyAcceleration(dt);
        //this.applyFriction(dt);
    }

    toJSON()
    {
        let o = 
        {
            type: "Kinematic",
            data:
            {
                speed: 
                {
                    x: this.speed.x, 
                    y: this.speed.y
                },
                acceleration: 
                {
                    x: this.acceleration.x, 
                    y: this.acceleration.y
                },
                friction:
                {
                    x: this.friction.x,
                    y: this.friction.y
                }
            }
        };

        return o;
    }
}


/**
 * Almacena la forma de colisión de la `Entity` y comprueba colisiones con otros colliders.
 * 
 * @class Collider
 * @extends {Component}
 */
class Collider extends Component
{
    constructor(entity)
    {
        super(entity);

        this.type = ComponentType.Collider;
    }

    /**
     * Devuelve una copia de este componente `Collider`, con los mismos valores.
     * 
     * @param {Entity} entity Entidad a la que el nuevo `Collider` estará asociado.
     * @returns {Collider} Copia del componente `Collider`.
     * @memberof Collider 
     */
    clone(entity = this.entity)
    {
        return new Collider(entity);
    }
}

class RectCollider extends Collider
{
    /**
     * Crea una entidad de `RectCollider`.
     * 
     * @param {Entity} entity Entidad (`Entity`) a la que pertenece el componente.
     * @param {number} width Anchura en píxeles del rectángulo de colisión (`RectCollider`).
     * @param {number} height Altura en píxeles del rectángulo de colisión (`RectCollider`).
     * @param {Victor} origin Distancia que se resta del centro de la entidad (`Entity`) para hacer cálculos con el rectángulo de colisón (`RectCollider`).
     * @memberof RectCollider
     */
    constructor(entity, width, height, origin)
    {
        super(entity);

        this.width = width;
        this.height = height;
        this.origin = origin;

    }
    /**
     * Comprueba la colisión con otro `Collider`
     * 
     * @param {Collider} other 
     * @memberof RectCollider
     */
    checkCollision(other)
    {

    }


}
//#endregion

//#region graphics
/**
 * Renderiza una serie de sprites
 * 
 * @class Sprite
 * @extends {Component}
 */
class Sprite extends Component
{
    /**
     * Creates an instance of Sprite.
     *
     * @param {Entity} entity 
     * @param {string[]} src 
     * @param {Victor} origin
     * @param {number} z_order
     * @memberof Sprite
     */
    constructor(entity, src, origin = new Victor(0, 0), z_order = 0)
    {
        super(entity);

        this.origin = origin;
        this.z_order = z_order;
        this.src = src;
        this.image = new Image();
        this.image.src = src;

        this.type = ComponentType.Sprite;

    }

    clone(entity = this.entity)
    {
        return new Sprite(entity, this.src, this.origin.clone(), this.z_order);
    }

    render(ctx)
    {
        let transform = this.entity.getComponent(ComponentType.Transform);
        let pos = transform.position;

        //ctx.rotate(transform.rotation*Math.PI/180);
        ctx.drawImage(this.image, 0, 0, 
            this.image.width, this.image.height, 
            pos.x - this.origin.x, pos.y - this.origin.y, 
            this.image.width*transform.scale.x, this.image.height*transform.scale.y);
        //ctx.restore();
    }

    toJSON()
    {
        let o = 
        {
            type: "Sprite",
            data:
            {
                src: this.src,
                center: 
                {
                    x: this.center.x, 
                    y: this.center.y
                },
                z_order: this.z_order
            }
        };

        return o;
    }
}


//#endregion

//#region input
class BaseInput
{
    constructor()
    {
        this.haxis = 0;
        this.vaxis = 0;
        this.fire = 0;
        this.start = 0;

        this.type = ComponentType.Input;
    }

    /**
     * Actualiza los valores del Input
     * 
     * @memberof BaseInput
     */
    update()
    {
        this.haxis = 0;
        this.vaxis = 0;
        this.fire = 0;
        this.start = 0;
    }

    getHAxis()
    {
        return this.haxis;
    }

    getVAxis()
    {
        return this.vaxis;
    }

    getFire()
    {
        return this.fire1;
    }

    getStart()
    {
        return this.start;
    }
}

class KeyboardInput extends BaseInput
{
    constructor()
    {
        super();
    }


}

class MouseInput extends BaseInput
{

}
//#endregion

//#region scene
class Scene
{
    constructor(name)
    {
        this.entities = new Map();

        this.movables = new Map();
        this.collisionables = new Map();
        this.renderizables = new Map();

        this.name = name;
        this.running = SceneState.Pause;
    }

    addEntity(entity)
    {
        this.entities.set(entity.id, entity);

        this.addToRun(entity);
    }

    addToRun(entity)
    {
        let new_e = entity.clone();
        
        if(new_e.getComponent(ComponentType.Collider) != null)
        {
            this.collisionables.set(new_e.id, new_e);
        }

        if(new_e.getComponent(ComponentType.Sprite) != null)
        {
            this.renderizables.set(new_e.id, new_e);
        }

        if(new_e.getComponent(ComponentType.Kinematic) != null)
        {
            this.movables.set(new_e.id, new_e);
        }
    }

    reset()
    {
        // Resetea los mapas
        this.collisionables = new Map();
        this.collisionables = new Map();
        this.collisionables = new Map();

        // Añade de nuevo las entidades
        this.entities.forEach((e)=>
        {
            this.addToRun(e);
        });
    }

    play()
    {
        this.running = SceneState.Play;
    }
    
    pause()
    {
        this.running = SceneState.Pause;
    }
    
    step()
    {
        this.running = SceneState.Step;
    }
    
    start()
    {
        this.reset();
        this.play();
    }

    stop()
    {
        this.reset();
        this.pause();
    }

    update(dt)
    {
        if(this.running == SceneState.Play)
        {
            this.movables.forEach(function(e)
            {
                e.update(dt);
            }, this);
        }
        else if(this.running == SceneState.Step)
        {
            this.movables.forEach(function(e)
            {
                e.update(dt);
            }, this);
            
            this.pause();
        }
    }

    render(ctx)
    {
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        let w = ctx.canvas.width;
        let h = ctx.canvas.height;
        ctx.clearRect(0, 0, w, h);
        this.renderizables.forEach(function(e)
        {
            e.render(ctx);
        }, this);
    }    
}
//#endregion

// La siguiente linea desactiva algunos errores de librería que saca el linter
/*global Victor console $ saveAs*/
