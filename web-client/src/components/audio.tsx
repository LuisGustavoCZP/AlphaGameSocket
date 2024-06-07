export class AudioMixer
{
    tracks : Map<string, HTMLAudioElement>;

    #volume : number;

    constructor (tracks : string[])
    {
        this.#volume = 1;
        this.tracks = new Map<string, HTMLAudioElement>();
        tracks.forEach(track => 
        {
            this.tracks.set(track, new Audio());
        });

        const volume = localStorage.getItem("audio_volume");
        if(volume) 
        {
            this.volume = parseFloat(volume);
        }
        else this.volume = 0.5;
    }

    async play (track : string, src? : string)
    {
        if(!this.tracks.has(track)) return false;
        const audio = this.tracks.get(track)!;
        if(src) audio.src = src;
        if(audio.src) await audio.play();
        return true;
    }

    stop (track : string)
    {
        if(!this.tracks.has(track)) return false;
        const audio = this.tracks.get(track)!;
        audio.pause();
        return true;
    }

    loop(track:string)
    {
        if(!this.tracks.has(track)) return false;
        const audio = this.tracks.get(track)!;
        audio.loop = true;
    }

    get volume ()
    {
        return this.#volume;
    }

    set volume(vol:number)
    {
        this.#volume = vol;
        this.tracks.forEach(track=>
        {
            track.volume = vol;
        })
        localStorage.setItem("audio_volume", vol.toString());
    }
}