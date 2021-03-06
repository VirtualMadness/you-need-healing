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

function shortAngleDist(a0,a1) {
    var max = 360;
    var da = (a1 - a0) % max;
    return 2*da % max - da;
}

function lerpAngle(val, target, factor)
{
    return val + shortAngleDist(val, target) * factor;
}

Victor.reflect = (dir, normal) =>{
    normal = normal.normalize();
    dir = dir.normalize();

    //normal component
    var velN = normal.multiply(dir.dot(normal));
    //tangential component
    var velT = dir.subtract(velN);
    //reflected vetor
    var ref = velT.subtract(velN);
    return ref;
};

function reflect(dir, normal){
    normal = normal.normalize();

    //normal component
    var velN = Victor(normal.x * dir.dot(normal), normal.y * dir.dot(normal));
    //tangential component
    var velT = dir.subtract(velN);
    //reflected vetor
    var ref = velT.subtract(velN);
    return ref;
}

function rayCollision(dir, ori, minCorner, maxCorner){
    let dirfrac = Victor(1, 1).divide(dir);

    let t = 0;
    let t1 = (minCorner.x - ori.x)* dirfrac.x;
    let t2 = (maxCorner.x - ori.x)* dirfrac.x;
    let t3 = (minCorner.y - ori.y)* dirfrac.y;
    let t4 = (maxCorner.y - ori.y)* dirfrac.y;

    let tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    let tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

    // if tmax < 0, ray (line) is intersecting AABB, but the whole AABB is behind us
    if (tmax < 0)
    {
        t = tmax;
        return [false, null];
    }

    // if tmin > tmax, ray doesn't intersect AABB
    if (tmin > tmax)
    {
        t = tmax;
        return [false, null];
    }
    t = tmin;
    let normal = Victor(0, 0);
    if (t == t1)
        normal = Victor(-1, 0); /* left */
    if (t == t2)
        normal = Victor(1, 0); /* right */
    if (t == t3)
        normal = Victor(0, -1); /* bottom */
    if (t == t4)
        normal = Victor(0,  1); /* top */
    return [true, normal];
}

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
    ComponentType.Default = new ComponentType("Default");
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

class BehaviourType extends Enum
{
    /**
     * Clase/Enum que alberga los tipos de `Behaviour`.
     *
     * @param {string} name Nombre del `BehaviourType` deseado.
     * @memberof BehaviourType
     */
    constructor(name)
    {
        super(name);
        this.classname = "BehaviourType";
    }
}
// ColliderTypes:
{
    BehaviourType.Create = new BehaviourType("Create");
    BehaviourType.Update = new BehaviourType("Update");
    BehaviourType.Destroy = new BehaviourType("Destroy");
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

class Layer extends Enum
{
    /**
     * Clase/Enum que alberga las diferentes capas.
     *
     * @param {string} name Nombre de `Layer`.
     * @memberof Layer
     */
    constructor(name)
    {
        super(name);
        this.classname = "Layer";
    }
}

// Layers
{
    Layer.Background = new Layer("Background");
    Layer.Default = new Layer("Default");
    Layer.UI = new Layer("UI");
}

class KeyCode extends Enum
{
    /**
     * Clase/Enum que alberga lcos códigos de teclas.
     *
     * @param {string} name Nombre del `KeyCode`.
     * @memberof KeyCode
     */
    constructor(name, code)
    {
        super(name);
        this.classname = "KeyCode";
        this.code = code;
    }
}

// KeyCodes
const KeyCodes = new Array(

    // Letras
    KeyCode.A = new KeyCode("A", 65),
    KeyCode.B = new KeyCode("B", 66),
    KeyCode.C = new KeyCode("C", 67),
    KeyCode.D = new KeyCode("D", 68),
    KeyCode.E = new KeyCode("E", 69),
    KeyCode.F = new KeyCode("F", 70),
    KeyCode.G = new KeyCode("G", 71),
    KeyCode.H = new KeyCode("H", 72),
    KeyCode.I = new KeyCode("I", 73),
    KeyCode.J = new KeyCode("J", 74),
    KeyCode.K = new KeyCode("K", 75),
    KeyCode.L = new KeyCode("L", 76),
    KeyCode.M = new KeyCode("M", 77),
    KeyCode.N = new KeyCode("N", 78),
    KeyCode.Ñ = new KeyCode("Ñ", 192),
    KeyCode.O = new KeyCode("O", 79),
    KeyCode.P = new KeyCode("P", 80),
    KeyCode.Q = new KeyCode("Q", 81),
    KeyCode.R = new KeyCode("R", 82),
    KeyCode.S = new KeyCode("S", 83),
    KeyCode.T = new KeyCode("T", 84),
    KeyCode.U = new KeyCode("U", 85),
    KeyCode.V = new KeyCode("V", 86),
    KeyCode.W = new KeyCode("W", 87),
    KeyCode.X = new KeyCode("X", 88),
    KeyCode.Y = new KeyCode("Y", 89),
    KeyCode.Z = new KeyCode("Z", 90),

    // Teclas especiales
    KeyCode.Tab = new KeyCode("Tab", 9),
    KeyCode.Enter = new KeyCode("Enter", 13),
    KeyCode.Shift = new KeyCode("Shift", 16),
    KeyCode.Control = new KeyCode("Control", 17),
    KeyCode.Alt = new KeyCode("Alt", 18),
    KeyCode.CapsLock = new KeyCode("CapsLock", 20),
    KeyCode.Escape = new KeyCode("Escape", 27),
    KeyCode.Space = new KeyCode("Space", 32),

    // Números
    KeyCode.NumStrip_0 = new KeyCode("NumStrip_0", 48),
    KeyCode.NumStrip_1 = new KeyCode("NumStrip_1", 49),
    KeyCode.NumStrip_2 = new KeyCode("NumStrip_2", 50),
    KeyCode.NumStrip_3 = new KeyCode("NumStrip_3", 51),
    KeyCode.NumStrip_4 = new KeyCode("NumStrip_4", 52),
    KeyCode.NumStrip_5 = new KeyCode("NumStrip_5", 53),
    KeyCode.NumStrip_6 = new KeyCode("NumStrip_6", 54),
    KeyCode.NumStrip_7 = new KeyCode("NumStrip_7", 55),
    KeyCode.NumStrip_8 = new KeyCode("NumStrip_8", 56),
    KeyCode.NumStrip_9 = new KeyCode("NumStrip_9", 57)

);

class MouseButton extends Enum
{
    /**
     * Clase/Enum que alberga los códigos de botones del ratón.
     *
     * @param {string} name Nombre del `MouseButton`.
     * @memberof MouseButton
     */
    constructor(name, code)
    {
        super(name);
        this.classname = "MouseButton";
        this.code = code;
    }
}

const MouseButtons = new Array(
    MouseButton.Left = new MouseButton("Left", 0),
    MouseButton.Right = new MouseButton("Right", 2),
    MouseButton.Middle = new MouseButton("Middle", 1)
);

// Tags
class Tag extends Enum
{
    /**
     * Clase/Enum que alberga las diferentes tags.
     *
     * @param {string} name Nombre de `Tag`.
     * @memberof Tag
     */
    constructor(name)
    {
        super(name);
        this.classname = "Tag";
    }
}

{
    Tag.Default = new Tag("Default");
    Tag.Solid = new Tag("Solid");
    Tag.Player = new Tag("Player");
    Tag.UI = new Tag("UI");
    Tag.Enemy = new Tag("Enemy");
    Tag.AllyDMG = new Tag("AllyDMG");
}
//#endregion

//#region entity
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
     * @param {Entity} scene Escena a la que pertenece la entidad.
     * @param {Transform} transform Transformación inicial de la entidad.
     * @memberof Entity
     */
    constructor(id, scene, tag = Tag.Default, transform = new Transform())
    {
        this.components = new Map();
        this.scene = scene;
        this.id = id;
        this.tag = tag;
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
        let e = new Entity(this.id, this.scene, this.tag, this.updateCallback);
        this.components.forEach((c)=>
        {
            e.addComponent(c.clone());
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

    destroy()
    {
        //let behaviour = this.getComponent(ComponentType.Behaviour);
        let behaviour = this.components.get(ComponentType.Behaviour);
        if(behaviour != null && behaviour["onDestroy"].length > 0){
            behaviour.onDestroy();            
        }           
        this.scene.removeFromRun(this);
        this.removeComponent(ComponentType.Sprite);
        this.removeComponent(ComponentType.Collision);
        this.removeComponent(ComponentType.Behaviour);
        this.removeComponent(ComponentType.Kinematic);
    }

    update(dt)
    {
        let behaviour = this.getComponent(ComponentType.Behaviour);

        if(behaviour != null)
        {
            if(this.scene.frame == 0)
                behaviour.create();

            behaviour.update(dt);
        }

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

    renderDepth(ctx)
    {
        let sprite = this.getComponent(ComponentType.Sprite);

        if (sprite != null)
        {
            sprite.renderDepth(ctx);
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
     * @memberof Component
     */
    constructor()
    {
        this.type = ComponentType.Default;
        this.entity = undefined;
    }

    clone()
    {
        return new Component();
    }
}
//#endregion

//#region behaviour
class Behaviour extends Component
{
    constructor(on_create_behaviours, on_update_behaviours, on_destroy_behaviours, memory = new Map())
    {
        super();
        this.entity = undefined;

        this.behaviours =
        {
            create: on_create_behaviours,
            update: on_update_behaviours,
            onDestroy: on_destroy_behaviours
        };

        this.type = ComponentType.Behaviour;
        this.i_memory = memory;
        this.memory = memory;
    }

    clone()
    {
        return new Behaviour(this.behaviours["create"], this.behaviours["update"], this.behaviours["destroy"], new Map(this.memory));
    }

    create()
    {
        this.behaviours["create"].forEach(behaviour =>
        {
            behaviour(this.entity, this.memory);
        });
    }

    update(dt)
    {
        this.behaviours["update"].forEach(behaviour =>
        {
            behaviour(this.entity, this.memory, dt);
        });
    }

    onDestroy()
    {
        this.behaviours["destroy"].forEach(behaviour =>
        {
            behaviour(this.entity, this.memory);
        });
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
     *
     * @param {Victor} position Posición inicial.
     * @param {number} rotation Rotación inicial.
     * @param {Victor} scale Escala inicial.
     * @memberof Transform
     */
    constructor(position = new Victor(0, 0), rotation = 0, scale = new Victor(1, 1))
    {
        super();
        this.entity = undefined;
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
     * @returns {Transform} Copia del componente `Transform`.
     * @memberof Transform
     */
    clone()
    {
        return new Transform(this.position.clone(), this.rotation, this.scale.clone());
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

    /**
     * Multiplica las `Transform` locales de las entidades padre consecutivamente hasta llegar al root, devuelve la `Transform` global.
     *
     * @param {Entity[]} parents Entidades padre de esta misma. Se pueden obtener del atributo `parents` de los nodos de jsTree.
     * @returns {Transform} La transformación global del objeto que realiza la llamada.
     * @memberof Transform
     *
    updateGlobal()
    {
        // Actualiza el flag (si los padres no han cambiado, sigue siendo el mismo)
        this.g_flag = this.getFlag();

        // Si la transform global está actualizada, la devuelve
        if(this.g_flag)
        {
            return this;
        }
        // Si no:
        //  · Si es una entidad de la base del árbol, se actualiza y devuelve.
        else if(this.entity.parent == null)
        {
            this.g_position = this.position;
            this.g_rotation = this.rotation;
            this.g_scale = this.scale;

            console.log("Update root ["+this.entity.id+"]: " + this.g_position);
            //this.g_flag = true;
            return this;
        }
        //  · Si es una entidad hija, actualiza los padres recursivamente y realiza los cómputos necesarios.
        else
        {
            let that = this.entity.parent.getComponent(ComponentType.Transform).updateGlobal();
            let total = new Transform(this.entity,
                that.g_position.clone().add(this.position.clone().rotateByDeg(that.g_rotation).multiply(that.g_scale)),
                that.g_rotation + this.rotation,
                that.g_scale.clone().multiply(this.scale));

            this.g_position = total.position;
            this.g_rotation = total.rotation;
            this.g_scale = total.scale;

            //this.g_flag = true;

            console.log("Update child ["+this.entity.id+"]: " + this.g_position);

            return this;
        }
    }
    //*/

    /*
    getFlag()
    {
        if (this.entity.parent == null)
            return this.g_flag;
        else
            return this.g_flag && this.entity.parent.getComponent(ComponentType.Transform).getFlag();

    }*/

    /*applyParents(child, parent)
    {
        let total = this.clone;
        let next;

        while(parents.size > 0)
        {
            next = parent.pop();

        }


        return total;
    }*/

    /**
     * Computa los contenidos de las transformaciones.
     *
     * @param {Transform} child
     * @param {Transform} parent
     * @returns {Transform}
     * @memberof Transform
     */
    /*compute(child, parent)
    {
        let total = new Transform();



        return total;
    }*/

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
    /**
     * Creates an instance of Kinematic.
     * @param {Entity} entity Entidad (`Entity`) asociada este componente (orientativa, se determina definitivamente al añadirlo).
     * @param {any} [spd=new Victor()]
     * @param {any} [acc=new Victor()]
     * @param {any} [frc=new Victor(1, 1)]
     * @memberof Kinematic
     */
    constructor(spd = new Victor(), acc = new Victor(), frc = new Victor(1, 1))
    {
        super();
        this.entity = undefined;
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
    clone()
    {
        return new Kinematic(this.speed.clone(), this.acceleration.clone(), this.friction.clone());
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
            this.entity.getComponent(ComponentType.Transform).translate(this.speed.clone().multiply(Victor(dt, dt)));
        }
    }

    update(dt)
    {
        this.move(dt);
        this.applyAcceleration(dt);
        this.applyFriction(dt);
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
    constructor()
    {
        super();
        this.entity = undefined;
        this.type = ComponentType.Collider;
    }

    /**
     * Devuelve una copia de este componente `Collider`, con los mismos valores.
     *
     * @param {Entity} entity Entidad a la que el nuevo `Collider` estará asociado.
     * @returns {Collider} Copia del componente `Collider`.
     * @memberof Collider
     */
    clone()
    {
        return new Collider();
    }

    static positionMeeting(pos)
    {
        return false;
    }

    /**
     * Comprueba si, en una posición hipotética, este collider colisiona con alguna entidad;
     *
     * @param {Victor} pos supuesta posición en la que se comprueba la colisión
     * @param {Tag} tag Tag de los objetos con los que se quiere comprobar colisión.
     * @param {number} margin Máxima distancia a la que se comprueban colisiones (<0 = infinito).
     * @returns {Entity[]} Array de entidades con las que se ha colisionado o null;
     * @memberof Collider
     */
    placeMeeting(pos, tag, margin)
    {
        let collisionables = this.entity.scene.collisionables;

        let result = new Array();

        collisionables.forEach(e =>
        {
            let other_pos = e.getComponent(ComponentType.Transform).position;

            if(e.id != this.entity.id && e.tag == tag && (margin < 0 || pos.distance(other_pos) < margin))
            {
                //console.log("checking collision with " + e.id);
                if(this.checkCollision(pos, e.getComponent(ComponentType.Collider), other_pos))
                    result.push(e);
            }
        });

        return result.length == 0 ? null : result;

    }

    /**
     * Comprueba la colisión con otro `Collider`
     *
     * @param {Collider} other
     * @memberof RectCollider
     */
    checkCollision(pos, other, other_pos)
    {
        if(this != undefined && other != undefined && this.constructor.name == "RectCollider" && other.constructor.name == "RectCollider")
        {
            if(pos.x + this.offset.x < other_pos.x + other.width + other.offset.x &&
                pos.x + this.width + this.offset.x > other_pos.x + other.offset.x &&
                pos.y + this.offset.y < other_pos.y + other.height + other.offset.y &&
                pos.y + this.height + this.offset.y > other_pos.y + other.offset.y)
            {
                return true;
            }
        }
        return false;
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
    constructor(width, height, offset = Victor(0, 0))
    {
        super();
        this.entity = undefined;
        this.width = width;
        this.height = height;
        this.offset = offset;

    }

    clone()
    {
        return new RectCollider(this.width, this.height, this.offset);
    }
}
//#endregion

//#region graphics
/**
 * Renderiza un Sprite.
 *
 * @class Sprite
 * @extends {Component}
 */
class Sprite extends Component
{
    /**
     * Creates an instance of Sprite.
     *
     * @param {string[]} src
     * @param {Victor} origin
     * @param {number} depth
     * @memberof Sprite
     */
    constructor(src, depth, offset = new Victor(0, 0))
    {
        super();
        this.entity = undefined;
        this.offset = offset;
        this.depth = depth;
        this.src = src;
        this.image = new Image();
        this.image.src = src;

        this.type = ComponentType.Sprite;
    }

    /**
     * Devuelve una copia de este componente (`Sprite`) con los mismos valores.
     *
     * @param {Entity} entity Entidad (`Entity`) asociada a la copia del componente (orientativa, se determina definitivamente al añadirlo).
     * @returns {Sprite} Copia de este componente `Sprite`.
     * @memberof Sprite
     */
    clone()
    {
        return new Sprite(this.src, this.depth, this.offset.clone());
    }

    render(ctx)
    {
        let transform = this.entity.getComponent(ComponentType.Transform);
        let pos = transform.position;

        ctx.save();

        let tran = Victor(pos.x, pos.y);
        
        if (this.entity.scene.debug){
            let c = this.entity.getComponent(ComponentType.Collider);
            if(c){
                ctx.strokeStyle = "#fffa40";
                ctx.strokeRect(pos.x + c.offset.x, pos.y + c.offset.y, c.width * transform.scale.x, c.height * transform.scale.y);
            }
        }

        ctx.translate(tran.x, tran.y);
        ctx.rotate(transform.rotation*Math.PI/180);
        ctx.translate(-tran.x, -tran.y);        

        ctx.drawImage(this.image, 0, 0,
            this.image.width, this.image.height,
            pos.x + this.offset.x, pos.y + this.offset.y,
            this.image.width*transform.scale.x, this.image.height*transform.scale.y
        );

        ctx.restore();
    }

    /**
     * Cambia la imagen fuente del componente.
     *
     * _Si quieres cambiar la imagen de una entidad,
     * es mejor crear un nuevo Sprite con la ruta correspondiente y asignárselo (`entidad.addComponent(nuevoSprite)`),
     * en vez de cambiar la ruta del que ya tiene asignado_
     *
     * @param {string} src Ruta a la nueva imagen fuente.
     * @memberof Sprite
     */
    setImageSource(src, image_index)
    {
        this.src = src;
        this.image = new Image();
        this.image.src = src[image_index];
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
                layer: this.layer
            }
        };

        return o;
    }
}

class SpriteD extends Sprite
{
    /**
     * Creates an instance of Sprite.
     *
     * @param {string[]} src
     * @param {Victor} origin
     * @param {number} depth
     * @memberof Sprite
     */
    constructor(src, depth, offset = new Victor(0, 0), constraint_x = false, constraint_y = false)
    {
        super(src, depth, offset);
        this.constraint_x = constraint_x;
        this.constraint_y = constraint_y;
    }

    /**
     * Devuelve una copia de este componente (`Sprite`) con los mismos valores.
     *
     * @param {Entity} entity Entidad (`Entity`) asociada a la copia del componente (orientativa, se determina definitivamente al añadirlo).
     * @returns {Sprite} Copia de este componente `Sprite`.
     * @memberof Sprite
     */
    clone()
    {
        return new SpriteD(this.src, this.depth, this.offset.clone(), this.constraint_x, this.constraint_y);
    }

    render(ctx)
    {
        let transform = this.entity.getComponent(ComponentType.Transform);
        let pos = transform.position;
        let scene = this.entity.scene;
        let cam_pos = Victor(scene.view_x + scene.canvas_width*0.5, scene.view_y + scene.canvas_height*0.5);
        let depth_offset = Victor((cam_pos.x - pos.x)*0.05*this.depth, (cam_pos.y - pos.y)*0.05*this.depth);

        ctx.save();

        let tran = Victor(pos.x + (depth_offset.x * (this.constraint_x ? 0: 1)), pos.y + (depth_offset.y * (this.constraint_y ? 0: 1)));

        if (this.entity.scene.debug){
            let c = this.entity.getComponent(ComponentType.Collider);
            if(c){
                ctx.strokeStyle = "#fffa40";
                ctx.strokeRect(pos.x + c.offset.x, pos.y + c.offset.y, c.width * transform.scale.x, c.height * transform.scale.y);
            }
        }

        ctx.translate(tran.x, tran.y);
        ctx.rotate(transform.rotation*Math.PI/180);
        ctx.translate(-tran.x, -tran.y);

        ctx.drawImage(this.image,
            0,                                              0,
            this.image.width,                               this.image.height,
            this.offset.x + tran.x,         this.offset.y + tran.y,
            this.image.width*transform.scale.x * clamp((-this.depth)*2/15, 1, 1.8),  this.image.height*transform.scale.y * clamp((-this.depth)*2/15, 1, 1.8)
        );

        ctx.restore();
    }
}

/**
 * Renderiza una animación a partir de varios recursos.
 *
 * @class Animation
 * @extends {Sprite}
 */
class Animation extends Sprite
{
    /**
     * Creates an instance of Animation.
     * @param {string[]} src Rutas de las imágenes fuente.
     * @param {number} image_speed Velocidad de la animación:
     *
     * | image_speed | Efecto                             |
     * |:-----------:|:-----------------------------------|
     * |      1      |    Cambia de imagen cada frame.    |
     * |     0.33    | Cambia de imagen cada ~= 3 frames. |
     * |     0.2     |   Cambia de imagen cada 5 frames.  |
     * |      0      |        No cambia de imagen.        |
     *
     * @param {Victor} origin Centro de la imagen en coordenadas relativas.
     * @param {number} depth Capa en la que se renderiza la animación.
     * @memberof Animation
     */
    constructor(src, image_speed, depth, offset = new Victor(0, 0))
    {
        super(src[0], depth, offset);
        this.entity = undefined;

        this.src = src;
        this.image_speed = image_speed;

        this.anim_controller = 0;
        this.image_index = 0;
        this.frame_length = this.src.length;
    }

    /**
     * Devuelve una copia de este componente (`Animation`) con los mismos valores.
     *
     * @param {Entity} entity Entidad (`Entity`) asociada a la copia del componente (orientativa, se determina definitivamente al añadirlo).
     * @returns {Animation} Copia de este componente `Animation`.
     * @memberof Animation
     */
    clone()
    {
        return new Animation(this.src, this.image_speed, this.depth, this.offset.clone());
    }

    /**
     *
     *
     * @param {any} image_index
     * @memberof Animation
     */
    setImageIndex(image_index)
    {
        if(image_index >= this.frame_length){
            this.image_index = 0;
        }else{
            this.image_index = image_index;
        }
        this.setImageSource(this.src, this.image_index);
    }

    /**
     *
     *
     * @param {any} ctx
     * @memberof Animation
     */
    render(ctx)
    {
        super.render(ctx);

        // Asigna el frame correspondiente a la imagen.
        let aux = this.image_index;

        this.anim_controller += this.image_speed;

        if(this.anim_controller >= 1)
        {
            this.image_index += Math.sign(this.anim_controller);
            this.image_index %= this.frame_length;

            this.anim_controller = this.anim_controller % 1;
        }
        else if(this.anim_controller <= -1)
        {
            this.image_index += Math.ceil(this.anim_controller);
            this.image_index = this.image_index < 0 ? this.frame_length + Math.ceil(this.anim_controller) : this.image_index;

            this.anim_controller = this.anim_controller % 1;
        }

        if(aux != this.image_index)
            this.setImageSource(this.src, this.image_index);

    }

    renderDepth(ctx)
    {
        super.renderDepth(ctx);

        // Asigna el frame correspondiente a la imagen.
        let aux = this.image_index;

        this.anim_controller += this.image_speed;

        if(this.anim_controller >= 1)
        {
            this.image_index += Math.sign(this.anim_controller);
            this.image_index %= this.frame_length;

            this.anim_controller = this.anim_controller % 1;
        }
        else if(this.anim_controller <= -1)
        {
            this.image_index += Math.ceil(this.anim_controller);
            this.image_index = this.image_index < 0 ? this.frame_length + Math.ceil(this.anim_controller) : this.image_index;

            this.anim_controller = this.anim_controller % 1;
        }

        if(aux != this.image_index)
            this.setImageSource(this.src, this.image_index);

    }
}

class AnimationD extends SpriteD
{
    /**
     * Creates an instance of AnimationD.
     * @param {string[]} src Rutas de las imágenes fuente.
     * @param {number} image_speed Velocidad de la animación:
     *
     * | image_speed | Efecto                             |
     * |:-----------:|:-----------------------------------|
     * |      1      |    Cambia de imagen cada frame.    |
     * |     0.33    | Cambia de imagen cada ~= 3 frames. |
     * |     0.2     |   Cambia de imagen cada 5 frames.  |
     * |      0      |        No cambia de imagen.        |
     *
     * @param {Victor} origin Centro de la imagen en coordenadas relativas.
     * @param {number} depth Capa en la que se renderiza la animación.
     * @memberof AnimationD
     */
    constructor(src, image_speed, depth, offset = new Victor(0, 0))
    {
        super(src[0], depth, offset);
        this.entity = undefined;

        this.src = src;
        this.image_speed = image_speed;

        this.anim_controller = 0;
        this.image_index = 0;
        this.frame_length = this.src.length;
    }

    /**
     * Devuelve una copia de este componente (`Animation`) con los mismos valores.
     *
     * @param {Entity} entity Entidad (`Entity`) asociada a la copia del componente (orientativa, se determina definitivamente al añadirlo).
     * @returns {Animation} Copia de este componente `Animation`.
     * @memberof Animation
     */
    clone()
    {
        return new AnimationD(this.src, this.image_speed, this.depth, this.offset.clone());
    }

    setImageIndex(image_index)
    {
        if(image_index >= this.frame_length){
            this.image_index = 0;
        }else{
            this.image_index = image_index;
        }
        this.setImageSource(this.src, this.image_index);
    }
    /**
     *
     *
     * @param {any} ctx
     * @memberof Animation
     */
    render(ctx)
    {
        super.render(ctx);

        // Asigna el frame correspondiente a la imagen.
        let aux = this.image_index;

        this.anim_controller += this.image_speed;

        if(this.anim_controller >= 1)
        {
            this.image_index += Math.sign(this.anim_controller);
            this.image_index %= this.frame_length;

            this.anim_controller = this.anim_controller % 1;
        }
        else if(this.anim_controller <= -1)
        {
            this.image_index += Math.ceil(this.anim_controller);
            this.image_index = this.image_index < 0 ? this.frame_length + Math.ceil(this.anim_controller) : this.image_index;

            this.anim_controller = this.anim_controller % 1;
        }

        if(aux != this.image_index)
            this.setImageSource(this.src, this.image_index);

    }
}
//#endregion

//#region input
class Input
{
    constructor()
    {
        this.haxis = 0;
        this.vaxis = 0;
        this.mousePosition = Victor(0, 0);
        this.mouseCanvasPosition = Victor(0, 0);

        this.keysPressed = new Map();
        this.keysDown = new Map();
        this.keysUp = new Map();

        this.mousePressed = new Map();
        this.mouseDown = new Map();
        this.mouseUp = new Map();

        this.canvas = null;
    }

    init(target)
    {
        this.target = target;

        // Inicialización de arrays
        KeyCodes.forEach(key => {
            this.keysPressed.set(key, false);
            this.keysDown.set(key, false);
            this.keysUp.set(key, false);
        });

        MouseButtons.forEach(btn => {
            this.mousePressed.set(btn, false);
            this.mouseDown.set(btn, false);
            this.mouseUp.set(btn, false);
        });

        // Teclado
        document.addEventListener("keydown", e =>
        {
            //console.log(e.keyCode);
            KeyCodes.forEach(key => {
                if(e.keyCode == key.code)
                {
                    if(!this.keysPressed.get(key))
                    {
                        this.keysDown.set(key, true);
                        this.keysPressed.set(key, true);
                    }
                }
            });
        });

        document.addEventListener("keyup", e =>
        {
            //console.log(e.keyCode);
            KeyCodes.forEach(key => {
                if(e.keyCode == key.code)
                {
                    if(this.keysPressed.get(key))
                    {
                        this.keysUp.set(key, true);
                    }
                }
            });
        });


        // Touch
        // Bloquea el scroll al tocar el canvas
        window.blockMenuHeaderScroll = false;

        target.addEventListener("touchstart", e =>
        {
            if(!this.mousePressed.get(MouseButton.Left))
            {
                this.mouseDown.set(MouseButton.Left, true);
                this.mousePressed.set(MouseButton.Left, true);
            }

            // Scroll
            if ($(e.target).closest(target).length == 1)
            {
                window.blockMenuHeaderScroll = true;
            }

            //this.setMousePosition(e.clientX, e.clientY, target);
            this.setMousePosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY, target);
        });

        target.addEventListener("touchend", () =>
        {
            if(this.mousePressed.get(MouseButton.Left))
            {
                this.mouseUp.set(MouseButton.Left, true);
            }

            // Scroll
            window.blockMenuHeaderScroll = false;
        });

        target.addEventListener("touchmove", e =>
        {
            //this.setMousePosition(e.clientX, e.clientY, target);
            this.setMousePosition(e.changedTouches[0].clientX, e.changedTouches[0].clientY, target);
            if (window.blockMenuHeaderScroll)
            {
                e.preventDefault();
            }
        });

        // Mouse
        target.addEventListener("mousedown", e =>
        {
            MouseButtons.forEach(btn => {
                if(e.button == btn.code)
                {
                    if(!this.mousePressed.get(btn))
                    {
                        this.mouseDown.set(btn, true);
                        this.mousePressed.set(btn, true);
                    }
                }
            });
        });

        document.addEventListener("mouseup", e =>
        {
            MouseButtons.forEach(btn => {
                if(e.button == btn.code)
                {
                    if(this.mousePressed.get(btn))
                    {
                        this.mouseUp.set(btn, true);
                    }
                }
            });
        });

        // Posición del cursor (mouse)
        target.addEventListener("mousemove", e =>
        {
            this.setMousePosition(e.clientX, e.clientY, target);
        });


    }

    setMousePosition(x, y, target)
    {
        var rect = target.getBoundingClientRect(),
            scaleX = target.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = target.height / rect.height;  // relationship bitmap vs. element for Y


        this.mousePosition = Victor((x - rect.left)*scaleX + this.scene.view_x, (y - rect.top)*scaleY + this.scene.view_y);

        this.mouseCanvasPosition = Victor((x - rect.left)*scaleX, (y - rect.top)*scaleY);
    }

    earlyUpdate()
    {
        KeyCodes.forEach(key =>
        {
            if(this.keysUp.get(key))
                this.keysPressed.set(key, false);
        });

        MouseButtons.forEach(btn =>
        {
            if(this.mouseUp.get(btn))
                this.mousePressed.set(btn, false);
        });
    }

    lateUpdate()
    {
        KeyCodes.forEach(key =>
        {
            this.keysDown.set(key, false);
            this.keysUp.set(key, false);
        });

        MouseButtons.forEach(btn =>
        {
            this.mouseDown.set(btn, false);
            this.mouseUp.set(btn, false);
        });
    }

    getKeyDown(keyCode)
    {
        return this.keysDown.get(keyCode);
    }

    getKey(keyCode)
    {
        return this.keysPressed.get(keyCode);
    }

    getKeyUp(keyCode)
    {
        return this.keysUp.get(keyCode);
    }

    getMouseDown(mouseButton)
    {
        return this.mouseDown.get(mouseButton);
    }

    getMouseUp(mouseButton)
    {
        return this.mouseUp.get(mouseButton);
    }

    getMousePressed(mouseButton)
    {
        return this.mousePressed.get(mouseButton);
    }
}
//#endregion

//#region sound
class SoundManager
{
    constructor(soundsObject, src = [], whenLoaded = ()=>{})
    {
        this.sounds = soundsObject;
        this.src = src;
        this.loaded = false;
        this.whenLoaded = whenLoaded;
        this.setup();
    }

    setup()
    {
        this.sounds.load(this.src);
        this.sounds.whenLoaded = ()=>
        {
            this.loaded = true;
            this.whenLoaded();
        };
    }

    getSound(src)
    {
        return this.sounds[src];
    }
}
//#endregion

//#region scene
class Scene
{
    constructor(name, width, height, canvas_width, canvas_height)
    {
        this.entities = new Map();

        this.movables = new Map();
        this.collisionables = new Map();
        this.renderizables = new Map();
        this.renderizablesByDepth = new Map();

        this.sortRend = function(a, b)
        {
            let a_z = a[1];
            let b_z = b[1];
            
            if(b_z > a_z) return 1;
            if(a_z >= b_z) return -1;
            return 0;
        };

        this.name = name;
        this.running = SceneState.Pause;

        this.doPause = false;

        this.input = null;

        // Camera
        this.width = width;
        this.height = height;

        this.view_x = 0;
        this.view_y = 0;

        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;

        // SS
        this.shake = 0;
        this.kickY = 0;
        this.kickX = 0;

        this.frame = 0;
        //this.frameSkip = 0;


        this.ordered_draw = new Array();
        this.debug = false;
    }

    // Entidades

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

            this.renderizablesByDepth.set(new_e.id, new_e.getComponent(ComponentType.Sprite).depth);

            this.renderizablesByDepth = new Map([...this.renderizablesByDepth.entries()].sort(this.sortRend));


            if(this.debug)
            {
                //console.log(this.renderizablesByDepth);
            }
        }
        
        if(new_e.getComponent(ComponentType.Kinematic) != null || new_e.getComponent(ComponentType.Behaviour) != null)
        {
            this.movables.set(new_e.id, new_e);
        }
    }

    removeFromRun(entity)
    {
        this.renderizables.delete(entity.id);
        this.renderizablesByDepth.delete(entity.id);
        this.collisionables.delete(entity.id);
        this.movables.delete(entity.id);
    }

    getEntity(id)
    {
        return this.movables.get(id) || this.renderizables.get(id) || this.collisionables.get(id) || null;
    }
    // Control

    reset()
    {
        // Resetea los mapas
        this.collisionables = new Map();
        this.movables = new Map();
        this.renderizables = new Map();
        this.renderizablesByDepth = new Map();

        this.frame = 0;
        this.frameSkip = 0;
        // Añade de nuevo las entidades
        this.entities.forEach((e)=>
        {
            this.addToRun(e);
        });
    }

    play()
    {
        this.running = SceneState.Play;

        /*if(this.sound_manager != null && this.sound_manager.loaded){
            //el objeto sounds tiene muchas propiedades, entre ellas los propios sonidos
            //para manipular solo los sonidos comprobamos que la propiedad tenga la funcion pause
            $.each(this.sound_manager.sounds, function(index, sound){
                if(sound != null && typeof sound.play == 'function'){
                    sound.play();
                }
            });
        }*/
    }

    pause()
    {
        this.running = SceneState.Pause;

        /*if(this.sound_manager != null){
            //el objeto sounds tiene muchas propiedades, entre ellas los propios sonidos
            //para manipular solo los sonidos comprobamos que la propiedad tenga la funcion pause
            $.each(this.sound_manager.sounds, function(index, sound){
                if(sound != null && typeof sound.pause == 'function'){
                    sound.pause();
                }
            });
        }*/
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
        this.step();
        if(this.sound_manager != null){
            //el objeto sounds tiene muchas propiedades, entre ellas los propios sonidos
            //para manipular solo los sonidos comprobamos que la propiedad tenga la funcion pause
            $.each(this.sound_manager.sounds, function(index, sound){
                if(sound != null && typeof sound.pause == "function"){
                    sound.pause();
                }
            });
        }
    }

    //volumeMusic y volumeSound deben ser valores de una funcion log ya que el sonido no se percibe de forma lineal
    setVolume(volumeMusic, volumeSound, max){
        //comprobamos que sea musica comparando su nombre con los assets correspondientes
        let aux = max - volumeMusic > 0 ? Math.log(max - volumeMusic) : 0;
        volumeMusic = (1- (aux/ Math.log(max)));
        aux = max - volumeSound > 0 ? Math.log(max - volumeSound) : 0;
        volumeSound = (1- (aux/ Math.log(max)));

        let music = new Map().set("game-theme.mp3", true);
        if(this.sound_manager != null){
            $.each(this.sound_manager.sounds, function(index, sound){
                if(sound != null && sound.name != null){
                    if(music.get(sound.name.split("/").pop()) === true){
                        sound.volume = volumeMusic;
                    }else{
                        sound.volume = volumeSound;
                    }
                }
            });
        }
    }

    askforPause()
    {
        this.doPause = true;
    }

    checkPause()
    {
        if(this.doPause)
        {
            this.pause();
            this.doPause = false;
        }
    }

    // Bucle

    update(dt)
    {
        if(this.running == SceneState.Play)
        {
            /*if(this.frameSkip > 0)
            {
                this.frameSkip--;
                if(this.frameSkip%2 == 0)
                {
                    return;
                }
            }*/

            this.movables.forEach(function(e)
            {
                e.update(dt);
            }, this);
            this.frame++;
        }
        else if(this.running == SceneState.Step)
        {
            this.movables.forEach(function(e)
            {
                e.update(dt);
            }, this);
            this.askforPause();
            this.frame++;
        }
    }

    render(ctx)
    {
        if(this.running == SceneState.Play)
        {           
            this.draw(ctx);
        }
        else if(this.running == SceneState.Step)
        {
            this.draw(ctx);
            this.askforPause();
        }
    }

    draw(ctx)
    {
        // GetActualCamera
        this.camera = this.getEntity(this.camera.id);

        let cam_pos = this.camera.getComponent(ComponentType.Transform).position;

        this.view_x = clamp(cam_pos.x - this.canvas_width * 0.5 + this.shake*Math.sign(Math.random()-0.5), -80, this.width - this.canvas_width+80);
        this.view_y = clamp(cam_pos.y - this.canvas_height * 0.5 + this.shake*Math.sign(Math.random()-0.5), -80, this.height - this.canvas_height+80);

        /*this.view_x = cam_pos.x - this.canvas_width * 0.5 + this.shake*Math.sign(Math.random()-0.5) + this.kickX;
        this.view_y = cam_pos.y - this.canvas_height * 0.5 + this.shake*Math.sign(Math.random()-0.5) + this.kickY;*/

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, -this.view_x, -this.view_y);

        ctx.fillStyle = "#000000";

        ctx.clearRect(this.view_x, this.view_y, this.canvas_width, this.canvas_height);

        ctx.fillRect(this.view_x, this.view_y, this.canvas_width, this.canvas_height);

        // Draw
        this.renderizablesByDepth.forEach((depth, id)=>
        {
            this.renderizables.get(id).render(ctx);
        });

        ctx.restore();

        // Reducir screenshake
        this.shake = lerp(this.shake, 0, 1.8);
        this.kickX = lerp(this.kickX, 0, 0.02);
        this.kickY = lerp(this.kickY, 0, 0.02);
    }

    // Input

    setInput(input, target)
    {
        this.input = input;
        this.input.init(target);
        this.input.scene = this;
    }

    getInput()
    {
        return this.input;
    }

    // Camera
    setCamera(cam)
    {
        this.camera = cam;
    }

    addShake(power)
    {
        this.shake += power;
    }

    kick(vector)
    {
        this.kickX += vector.x;
        this.kickY += vector.y;
    }

    // Sound
    setSoundManager(sm)
    {
        this.sound_manager = sm;
    }

}
//#endregion

// Usa el siguiente comentario para desactivar los errores de librería que saca el linter
/*global 

Victor $
console log

Scene ComponentType Entity Transform Sprite Kinematic Collider Input KeyCode RectCollider Tag Behaviour MouseButton BehaviourType SoundManager SpriteD EasyStar Enum AnimationD

lerpAngle sounds lerp clamp
*/
