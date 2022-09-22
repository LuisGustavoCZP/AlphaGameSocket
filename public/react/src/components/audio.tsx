export class AudioMixer
{
    tracks : Map<string, HTMLAudioElement>;

    constructor (tracks : string[])
    {
        this.tracks = new Map<string, HTMLAudioElement>();
        tracks.forEach(track => 
        {
            this.tracks.set(track, new Audio());
        });
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
}