class Maths 
{
    public static degToRad = (Math.PI / 180);
    public static radToDeg = (180 / Math.PI);

    public static distance (x : number, y : number)
    {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }

    public static rotateTo (orientation : number, dirX : number, dirY : number) 
    {
        let maxDist = Maths.distance(dirX, dirY);

        dirX = maxDist > 0 ? dirX / maxDist : 0;
        dirY = maxDist > 0 ? dirY / maxDist : 0;
        let rad = (360 - orientation) * Maths.degToRad;
        let sin = Math.sin(rad), cos = Math.cos(rad);

        let odirX = (sin != 0? (sin)*dirX : 0) + (cos != 0? (cos)*dirY : 0);
        let odirY = (cos != 0? (cos)*dirX : 0) + (sin != 0? (sin)*dirY : 0);

        let angleDeg = (Math.atan2(-odirX, odirY) * Maths.radToDeg) + orientation;
        if(orientation / 180 > 1) angleDeg += 180;
        return angleDeg;
    }

    public static normalize (x : number)
    {
        return x / Math.abs(x);
    }

    public static normalize2 (x : number, y : number)
    {
        const max = Math.max(Math.abs(x), Math.abs(y));
        return {x: x / max, y: y / max};
    }
    
    public static lerp (a : number, b : number, t : number)
    {
        return a + ((b - a) * t);
    }

    public static rLerp (a : number, b : number, t : number)
    {
        a = a*Maths.degToRad;
        b = b*Maths.degToRad;
        let cs = (1-t)*Math.cos(a) + t*Math.cos(b);
        let sn = (1-t)*Math.sin(a) + t*Math.sin(b);
        return Math.atan2(sn,cs) * Maths.radToDeg;
    }

    public static shortAngleDist(a : number, b : number) 
    {
        a = a*Maths.degToRad;
        b = b*Maths.degToRad;
        var max = Math.PI*2;
        var da = (b - a) % max;
        return (2*da % max - da)*Maths.radToDeg;
    }
    
    public static angleLerp(a : number, b : number, t : number) 
    {
        return a + Maths.shortAngleDist(a, b) * t;
    }

    public static earp (a : number, b : number, t : number)
    {
        return a * Math.pow(b/a, t);
    }
}

export default Maths;
